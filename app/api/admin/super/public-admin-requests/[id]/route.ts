
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

function requireSuperAdmin(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAdminSession(token) : null;
    if (!payload || payload.type !== "super") return null;
    return payload;
}

/** 
 * PATCH /api/admin/super/public-admin-requests/[id] - Approve or Reject a request.
 * Body: { status: "approved" | "rejected" }
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const session = requireSuperAdmin(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = params;
        const { status } = await req.json();

        if (status !== "approved" && status !== "rejected") {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "smartwave");

        // 1. Find request
        const request = await db.collection("public_admin_requests").findOne({ _id: new ObjectId(id) });
        if (!request) {
            return NextResponse.json({ error: "Request not found" }, { status: 404 });
        }

        // 2. Update request status
        await db.collection("public_admin_requests").updateOne(
            { _id: new ObjectId(id) },
            { $set: { status, updatedAt: new Date() } }
        );

        // 3. If approved, update user's role and create adminuser record
        if (status === "approved") {
            // Update the main user
            await db.collection("users").updateOne(
                { _id: new ObjectId(request.userId) },
                { $set: { role: "public_admin" } }
            );

            // Create or update adminusers record to allow pass creation through the existing API
            const adminUsersColl = db.collection("adminusers");
            const now = new Date();
            await adminUsersColl.updateOne(
                { email: request.userEmail.toLowerCase() },
                {
                    $set: {
                        email: request.userEmail.toLowerCase(),
                        username: request.userName || request.userEmail.split('@')[0],
                        role: "public",
                        firstLoginDone: true,
                        updatedAt: now,
                    },
                    $setOnInsert: {
                        createdAt: now,
                        limits: { profiles: 0, passes: 5 },
                        password: "",
                    }
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error("[public-admin-requests PATCH]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
