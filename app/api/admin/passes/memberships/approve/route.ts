import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getUserPassMembershipsCollection } from "@/lib/admin/db";
import { ObjectId } from "mongodb";
import type { AdminSessionPayload } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";

async function getSession(req: NextRequest): Promise<AdminSessionPayload | null> {
    // 1. Check Admin Cookie (Direct Admin UI login)
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAdminSession(token) : null;
    if (payload) return payload;

    // 2. Check Regular User Session (Public Admin via Google/NextAuth)
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const usersColl = await getAdminUsersCollection();
        const admin = await usersColl.findOne({ email: session.user.email.toLowerCase() });

        if (admin && (admin.role === "public" || admin.role === "corporate")) {
            return {
                type: "admin",
                adminId: admin._id.toString(),
                email: admin.email,
                username: admin.username,
                limits: admin.limits || { profiles: 0, passes: 5 },
            };
        }
    }

    return null;
}

/**
 * POST /api/admin/passes/memberships/approve
 * Approve or reject a user's pass membership request
 */
export async function POST(req: NextRequest) {
    const session = await getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { membershipId, action } = body;

        if (!membershipId || !ObjectId.isValid(membershipId)) {
            return NextResponse.json({ error: "Invalid membership ID" }, { status: 400 });
        }

        if (action !== "approve" && action !== "reject") {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const membershipsColl = await getUserPassMembershipsCollection();
        const membership = await membershipsColl.findOne({ _id: new ObjectId(membershipId) });

        if (!membership) {
            return NextResponse.json({ error: "Membership not found" }, { status: 404 });
        }

        // If not super, must own the pass
        if (session.type !== "super") {
            const { getAdminPassesCollection } = await import("@/lib/admin/db");
            const adminPassesColl = await getAdminPassesCollection();
            const pass = await adminPassesColl.findOne({
                _id: membership.passId,
                createdByAdminId: new ObjectId(session.adminId)
            });
            if (!pass) {
                return NextResponse.json({ error: "Access denied" }, { status: 403 });
            }
        }

        if (membership.status !== "pending") {
            return NextResponse.json(
                { error: `Membership already ${membership.status}` },
                { status: 400 }
            );
        }

        const now = new Date();
        const update: any = {
            status: action === "approve" ? "approved" : "rejected",
        };

        if (action === "approve") {
            update.approvedAt = now;
            update.approvedBy = session.type === "admin" ? new ObjectId(session.adminId) : "super";
        } else {
            update.rejectedAt = now;
            update.rejectedBy = session.type === "admin" ? new ObjectId(session.adminId) : "super";
        }

        await membershipsColl.updateOne(
            { _id: new ObjectId(membershipId) },
            { $set: update }
        );

        const updated = await membershipsColl.findOne({ _id: new ObjectId(membershipId) });

        return NextResponse.json({
            success: true,
            membership: {
                ...updated,
                _id: updated!._id.toString(),
                userId: updated!.userId.toString(),
                passId: updated!.passId.toString(),
                approvedBy: updated!.approvedBy?.toString(),
                rejectedBy: updated!.rejectedBy?.toString(),
            },
        });
    } catch (error) {
        console.error("[admin/passes/memberships/approve POST]", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * GET /api/admin/passes/memberships/approve
 * Get pending membership requests
 */
export async function GET(req: NextRequest) {
    const session = await getSession(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const membershipsColl = await getUserPassMembershipsCollection();

        // Build aggregation pipeline
        const pipeline: any[] = [
            {
                $lookup: {
                    from: "admin_passes",
                    localField: "passId",
                    foreignField: "_id",
                    as: "pass",
                },
            },
            {
                $unwind: "$pass",
            }
        ];

        // If not super, filter by passes created by this admin
        if (session.type === "admin") {
            pipeline.push({
                $match: {
                    "pass.createdByAdminId": new ObjectId(session.adminId),
                },
            });
        }

        pipeline.push(
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: "$user",
            },
            {
                $sort: { requestedAt: -1 },
            }
        );

        const memberships = await membershipsColl.aggregate(pipeline).toArray();

        const plain = memberships.map((m) => ({
            _id: m._id.toString(),
            userId: m.userId.toString(),
            userEmail: m.userEmail,
            userName: m.user.name || m.user.email,
            passId: m.passId.toString(),
            passName: m.pass.name,
            status: m.status,
            requestedAt: m.requestedAt?.toISOString?.(),
            approvedAt: m.approvedAt?.toISOString?.(),
            approvedBy: m.approvedBy?.toString(),
            rejectedAt: m.rejectedAt?.toISOString?.(),
            rejectedBy: m.rejectedBy?.toString(),
            addedToWallet: m.addedToWallet,
            walletAddedAt: m.walletAddedAt?.toISOString?.(),
        }));

        return NextResponse.json({ memberships: plain });
    } catch (error) {
        console.error("[admin/passes/memberships/approve GET]", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

