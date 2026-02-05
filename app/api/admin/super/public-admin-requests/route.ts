
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

function requireSuperAdmin(req: NextRequest) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAdminSession(token) : null;
    if (!payload || payload.type !== "super") return null;
    return payload;
}

/** GET /api/admin/super/public-admin-requests - List all admin access requests */
export async function GET(req: NextRequest) {
    const session = requireSuperAdmin(req);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "smartwave");

        const requests = await db.collection("public_admin_requests")
            .find({})
            .sort({ createdAt: -1 })
            .toArray();

        // Serialize ObjectIds and Dates
        const plain = requests.map(r => ({
            ...r,
            _id: r._id.toString(),
            userId: r.userId.toString(),
            createdAt: r.createdAt?.toISOString?.() ?? r.createdAt,
            updatedAt: r.updatedAt?.toISOString?.() ?? r.updatedAt,
        }));

        return NextResponse.json({ requests: plain });
    } catch (e) {
        console.error("[public-admin-requests GET]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
