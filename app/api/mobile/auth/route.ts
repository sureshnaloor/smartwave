import { NextRequest, NextResponse } from "next/server";
import { compare } from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { signMobileToken } from "@/lib/mobile-auth";

export const dynamic = "force-dynamic";

/**
 * POST /api/mobile/auth
 * Body: { email: string, password: string }
 * Returns: { token: string, user: { id, email, name, image } } or 401
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const user = await db.collection("users").findOne({ email });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const token = signMobileToken({
      email: user.email,
      id: user._id.toString(),
      name: user.name ?? undefined,
    });

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name ?? null,
        image: user.image ?? null,
      },
    });
  } catch (e) {
    console.error("[mobile auth]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
