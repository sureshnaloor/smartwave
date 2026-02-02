import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function verifyAuthToken(req: NextRequest, serialNumber: string) {
    const authHeader = req.headers.get("Authorization");
    console.log(`[Auth] Checking token for serial ${serialNumber}. Header present: ${!!authHeader}`);

    if (!authHeader || !authHeader.startsWith("ApplePass ")) {
        console.warn(`[Auth] Invalid header format: ${authHeader?.substring(0, 20)}...`);
        return false;
    }

    const token = authHeader.replace("ApplePass ", "");
    const expectedToken = process.env.APPLE_PASS_AUTH_TOKEN || "smartwave_secret_token_" + serialNumber;

    const isValid = token === expectedToken;
    if (!isValid) console.warn(`[Auth] Token mismatch for ${serialNumber}`);
    return isValid;
}

export async function getProfileBySerialNumber(serialNumber: string) {
    const client = await clientPromise;
    const db = client.db("smartwave");


    // Check if serialNumber is composite (userId_passId)
    const potentialUserId = serialNumber.split('_')[0];

    try {
        // Attempt to convert potentialUserId to ObjectId
        const _id = new ObjectId(potentialUserId);
        const profile = await db.collection("profiles").findOne({ _id });
        if (profile) {
            console.log(`[Lookup] Found profile for ${serialNumber} via ObjectId (base user part)`);
            return JSON.parse(JSON.stringify(profile));
        }
    } catch (e) {
        // If not a valid ObjectId, try as plain string
        const profile = await db.collection("profiles").findOne({ _id: potentialUserId as any });
        if (profile) {
            console.log(`[Lookup] Found profile for ${serialNumber} via string ID`);
            return JSON.parse(JSON.stringify(profile));
        }
    }
    console.warn(`[Lookup] NO profile found for serial: ${serialNumber} (ID used: ${potentialUserId})`);
    return null;
}
