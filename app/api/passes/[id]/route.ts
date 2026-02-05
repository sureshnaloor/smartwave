import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { getPassById } from "@/lib/wallet/pass-helper";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const pass = await getPassById(params.id);
        const session = await getServerSession(authOptions);

        if (!pass) {
            return new NextResponse("Pass not found", { status: 404 });
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB || "smartwave");

        // Check if current user is the owner
        let isOwner = false;
        if (session?.user?.email) {
            const adminUser = await db.collection("adminusers").findOne({ email: session.user.email.toLowerCase() });
            if (adminUser && adminUser._id.toString() === pass.createdByAdminId.toString()) {
                isOwner = true;
            }
        }

        const admin = await db.collection("adminusers").findOne({ _id: pass.createdByAdminId });
        const isAdminCorporate = !admin?.role || admin.role === "corporate";

        if (isAdminCorporate) {
            // Corporate passes are only visible to their own employees OR the owner
            if (isOwner) {
                return NextResponse.json({ pass, isOwner });
            }
            if (session?.user?.role === "employee" && session?.user?.email) {
                const user = await db.collection("users").findOne({ email: session.user.email });
                if (user?.createdByAdminId && user.createdByAdminId.toString() === pass.createdByAdminId.toString()) {
                    return NextResponse.json({ pass, isOwner: false });
                }
            }
            return new NextResponse("This corporate pass is only available to members of the respective organization.", { status: 403 });
        }

        // For public passes (public-admin created), anyone can view if active OR if they are the owner
        if (pass.status === "active" || isOwner) {
            return NextResponse.json({ pass, isOwner });
        }

        return new NextResponse("Pass is not available", { status: 403 });
    } catch (error) {
        console.error("Error fetching pass:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
