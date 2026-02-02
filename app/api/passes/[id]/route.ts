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

        // If active, anyone authenticated (or public) can view
        if (pass.status === "active") {
            return NextResponse.json({ pass });
        }

        // If draft, only authorized users can view
        if (session?.user?.role === "employee" && session?.user?.email) {
            const client = await clientPromise;
            const db = client.db(process.env.MONGODB_DB || "smartwave");
            const user = await db.collection("users").findOne({ email: session.user.email });

            if (user?.createdByAdminId && user.createdByAdminId.toString() === pass.createdByAdminId.toString()) {
                return NextResponse.json({ pass });
            }
        }

        return new NextResponse("Pass is not active", { status: 403 });
    } catch (error) {
        console.error("Error fetching pass:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
