import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

/** POST /api/admin/logout - Clears admin session cookie */
export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
