import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection, getAdminPassesCollection } from "@/lib/admin/db";
import type { AdminPassType, AdminPass } from "@/lib/admin/pass";

export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

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

/** GET /api/admin/passes - List passes for the logged-in admin */
export async function GET(req: NextRequest) {
  const adminId = await getAdminId(req);
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

    const plain = await Promise.all(list.map(async (p) => {
      const pendingCount = await (await import("@/lib/admin/db")).getUserPassMembershipsCollection().then(coll =>
        coll.countDocuments({ passId: p._id, status: "pending" })
      );

      return {
        ...p,
        _id: (p as any)._id.toString(),
        createdByAdminId: (p as any).createdByAdminId.toString(),
        createdAt: (p as any).createdAt?.toISOString?.(),
        updatedAt: (p as any).updatedAt?.toISOString?.(),
        pendingMembershipsCount: pendingCount
      };
    }));

    return NextResponse.json({ passes: plain, limit, used: plain.length });
  } catch (e) {
    console.error("[admin passes GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/** POST /api/admin/passes - Create pass (enforces limit). Body: { name, description?, type: 'event'|'access' } */
export async function POST(req: NextRequest) {
  const adminId = await getAdminId(req);
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
    const category = body.category || "all"; // Default to "all" if not specified

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const now = new Date();

    // Parse location
    let location: AdminPass["location"] | undefined = undefined;
    if (body.location) {
      if (typeof body.location === 'string') {
        location = { name: body.location };
      } else if (typeof body.location === 'object') {
        location = {
          name: body.location.name || "Unknown Location",
          lat: typeof body.location.lat === 'number' ? body.location.lat : undefined,
          lng: typeof body.location.lng === 'number' ? body.location.lng : undefined,
          address: typeof body.location.address === 'string' ? body.location.address : undefined
        };
      }
    }

    // Parse dates
    const dateStart = body.dateStart ? new Date(body.dateStart) : undefined;
    const dateEnd = body.dateEnd ? new Date(body.dateEnd) : undefined;

    const doc = {
      createdByAdminId: new ObjectId(adminId),
      name,
      description: typeof body.description === "string" ? body.description.trim() : undefined,
      type,
      category,
      location,
      dateStart,
      dateEnd,
      status: "draft" as const,
      isCorporate: admin?.role === "corporate",
      isPublic: admin?.role === "public",
      createdAt: now,
      updatedAt: now,
    };

    const insert = await passesColl.insertOne(doc);
    const created = await passesColl.findOne({ _id: insert.insertedId });
    
    // Create notification if pass is active and admin is corporate
    if (doc.status === "active" && admin?.role === "corporate") {
      const { notifyPassCreated } = await import("@/lib/admin/notification-helper");
      await notifyPassCreated(new ObjectId(adminId), name, insert.insertedId.toString());
    }
    
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
