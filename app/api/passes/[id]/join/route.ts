import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminPassesCollection, getUserPassMembershipsCollection, getAdminUsersCollection } from "@/lib/admin/db";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * POST /api/passes/[id]/join
 * User requests to join a pass
 */
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const passId = params.id;
        if (!ObjectId.isValid(passId)) {
            return NextResponse.json({ error: "Invalid pass ID" }, { status: 400 });
        }

        // Get user from database
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "smartwave");
        const user = await db.collection("users").findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if pass exists and is active
        const passesColl = await getAdminPassesCollection();
        const pass = await passesColl.findOne({ _id: new ObjectId(passId) });

        if (!pass) {
            return NextResponse.json({ error: "Pass not found" }, { status: 404 });
        }

        if (pass.status !== "active") {
            return NextResponse.json({ error: "Pass is not active" }, { status: 400 });
        }

        // Check authorization: Corporate passes only for respective employees
        const adminUsersColl = await getAdminUsersCollection();
        const admin = await adminUsersColl.findOne({ _id: pass.createdByAdminId });

        // Treat as corporate if role is missing or explicitly corporate
        const isAdminCorporate = !admin?.role || admin.role === "corporate";

        if (isAdminCorporate) {
            const userCreatedByAdminId = (user as any).createdByAdminId?.toString();
            const passCreatedByAdminId = pass.createdByAdminId.toString();

            if ((user as any).role !== "employee" || userCreatedByAdminId !== passCreatedByAdminId) {
                return NextResponse.json({
                    error: "This corporate pass is only available to employees of the respective organization."
                }, { status: 403 });
            }
        }

        // Check if user already has a membership request
        const membershipsColl = await getUserPassMembershipsCollection();
        const existing = await membershipsColl.findOne({
            userId: user._id,
            passId: new ObjectId(passId),
        });

        if (existing) {
            return NextResponse.json(
                {
                    error: "You have already requested to join this pass",
                    membership: {
                        ...existing,
                        _id: existing._id.toString(),
                        userId: existing.userId.toString(),
                        passId: existing.passId.toString(),
                        approvedBy: existing.approvedBy?.toString(),
                        rejectedBy: existing.rejectedBy?.toString(),
                    }
                },
                { status: 400 }
            );
        }

        // Create membership request
        const now = new Date();
        const membership = {
            userId: user._id,
            userEmail: session.user.email,
            passId: new ObjectId(passId),
            status: "pending" as const,
            requestedAt: now,
            addedToWallet: false,
        };

        const result = await membershipsColl.insertOne(membership);
        const created = await membershipsColl.findOne({ _id: result.insertedId });

        return NextResponse.json({
            success: true,
            membership: {
                ...created,
                _id: created!._id.toString(),
                userId: created!.userId.toString(),
                passId: created!.passId.toString(),
            },
        });
    } catch (error) {
        console.error("[passes/join POST]", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/**
 * GET /api/passes/[id]/join
 * Get user's membership status for this pass
 */
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const passId = params.id;
        if (!ObjectId.isValid(passId)) {
            return NextResponse.json({ error: "Invalid pass ID" }, { status: 400 });
        }

        // Get user from database
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "smartwave");
        const user = await db.collection("users").findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get membership status
        const membershipsColl = await getUserPassMembershipsCollection();
        const membership = await membershipsColl.findOne({
            userId: user._id,
            passId: new ObjectId(passId),
        });

        if (!membership) {
            return NextResponse.json({ membership: null });
        }

        return NextResponse.json({
            membership: {
                ...membership,
                _id: membership._id.toString(),
                userId: membership.userId.toString(),
                passId: membership.passId.toString(),
                approvedBy: membership.approvedBy?.toString(),
                rejectedBy: membership.rejectedBy?.toString(),
            },
        });
    } catch (error) {
        console.error("[passes/join GET]", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
