
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/** POST /api/user/public-admin-request - Public user requests to become a public admin */
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "smartwave");

        // Find existing user
        const user = await db.collection("users").findOne({ email: session.user.email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if user is already an admin or employee
        if (user.role === "employee" || user.role === "public_admin") {
            return NextResponse.json({ error: "User already has elevated permissions" }, { status: 400 });
        }

        // Check if request already exists and is pending
        const existingRequest = await db.collection("public_admin_requests").findOne({
            userId: user._id,
            status: "pending"
        });

        if (existingRequest) {
            return NextResponse.json({ error: "A request is already pending" }, { status: 400 });
        }

        // Create new request
        await db.collection("public_admin_requests").insertOne({
            userId: user._id,
            userEmail: user.email,
            userName: user.name || "Default User",
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return NextResponse.json({ success: true, message: "Request submitted successfully" });
    } catch (e) {
        console.error("[public-admin-request POST]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/** GET /api/user/public-admin-request - Check current user's request status */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ status: "none" });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "smartwave");

        const user = await db.collection("users").findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ status: "none" });

        if (user.role === "public_admin") {
            return NextResponse.json({ status: "approved" });
        }

        const lastRequest = await db.collection("public_admin_requests")
            .find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(1)
            .toArray();

        if (lastRequest.length === 0) {
            return NextResponse.json({ status: "none" });
        }

        return NextResponse.json({ status: lastRequest[0].status });
    } catch (e) {
        console.error("[public-admin-request GET]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
