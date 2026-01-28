import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function verifyAuthToken(req: NextRequest, serialNumber: string) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("ApplePass ")) {
        return false;
    }

    const token = authHeader.replace("ApplePass ", "");

    // The token we set in apple.ts is "smartwave_secret_token_" + serialNumber
    const expectedToken = process.env.APPLE_PASS_AUTH_TOKEN || "smartwave_secret_token_" + serialNumber;

    return token === expectedToken;
}

export async function getProfileBySerialNumber(serialNumber: string) {
    const client = await clientPromise;
    const db = client.db("smartwave");

    try {
        // Attempt to convert serialNumber to ObjectId
        const _id = new ObjectId(serialNumber);
        const profile = await db.collection("profiles").findOne({ _id });
        if (profile) {
            return JSON.parse(JSON.stringify(profile));
        }
    } catch (e) {
        // If not a valid ObjectId, try as plain string
        const profile = await db.collection("profiles").findOne({ _id: serialNumber as any });
        if (profile) {
            return JSON.parse(JSON.stringify(profile));
        }
    }
    return null;
}
