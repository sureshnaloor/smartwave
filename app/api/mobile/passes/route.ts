import { NextRequest, NextResponse } from "next/server";
import { getBearerUser } from "@/lib/mobile-auth";
import { getAdminPassesCollection, getUserPassMembershipsCollection, getAdminUsersCollection } from "@/lib/admin/db";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { PassCategory } from "@/lib/admin/pass";

export const dynamic = "force-dynamic";

/**
 * GET /api/mobile/passes
 * Authorization: Bearer <token>
 * Returns: passes list with membership status (aligned with web /api/passes).
 * - Retail: all public passes irrespective of location/date; tabs filter by status (upcoming, available, requested, expired, draft).
 * - Corporate employees: corporate tab shows only their company's passes/access.
 * - Public admins: myPasses array for "My Created" tab.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const user = getBearerUser(authHeader);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coll = await getAdminPassesCollection();
    const membershipsColl = await getUserPassMembershipsCollection();
    const adminUsersColl = await getAdminUsersCollection();
    const now = new Date();

    // Parse query parameters (no location filter for mobile - retail sees all passes)
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as PassCategory | null;

    const publicAdmins = await adminUsersColl.find({ role: { $in: ["public", "public_admin"] } as any }).toArray();
    const publicAdminIds = publicAdmins.map(a => a._id);

    const query: any = {
      status: "active",
      createdByAdminId: { $in: publicAdminIds },
      $or: [
        { dateEnd: { $gt: now } },
        { dateEnd: { $exists: false } },
        { dateEnd: null }
      ]
    };

    if (category && category !== "all") {
      if (category === "access") {
        const dateOr = [...query.$or];
        delete query.$or;
        query.$and = [
          { $or: dateOr },
          { $or: [{ category: "access" }, { type: "access" }] }
        ];
      } else {
        query.category = category;
      }
    }

    const allPasses = await coll.find(query).sort({ dateStart: 1 }).toArray();

    let corporate: any[] = [];
    let corporateAdminId: string | null = null;
    let isEmployee = false;
    let isPublicAdmin = false;
    let userId: ObjectId | null = null;
    let publicAdminId: string | null = null;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const dbUser = await db.collection("users").findOne({ email: user.email });

    if (dbUser) {
      userId = dbUser._id;
    }

    // Check if user is a public admin (adminusers entry with public/public_admin role)
    const adminUser = await adminUsersColl.findOne({ email: user.email.toLowerCase() });
    if (adminUser && (adminUser.role === "public" || (adminUser as any).role === "public_admin")) {
      isPublicAdmin = true;
      publicAdminId = adminUser._id.toString();
    }

    if (dbUser) {
      const effectiveRole = dbUser.role;
      if (effectiveRole === "employee" && (dbUser as any).createdByAdminId) {
        isEmployee = true;
        corporateAdminId = (dbUser as any).createdByAdminId.toString();

        const corpQuery: any = {
          createdByAdminId: new ObjectId(corporateAdminId),
        };
        if (category && category !== "all") {
          if (category === "access") {
            corpQuery.$or = [{ category: "access" }, { type: "access" }];
          } else {
            corpQuery.category = category;
          }
        }

        const corpPasses = await coll.find(corpQuery).sort({ dateStart: 1 }).toArray();
        corporate = corpPasses.map(p => ({
          ...p,
          _id: (p as any)._id.toString(),
          createdByAdminId: (p as any).createdByAdminId.toString(),
          createdAt: (p as any).createdAt?.toISOString?.(),
          updatedAt: (p as any).updatedAt?.toISOString?.(),
          dateStart: (p as any).dateStart?.toISOString?.(),
          dateEnd: (p as any).dateEnd?.toISOString?.(),
          type: (p as any).type,
          location: p.location,
        }));
      }
    }

    let userMemberships: any[] = [];
    let approvedPassIds: ObjectId[] = [];
    if (userId) {
      userMemberships = await membershipsColl.find({ userId }).toArray();
      approvedPassIds = userMemberships
        .filter(m => m.status === "approved")
        .map(m => m.passId);
    }

    // Include passes user has approved membership for (even if expired or draft) - same as web
    let approvedPasses: any[] = [];
    if (approvedPassIds.length > 0) {
      const approvedQuery: any = {
        _id: { $in: approvedPassIds },
        createdByAdminId: { $in: publicAdminIds },
      };
      if (category && category !== "all") {
        if (category === "access") {
          approvedQuery.$or = [{ category: "access" }, { type: "access" }];
        } else {
          approvedQuery.category = category;
        }
      }
      approvedPasses = await coll.find(approvedQuery).sort({ dateStart: 1 }).toArray();
    }

    const toPlain = (p: any) => ({
      ...p,
      _id: (p as any)._id.toString(),
      createdByAdminId: (p as any).createdByAdminId.toString(),
      createdAt: (p as any).createdAt?.toISOString?.(),
      updatedAt: (p as any).updatedAt?.toISOString?.(),
      dateStart: (p as any).dateStart?.toISOString?.(),
      dateEnd: (p as any).dateEnd?.toISOString?.(),
      type: (p as any).type,
      location: p.location,
    });

    let passes: any[] = allPasses.map(toPlain);
    const existingIds = new Set(passes.map(p => p._id));
    const additional = approvedPasses
      .filter(p => !existingIds.has((p as any)._id.toString()))
      .map(toPlain);
    passes = [...passes, ...additional];

    const passesWithMembership = passes.map(p => {
      const membership = userMemberships.find(m => m.passId.toString() === p._id);
      return {
        ...p,
        membershipStatus: membership?.status || null,
        membershipId: membership?._id?.toString() || null,
      };
    });

    const corporateWithMembership = corporate.map(p => {
      const membership = userMemberships.find(m => m.passId.toString() === p._id);
      return {
        ...p,
        membershipStatus: membership?.status || null,
        membershipId: membership?._id?.toString() || null,
      };
    });

    const publicPasses = corporateAdminId
      ? passesWithMembership.filter(p => p.createdByAdminId !== corporateAdminId)
      : passesWithMembership;

    // My passes for public admins (passes they created)
    let myPasses: any[] = [];
    if (isPublicAdmin && publicAdminId) {
      const myList = await coll
        .find({ createdByAdminId: new ObjectId(publicAdminId) })
        .sort({ updatedAt: -1 })
        .toArray();
      myPasses = await Promise.all(
        myList.map(async (p) => {
          const pendingCount = await membershipsColl.countDocuments({
            passId: p._id,
            status: "pending",
          });
          const plain = toPlain(p);
          const membership = userMemberships.find(m => m.passId.toString() === plain._id);
          return {
            ...plain,
            membershipStatus: membership?.status || null,
            membershipId: membership?._id?.toString() || null,
            pendingMembershipsCount: pendingCount,
          };
        })
      );
    }

    return NextResponse.json({
      passes: publicPasses,
      corporate: corporateWithMembership,
      isEmployee,
      isPublicAdmin,
      myPasses,
      filters: {
        category: category || "all",
        location: null,
      }
    });
  } catch (e) {
    console.error("[mobile passes GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
