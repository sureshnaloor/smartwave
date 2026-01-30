import { NextRequest, NextResponse } from "next/server";
import { verifySuperAdminCredentials, signAdminSession, COOKIE_NAME } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/super/login - Body: { email, password }. Sets cookie and returns { success }. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    if (!verifySuperAdminCredentials(email, password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminSession({ type: "super" });
    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });
    return res;
  } catch (e) {
    console.error("[admin super login]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
