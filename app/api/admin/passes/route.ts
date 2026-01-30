import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection, getAdminPassesCollection } from "@/lib/admin/db";
import type { AdminPassType } from "@/lib/admin/pass";

export const dynamic = "force-dynamic";

function getAdminId(req: NextRequest): string | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (!payload || payload.type !== "admin") return null;
  return payload.adminId;
}

/** GET /api/admin/passes - List passes for the logged-in admin */
export async function GET(req: NextRequest) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const coll = await getAdminPassesCollection();
    const list = await coll
      .find({ createdByAdminId: new ObjectId(adminId) })
      .sort({ updatedAt: -1 })
      .toArray();
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ _id: new ObjectId(adminId) });
    const limit = admin?.limits?.passes ?? 0;

    const plain = list.map((p) => ({
      ...p,
      _id: (p as any)._id.toString(),
      createdByAdminId: (p as any).createdByAdminId.toString(),
      createdAt: (p as any).createdAt?.toISOString?.(),
      updatedAt: (p as any).updatedAt?.toISOString?.(),
    }));

    return NextResponse.json({ passes: plain, limit, used: plain.length });
  } catch (e) {
    console.error("[admin passes GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/admin/passes - Create pass (enforces limit). Body: { name, description?, type: 'event'|'access' } */
export async function POST(req: NextRequest) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ _id: new ObjectId(adminId) });
    const limit = admin?.limits?.passes ?? 0;

    const passesColl = await getAdminPassesCollection();
    const used = await passesColl.countDocuments({ createdByAdminId: new ObjectId(adminId) });
    if (used >= limit) {
      return NextResponse.json(
        { error: `Pass limit reached (${limit}). Ask super admin to increase your limit.` },
        { status: 400 }
      );
    }

    const body = await req.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const type = (body.type === "event" || body.type === "access" ? body.type : "event") as AdminPassType;
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const now = new Date();
    const doc = {
      createdByAdminId: new ObjectId(adminId),
      name,
      description: typeof body.description === "string" ? body.description.trim() : undefined,
      type,
      status: "draft" as const,
      createdAt: now,
      updatedAt: now,
    };

    const insert = await passesColl.insertOne(doc);
    const created = await passesColl.findOne({ _id: insert.insertedId });
    const plain = {
      ...created,
      _id: (created as any)._id.toString(),
      createdByAdminId: (created as any).createdByAdminId.toString(),
      createdAt: (created as any).createdAt?.toISOString?.(),
      updatedAt: (created as any).updatedAt?.toISOString?.(),
    };
    return NextResponse.json({ pass: plain });
  } catch (e) {
    console.error("[admin passes POST]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
