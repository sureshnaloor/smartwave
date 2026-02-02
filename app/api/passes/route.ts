
import { NextResponse } from "next/server";
import { getAdminPassesCollection } from "@/lib/admin/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/** GET /api/passes - List active passes for public/users */
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        const coll = await getAdminPassesCollection();
        const now = new Date();

        const query: any = {
            status: "active",
            $or: [
                { dateEnd: { $gt: now } },
                { dateEnd: { $exists: false } },
                { dateEnd: null }
            ]
        };

        const allPasses = await coll.find(query).sort({ dateStart: 1 }).toArray();

        let corporate: any[] = [];
        let corporateAdminId: string | null = null;
        let isEmployee = false;

        if (session?.user?.role === "employee" && session?.user?.email) {
            isEmployee = true;
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB || "smartwave");
            const user = await db.collection("users").findOne({ email: session.user.email });
            if (user?.createdByAdminId) {
                corporateAdminId = user.createdByAdminId.toString();
                // Fetch ALL company passes (even drafts) for the employee corporate tab
                const corpPasses = await coll.find({ createdByAdminId: user.createdByAdminId }).sort({ dateStart: 1 }).toArray();
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

        const passes = allPasses.map((p) => ({
            ...p,
            _id: (p as any)._id.toString(),
            createdByAdminId: (p as any).createdByAdminId.toString(),
            createdAt: (p as any).createdAt?.toISOString?.(),
            updatedAt: (p as any).updatedAt?.toISOString?.(),
            dateStart: (p as any).dateStart?.toISOString?.(),
            dateEnd: (p as any).dateEnd?.toISOString?.(),
        }));

        // Public passes are all active ones NOT from the user's company (to avoid duplicates)
        const publicPasses = corporateAdminId
            ? passes.filter(p => p.createdByAdminId !== corporateAdminId)
            : passes;

        return NextResponse.json({
            passes: publicPasses,
            corporate: corporate,
            isEmployee
        });
    } catch (e) {
        console.error("[passes GET]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
