import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcrypt";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export const dynamic = "force-dynamic";

/**
 * POST /api/mobile/set-password
 * Body: { password: string }
 * Requires: NextAuth session (logged in via Google or any provider).
 * Sets a password for the current user so they can sign in on the mobile app with email + password.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const password = typeof body.password === "string" ? body.password.trim() : "";
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const result = await db
      .collection("users")
      .updateOne(
        { email: session.user.email },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "App password set. You can now sign in on the mobile app with your email and this password.",
    });
  } catch (e) {
    console.error("[mobile set-password]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
