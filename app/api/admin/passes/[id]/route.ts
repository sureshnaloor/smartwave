import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminPassesCollection } from "@/lib/admin/db";
import type { AdminPassType } from "@/lib/admin/pass";

export const dynamic = "force-dynamic";

function getAdminId(req: NextRequest): string | null {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (!payload || payload.type !== "admin") return null;
  return payload.adminId;
}

/** GET /api/admin/passes/[id] - Get single pass (admin must own it) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = (await params).id;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid pass id" }, { status: 400 });

  try {
    const coll = await getAdminPassesCollection();
    const pass = await coll.findOne({
      _id: new ObjectId(id),
      createdByAdminId: new ObjectId(adminId),
    });
    if (!pass) {
      return NextResponse.json({ error: "Pass not found or access denied" }, { status: 404 });
    }
    const plain = {
      ...pass,
      _id: (pass as any)._id.toString(),
      createdByAdminId: (pass as any).createdByAdminId.toString(),
      createdAt: (pass as any).createdAt?.toISOString?.(),
      updatedAt: (pass as any).updatedAt?.toISOString?.(),
    };
    return NextResponse.json({ pass: plain });
  } catch (e) {
    console.error("[admin passes GET single]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** PATCH /api/admin/passes/[id] - Update pass (admin owner only). Body: { name?, description?, type?, status? } */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = (await params).id;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid pass id" }, { status: 400 });

  try {
    const coll = await getAdminPassesCollection();
    const existing = await coll.findOne({
      _id: new ObjectId(id),
      createdByAdminId: new ObjectId(adminId),
    });
    if (!existing) {
      return NextResponse.json({ error: "Pass not found or access denied" }, { status: 404 });
    }

    const body = await req.json();
    const update: Record<string, unknown> = { updatedAt: new Date() };
    if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();
    if (typeof body.description === "string") update.description = body.description.trim() || undefined;
    if (body.type === "event" || body.type === "access") update.type = body.type as AdminPassType;
    if (body.status === "draft" || body.status === "active") update.status = body.status;

    await coll.updateOne(
      { _id: new ObjectId(id), createdByAdminId: new ObjectId(adminId) },
      { $set: update }
    );

    const updated = await coll.findOne({ _id: new ObjectId(id) });
    const plain = {
      ...updated,
      _id: (updated as any)._id.toString(),
      createdByAdminId: (updated as any).createdByAdminId.toString(),
      createdAt: (updated as any).createdAt?.toISOString?.(),
      updatedAt: (updated as any).updatedAt?.toISOString?.(),
    };
    return NextResponse.json({ pass: plain });
  } catch (e) {
    console.error("[admin passes PATCH]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** DELETE /api/admin/passes/[id] - Delete pass (admin owner only) */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = getAdminId(req);
  if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = (await params).id;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid pass id" }, { status: 400 });

  try {
    const coll = await getAdminPassesCollection();
    const result = await coll.deleteOne({
      _id: new ObjectId(id),
      createdByAdminId: new ObjectId(adminId),
    });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Pass not found or access denied" }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Pass deleted." });
  } catch (e) {
    console.error("[admin passes DELETE]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
