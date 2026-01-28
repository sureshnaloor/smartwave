import { NextRequest, NextResponse } from "next/server";
import { getRegistrationsForPass } from "@/lib/wallet/db";

// GET v1/devices/{deviceLibraryIdentifier}/registrations/{passTypeIdentifier}?passesUpdatedSince=tag
export async function GET(
    req: NextRequest,
    { params }: { params: { deviceId: string, passType: string } }
) {
    try {
        const { deviceId, passType } = params;
        const { searchParams } = new URL(req.url);
        const tag = searchParams.get("passesUpdatedSince");

        const registrations = await getRegistrationsForPass(passType, deviceId, tag || undefined);

        if (registrations.length === 0) {
            return new NextResponse(null, { status: 204 });
        }

        const serialNumbers = registrations.map(r => r.serialNumber);
        const lastUpdated = Math.max(...registrations.map(r => r.updatedAt.getTime())).toString();

        return NextResponse.json({
            lastUpdated,
            serialNumbers
        });
    } catch (error) {
        console.error("[Apple Wallet API] Fetch registrations error:", error);
        return new NextResponse(null, { status: 500 });
    }
}
