
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { AdminPass } from "@/lib/admin/pass";

export async function getPassById(passId: string): Promise<AdminPass | null> {
    const client = await clientPromise;
    const db = client.db("smartwave");
    try {
        const pass = await db.collection("admin_passes").findOne({ _id: new ObjectId(passId) });
        return pass as AdminPass | null;
    } catch (e) {
        console.error("Error fetching pass by ID", e);
        return null;
    }
}
