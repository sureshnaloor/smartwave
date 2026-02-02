import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdminSession, COOKIE_NAME } from "@/lib/admin/auth";
import { getAdminUsersCollection } from "@/lib/admin/db";

export const dynamic = "force-dynamic";

function getAdminId(req: NextRequest): string | null {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const payload = token ? verifyAdminSession(token) : null;
    if (!payload || payload.type !== "admin") return null;
    return payload.adminId;
}

/** GET /api/admin/company - Get company details for the logged-in admin */
export async function GET(req: NextRequest) {
    const adminId = getAdminId(req);
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const coll = await getAdminUsersCollection();
        const admin = await coll.findOne({ _id: new ObjectId(adminId) });

        // Return company details or empty object if not set
        return NextResponse.json({
            company: admin?.company || {
                name: "",
                email: "",
                logo: "",
                address: "",
                location: { lat: undefined, lng: undefined }
            }
        });
    } catch (e) {
        console.error("[admin company GET]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

/** PATCH /api/admin/company - Update company details */
export async function PATCH(req: NextRequest) {
    const adminId = getAdminId(req);
    if (!adminId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { name, email, logo, address, location } = body;

        const companyUpdate = {
            name: typeof name === 'string' ? name.trim() : "",
            email: typeof email === 'string' ? email.trim() : "",
            logo: typeof logo === 'string' ? logo.trim() : "",
            address: typeof address === 'string' ? address.trim() : "",
            location: {
                lat: typeof location?.lat === 'number' ? location.lat : undefined,
                lng: typeof location?.lng === 'number' ? location.lng : undefined,
            }
        };

        const coll = await getAdminUsersCollection();
        await coll.updateOne(
            { _id: new ObjectId(adminId) },
            { $set: { company: companyUpdate, updatedAt: new Date() } }
        );

        return NextResponse.json({ success: true, company: companyUpdate });
    } catch (e) {
        console.error("[admin company PATCH]", e);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
