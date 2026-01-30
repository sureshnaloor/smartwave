import { NextRequest, NextResponse } from "next/server";
import { verifyAdminUserCredentials, signAdminSession, COOKIE_NAME } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/login - Body: { email, password }. Sets cookie and returns { success, firstLoginDone }. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const user = await verifyAdminUserCredentials(email, password);
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminSession({
      type: "admin",
      adminId: user._id.toString(),
      email: user.email,
      username: user.username,
      limits: user.limits,
    });

    const res = NextResponse.json({
      success: true,
      firstLoginDone: user.firstLoginDone,
    });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("[admin login]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
