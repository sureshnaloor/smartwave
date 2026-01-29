import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export type WalletRegistration = {
    deviceId: string;
    pushToken: string;
    passType: string;
    serialNumber: string;
    userEmail: string;
    updatedAt: Date;
};

export async function registerDevice(reg: Omit<WalletRegistration, 'updatedAt'>) {
    console.log(`[DB] Registering device: ${reg.deviceId} for user: ${reg.userEmail}`);
    const client = await clientPromise;
    const db = client.db("smartwave");

    const result = await db.collection("wallet_registrations").updateOne(
        {
            deviceId: reg.deviceId,
            serialNumber: reg.serialNumber
        },
        {
            $set: {
                ...reg,
                updatedAt: new Date()
            }
        },
        { upsert: true }
    );
    console.log(`[DB] Registration result:`, result.upsertedCount > 0 ? "Created" : "Updated");
}

export async function unregisterDevice(deviceId: string, serialNumber: string) {
    const client = await clientPromise;
    const db = client.db("smartwave");

    await db.collection("wallet_registrations").deleteOne({ deviceId, serialNumber });
}

export async function getRegistrationsForPass(passType: string, deviceId: string, tag?: string) {
    const client = await clientPromise;
    const db = client.db("smartwave");

    const query: any = { deviceId, passType };
    if (tag) {
        query.updatedAt = { $gt: new Date(parseInt(tag)) };
    }

    return await db.collection("wallet_registrations").find(query).toArray();
}

export async function getRegistrationsByUser(userEmail: string) {
    const client = await clientPromise;
    const db = client.db("smartwave");

    return await db.collection("wallet_registrations").find({ userEmail }).toArray();
}
