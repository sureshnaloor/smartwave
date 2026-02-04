import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";

export const dynamic = "force-dynamic";

/** GET /api/admin/me - Returns current admin session (super or admin user) from cookie */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    const payload = verifyAdminSession(token);
    if (!payload) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    if (payload.type === "super") {
      return NextResponse.json({
        session: { type: "super" },
      });
    }

    // Admin user: refresh limits from DB in case they were updated
    const coll = await getAdminUsersCollection();
    let user;
    try {
      user = await coll.findOne({ _id: new ObjectId(payload.adminId) });
    } catch {
      user = null;
    }
    if (!user) {
      return NextResponse.json({ session: null }, { status: 200 });
    }

    return NextResponse.json({
      session: {
        type: "admin",
        adminId: user._id.toString(),
        email: user.email,
        username: user.username,
        limits: user.limits,
        role: user.role || "corporate",
        firstLoginDone: user.firstLoginDone,
      },
    });
  } catch (e) {
    console.error("[admin me]", e);
    return NextResponse.json({ session: null }, { status: 200 });
  }
}
