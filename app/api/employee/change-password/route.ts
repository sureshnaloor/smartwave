import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hash } from "bcrypt";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/** POST /api/employee/change-password - Body: { newPassword }. Employee only; sets firstLoginDone and updates password. */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if ((session.user as { role?: string }).role !== "employee") {
    return NextResponse.json({ error: "Only employees can use this endpoint" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newPassword = typeof body.newPassword === "string" ? body.newPassword.trim() : "";
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const usersColl = db.collection("users");
    const hashed = await hash(newPassword, 10);

    const result = await usersColl.updateOne(
      { email: session.user.email },
      { $set: { password: hashed, firstLoginDone: true, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[employee change-password]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
