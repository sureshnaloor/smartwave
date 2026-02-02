import { NextRequest, NextResponse } from "next/server";
import { getPassById } from "@/lib/wallet/pass-helper";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const pass = await getPassById(params.id);

        if (!pass) {
            return new NextResponse("Pass not found", { status: 404 });
        }

        // Basic check to ensure it's "active" or at least not secret draft if that's a requirement.
        // For now, getPassById fetches whatever is in the DB. 
        // We might want to filter by status if it's strictly public.
        if (pass.status !== "active") {
            return new NextResponse("Pass is not active", { status: 403 });
        }

        return NextResponse.json({ pass });
    } catch (error) {
        console.error("Error fetching pass:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
