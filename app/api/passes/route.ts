
import { NextResponse } from "next/server";
import { getAdminPassesCollection, getUserPassMembershipsCollection, getAdminUsersCollection } from "@/lib/admin/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { filterPassesByLocation } from "@/lib/location-utils";
import type { PassCategory } from "@/lib/admin/pass";

export const dynamic = "force-dynamic";

/** GET /api/passes - List active passes for public/users with location and category filtering */
export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const coll = await getAdminPassesCollection();
        const now = new Date();

        // Parse query parameters
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category") as PassCategory | null;
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");
        const radius = searchParams.get("radius") || "20"; // Default 20km

        // Identify public admins
        const adminUsersColl = await getAdminUsersCollection();
        const publicAdmins = await adminUsersColl.find({ role: "public" }).toArray();
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
            query.category = category;
        }

        const allPasses = await coll.find(query).sort({ dateStart: 1 }).toArray();

        let corporate: any[] = [];
        let corporateAdminId: string | null = null;
        let isEmployee = false;
        let userId: ObjectId | null = null;

        if (session?.user?.email) {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB || "smartwave");
            const user = await db.collection("users").findOne({ email: session.user.email });

            if (user) {
                userId = user._id;

                if (session?.user?.role === "employee" && user?.createdByAdminId) {
                    isEmployee = true;
                    corporateAdminId = user.createdByAdminId.toString();

                    // Fetch ALL company passes (even drafts) for the employee corporate tab
                    const corpQuery: any = { createdByAdminId: user.createdByAdminId };
                    if (category && category !== "all") {
                        corpQuery.category = category;
                    }

                    const corpPasses = await coll.find(corpQuery).sort({ dateStart: 1 }).toArray();
                    corporate = corpPasses.map(p => ({
                        ...p,
                        _id: p._id.toString(),
                        createdByAdminId: p.createdByAdminId.toString(),
                        createdAt: p.createdAt?.toISOString?.(),
                        updatedAt: p.updatedAt?.toISOString?.(),
                        dateStart: p.dateStart?.toISOString?.(),
                        dateEnd: p.dateEnd?.toISOString?.(),
                    }));
                }
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

        let passes = allPasses.map((p) => ({
            ...p,
            _id: (p as any)._id.toString(),
            createdByAdminId: (p as any).createdByAdminId.toString(),
            createdAt: (p as any).createdAt?.toISOString?.(),
            updatedAt: (p as any).updatedAt?.toISOString?.(),
            dateStart: (p as any).dateStart?.toISOString?.(),
            dateEnd: (p as any).dateEnd?.toISOString?.(),
            location: p.location,
        }));

        // Apply location filtering if coordinates provided
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const radiusKm = parseFloat(radius);

            if (!isNaN(userLat) && !isNaN(userLng) && !isNaN(radiusKm)) {
                passes = filterPassesByLocation(passes as any, userLat, userLng, radiusKm);
                corporate = filterPassesByLocation(corporate as any, userLat, userLng, radiusKm);
            }
        }

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
            filters: {
                category: category || "all",
                location: lat && lng ? { lat: parseFloat(lat), lng: parseFloat(lng), radius: parseFloat(radius) } : null,
            }
        });
    } catch (e) {
        console.error("[passes GET]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
