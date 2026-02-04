import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession, hashPassword, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";
import { DEFAULT_ADMIN_LIMITS } from "@/lib/admin/types";

export const dynamic = "force-dynamic";

function requireSuperAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (!payload || payload.type !== "super") return null;
  return payload;
}

/** GET /api/admin/super/users - List all admin users (super admin only) */
export async function GET(req: NextRequest) {
  const session = requireSuperAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coll = await getAdminUsersCollection();
    const list = await coll
      .find({})
      .project({ password: 0 })
      .sort({ createdAt: -1 })
      .toArray();
    const plain = list.map((u) => ({
      ...u,
      _id: u._id.toString(),
      createdAt: u.createdAt?.toISOString?.() ?? u.createdAt,
      updatedAt: u.updatedAt?.toISOString?.() ?? u.updatedAt,
    }));
    return NextResponse.json({ users: plain });
  } catch (e) {
    console.error("[admin super users GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/admin/super/users - Create admin user (super admin only). Body: { email, username, password } */
export async function POST(req: NextRequest) {
  const session = requireSuperAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "Email, username and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const coll = await getAdminUsersCollection();
    const existing = await coll.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "An admin with this email already exists" }, { status: 400 });
    }

    const hashed = await hashPassword(password);
    const now = new Date();
    const role = (body.role === "public" || body.role === "corporate") ? body.role : "corporate";
    const limits = {
      profiles: role === "public" ? 0 : (typeof body.limits?.profiles === "number" ? body.limits.profiles : DEFAULT_ADMIN_LIMITS.profiles),
      passes: typeof body.limits?.passes === "number" ? body.limits.passes : DEFAULT_ADMIN_LIMITS.passes,
    };

    const insert = await coll.insertOne({
      email,
      username,
      password: hashed,
      role,
      firstLoginDone: false,
      limits,
      createdAt: now,
      updatedAt: now,
    });

    const user = await coll.findOne({ _id: insert.insertedId }, { projection: { password: 0 } });
    return NextResponse.json({
      user: {
        ...user,
        _id: user!._id.toString(),
        createdAt: user!.createdAt?.toISOString?.(),
        updatedAt: user!.updatedAt?.toISOString?.(),
      },
    });
  } catch (e) {
    console.error("[admin super users POST]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
