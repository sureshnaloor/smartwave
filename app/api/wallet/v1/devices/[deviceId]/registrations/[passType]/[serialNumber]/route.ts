import { NextRequest, NextResponse } from "next/server";
import { registerDevice, unregisterDevice } from "@/lib/wallet/db";
import { verifyAuthToken, getProfileBySerialNumber } from "@/lib/wallet/api-helpers";

// POST v1/devices/{deviceLibraryIdentifier}/registrations/{passTypeIdentifier}/{serialNumber}
export async function POST(
    req: NextRequest,
    { params }: { params: { deviceId: string, passType: string, serialNumber: string } }
) {
    try {
        const { deviceId, passType, serialNumber } = params;

        if (!(await verifyAuthToken(req, serialNumber))) {
            return new NextResponse(null, { status: 401 });
        }

        const body = await req.json();
        const pushToken = body.pushToken;

        if (!pushToken) {
            return new NextResponse("Push token missing", { status: 400 });
        }

        const profile = await getProfileBySerialNumber(serialNumber);
        if (!profile) {
            return new NextResponse("Pass not found", { status: 404 });
        }

        await registerDevice({
            deviceId,
            pushToken,
            passType,
            serialNumber,
            userEmail: profile.userEmail
        });

        console.log(`[Apple Wallet] Registered device ${deviceId} for pass ${serialNumber}`);
        return new NextResponse(null, { status: 201 });
    } catch (error) {
        console.error("[Apple Wallet API] Registration error:", error);
        return new NextResponse(null, { status: 500 });
    }
}

// DELETE v1/devices/{deviceLibraryIdentifier}/registrations/{passTypeIdentifier}/{serialNumber}
export async function DELETE(
    req: NextRequest,
    { params }: { params: { deviceId: string, passType: string, serialNumber: string } }
) {
    try {
        const { deviceId, serialNumber } = params;

        if (!(await verifyAuthToken(req, serialNumber))) {
            return new NextResponse(null, { status: 401 });
        }

        await unregisterDevice(deviceId, serialNumber);

        console.log(`[Apple Wallet] Unregistered device ${deviceId} for pass ${serialNumber}`);
        return new NextResponse(null, { status: 200 });
    } catch (error) {
        console.error("[Apple Wallet API] Unregistration error:", error);
        return new NextResponse(null, { status: 500 });
    }
}
