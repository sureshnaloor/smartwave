import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, hashPassword, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";

export const dynamic = "force-dynamic";

function requireSuperAdmin(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (!payload || payload.type !== "super") return null;
  return payload;
}

/** PATCH /api/admin/super/users/[id] - Update admin user (limits, optional password reset). Super admin only. */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireSuperAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = params.id;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const body = await req.json();
    const coll = await getAdminUsersCollection();
    const update: Record<string, unknown> = { updatedAt: new Date() };

    if (typeof body.limits?.profiles === "number") {
      update["limits.profiles"] = body.limits.profiles;
    }
    if (typeof body.limits?.passes === "number") {
      update["limits.passes"] = body.limits.passes;
    }
    if (typeof body.username === "string" && body.username.trim()) {
      update.username = body.username.trim();
    }
    if (typeof body.password === "string" && body.password.length >= 6) {
      update.password = await hashPassword(body.password);
      update.firstLoginDone = false;
    }

    const result = await coll.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const user = await coll.findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });
    return NextResponse.json({
      user: {
        ...user,
        _id: user!._id.toString(),
        createdAt: user!.createdAt?.toISOString?.(),
        updatedAt: user!.updatedAt?.toISOString?.(),
      },
    });
  } catch (e) {
    console.error("[admin super users PATCH]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/super/users/[id] - Delete admin user. Super admin only. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireSuperAdmin(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const id = params.id;
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const coll = await getAdminUsersCollection();
    const result = await coll.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[admin super users DELETE]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
