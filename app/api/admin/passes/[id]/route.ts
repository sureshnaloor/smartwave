import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminPassesCollection } from "@/lib/admin/db";
import type { AdminPassType } from "@/lib/admin/pass";

export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";

async function getAdminId(req: NextRequest): Promise<string | null> {
  // 1. Check Admin Cookie (Direct Admin UI login)
  const token = req.cookies.get(COOKIE_NAME)?.value;
  const payload = token ? verifyAdminSession(token) : null;
  if (payload && payload.type === "admin") return payload.adminId;

  // 2. Check Regular User Session (Public Admin via Google/NextAuth)
  const session = await getServerSession(authOptions);
  if (session?.user?.email) {
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ email: session.user.email.toLowerCase() });

    // Only return adminId if they have an active admin record
    if (admin && (admin.role === "public" || admin.role === "corporate")) {
      return admin._id.toString();
    }
  }

  return null;
}

/** GET /api/admin/passes/[id] - Get single pass (admin must own it) */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminId = await getAdminId(req);
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
  const adminId = await getAdminId(req);
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
    const usersColl = await getAdminUsersCollection();
    const admin = await usersColl.findOne({ _id: new ObjectId(adminId) });

    const update: Record<string, unknown> = {
      updatedAt: new Date(),
      isCorporate: admin?.role === "corporate",
      isPublic: admin?.role === "public"
    };
    if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();
    if (typeof body.description === "string") update.description = body.description.trim() || undefined;
    if (body.type === "event" || body.type === "access") update.type = body.type as AdminPassType;
    if (body.status === "draft" || body.status === "active") update.status = body.status;
    if (typeof body.category === "string") update.category = body.category;

    // Handle Location update
    if (body.location !== undefined) {
      if (body.location === null) {
        update.location = null;
      } else if (typeof body.location === 'object') {
        update.location = {
          name: body.location.name || "Unknown Location",
          lat: typeof body.location.lat === 'number' ? body.location.lat : undefined,
          lng: typeof body.location.lng === 'number' ? body.location.lng : undefined,
          address: typeof body.location.address === 'string' ? body.location.address : undefined
        };
      }
    }

    // Handle Date updates
    if (body.dateStart !== undefined) {
      update.dateStart = body.dateStart ? new Date(body.dateStart) : null;
    }
    if (body.dateEnd !== undefined) {
      update.dateEnd = body.dateEnd ? new Date(body.dateEnd) : null;
    }

    await coll.updateOne(
      { _id: new ObjectId(id), createdByAdminId: new ObjectId(adminId) },
      { $set: update }
    );

    const updated = await coll.findOne({ _id: new ObjectId(id) });
    
    // Create notification if status changed to active and admin is corporate
    if (body.status === "active" && existing.status !== "active" && admin?.role === "corporate") {
      const { notifyPassCreated } = await import("@/lib/admin/notification-helper");
      await notifyPassCreated(new ObjectId(adminId), updated!.name, id);
    }
    
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
  const adminId = await getAdminId(req);
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
