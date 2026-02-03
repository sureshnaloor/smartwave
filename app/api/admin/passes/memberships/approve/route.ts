import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getUserPassMembershipsCollection } from "@/lib/admin/db";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

function getAdminId(req: NextRequest): string | null {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAdminSession(token) : null;
    if (!payload || payload.type !== "admin") return null;
    return payload.adminId;
}

/**
 * POST /api/admin/passes/memberships/approve
 * Approve or reject a user's pass membership request
 * Body: { membershipId: string, action: 'approve' | 'reject' }
 */
export async function POST(req: NextRequest) {
    const adminId = getAdminId(req);
    if (!adminId) {
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
            update.approvedBy = new ObjectId(adminId);
        } else {
            update.rejectedAt = now;
            update.rejectedBy = new ObjectId(adminId);
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
 * Get all pending membership requests for admin's passes
 */
export async function GET(req: NextRequest) {
    const adminId = getAdminId(req);
    if (!adminId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const membershipsColl = await getUserPassMembershipsCollection();

        // Get all memberships with pass details
        const memberships = await membershipsColl
            .aggregate([
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
                },
                {
                    $match: {
                        "pass.createdByAdminId": new ObjectId(adminId),
                    },
                },
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
                },
            ])
            .toArray();

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
