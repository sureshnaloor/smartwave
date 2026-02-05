
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

        // Identify public admins (either via 'public' role in adminusers or 'public_admin' in main users)
        const adminUsersColl = await getAdminUsersCollection();
        // Include both current system 'public' and fallback 'public_admin' roles if any exist
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
                // For the 'Access' category, show anything of type 'access' OR category 'access'
                // We merge this with the existing $or that handles dates
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

        if (session?.user?.email) {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB || "smartwave");
            const user = await db.collection("users").findOne({ email: session.user.email });

            if (user) {
                userId = user._id;

                if (user.role === "public_admin") {
                    isPublicAdmin = true;
                }

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

        // Apply location filtering if coordinates provided
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const radiusKm = parseFloat(radius) || 500; // Much larger default radius

            if (!isNaN(userLat) && !isNaN(userLng)) {
                // For 'passes' (public/upcoming), filter events by location but keep ALL access passes
                const eventPasses = passes.filter(p => p.type === 'event');
                const accessPasses = passes.filter(p => p.type === 'access');

                const filteredEvents = filterPassesByLocation(eventPasses as any, userLat, userLng, radiusKm);
                passes = [...filteredEvents, ...accessPasses];

                // For corporate passes, keep them all if they are within the same org
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
            isPublicAdmin,
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
