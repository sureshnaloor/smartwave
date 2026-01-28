import { NextRequest, NextResponse } from "next/server";
import { verifyAuthToken, getProfileBySerialNumber } from "@/lib/wallet/api-helpers";
import { generateApplePass } from "@/lib/wallet/apple";

// GET v1/passes/{passTypeIdentifier}/{serialNumber}
export async function GET(
    req: NextRequest,
    { params }: { params: { passType: string, serialNumber: string } }
) {
    try {
        const { serialNumber } = params;

        if (!(await verifyAuthToken(req, serialNumber))) {
            return new NextResponse(null, { status: 401 });
        }

        const profile = await getProfileBySerialNumber(serialNumber);
        if (!profile) {
            return new NextResponse("Pass not found", { status: 404 });
        }

        const buffer = await generateApplePass(profile);

        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                "Content-Type": "application/vnd.apple.pkpass",
                "Last-Modified": new Date().toUTCString(),
            },
        });
    } catch (error) {
        console.error("[Apple Wallet API] Fetch pass error:", error);
        return new NextResponse(null, { status: 500 });
    }
}
