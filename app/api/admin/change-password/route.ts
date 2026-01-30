import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, hashPassword, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";

export const dynamic = "force-dynamic";

/** POST /api/admin/change-password - Body: { newPassword }. Admin session required. Updates password and firstLoginDone. */
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAdminSession(token) : null;

    if (!payload || payload.type !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const coll = await getAdminUsersCollection();
    const hashed = await hashPassword(newPassword);
    const result = await coll.updateOne(
      { _id: new ObjectId(payload.adminId) },
      { $set: { password: hashed, firstLoginDone: true, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin change-password]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
