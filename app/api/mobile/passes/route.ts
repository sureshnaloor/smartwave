import { NextRequest, NextResponse } from "next/server";
import { getBearerUser } from "@/lib/mobile-auth";
import { getAdminPassesCollection, getUserPassMembershipsCollection, getAdminUsersCollection } from "@/lib/admin/db";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { filterPassesByLocation } from "@/lib/location-utils";
import type { PassCategory } from "@/lib/admin/pass";

export const dynamic = "force-dynamic";

/**
 * GET /api/mobile/passes
 * Authorization: Bearer <token>
 * Returns: passes list with membership status (same structure as /api/passes but uses Bearer auth)
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const user = getBearerUser(authHeader);
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const coll = await getAdminPassesCollection();
    const now = new Date();

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") as PassCategory | null;

    // Identify public admins
    const adminUsersColl = await getAdminUsersCollection();
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

    // Add category filter if specified
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
    let userId: ObjectId | null = null;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || "smartwave");
    const dbUser = await db.collection("users").findOne({ email: user.email });

    if (dbUser) {
      userId = dbUser._id;

      // Check if user is an employee
      const effectiveRole = dbUser.role;
      if (effectiveRole === "employee" && (dbUser as any).createdByAdminId) {
        isEmployee = true;
        corporateAdminId = (dbUser as any).createdByAdminId.toString();

        // Fetch ALL company passes (even drafts) for the employee corporate tab
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

    // Get user memberships if logged in
    let userMemberships: any[] = [];
    if (userId) {
      const membershipsColl = await getUserPassMembershipsCollection();
      userMemberships = await membershipsColl
        .find({ userId })
        .toArray();
    }

    let passes: any[] = allPasses.map((p) => ({
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

    // Add membership status to passes
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

    // Public passes are all active ones NOT from the user's company (to avoid duplicates)
    const publicPasses = corporateAdminId
      ? passesWithMembership.filter(p => p.createdByAdminId !== corporateAdminId)
      : passesWithMembership;

    return NextResponse.json({
      passes: publicPasses,
      corporate: corporateWithMembership,
      isEmployee,
      isPublicAdmin: false,
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
