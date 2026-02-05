import { cookies } from "next/headers";
import { verifyAdminSession } from "./auth";
import { getAdminUsersCollection } from "./db";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import type { AdminSessionPayload } from "./types";

export type AdminSession =
  | { type: "super" }
  | {
    type: "admin";
    adminId: string;
    email: string;
    username: string;
    limits: { profiles: number; passes: number };
    firstLoginDone: boolean;
  };

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/** Get current admin session from cookie or NextAuth (for Server Components / server actions) */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) {
    // Check NextAuth session
    const nextSession = await getServerSession(authOptions);
    if (!nextSession?.user?.email) return null;

    const email = nextSession.user.email.toLowerCase();

    // 1. Try to find in adminusers first (this holds the limits)
    const adminUsersColl = await getAdminUsersCollection();
    let adminRecord = await adminUsersColl.findOne({ email });

    // 2. If not in adminusers, check if they are public_admin in the main users collection
    if (!adminRecord) {
      const client = await clientPromise;
      const db = client.db(process.env.MONGODB_DB || "smartwave");
      const mainUser = await db.collection("users").findOne({ email });

      if (mainUser && mainUser.role === "public_admin") {
        // Automatically create the adminrecord if missing for some reason
        const now = new Date();
        const insertRes = await adminUsersColl.insertOne({
          email,
          username: mainUser.name || email.split('@')[0],
          role: "public",
          firstLoginDone: true,
          limits: { profiles: 0, passes: 5 },
          createdAt: now,
          updatedAt: now,
          password: "" // No password needed for OAuth users
        } as any);
        adminRecord = await adminUsersColl.findOne({ _id: insertRes.insertedId });
      }
    }

    if (adminRecord && (adminRecord.role === "public" || adminRecord.role === "corporate")) {
      return {
        type: "admin",
        adminId: adminRecord._id.toString(),
        email: adminRecord.email,
        username: adminRecord.username,
        limits: adminRecord.limits,
        firstLoginDone: true,
      };
    }
    return null;
  }

  const payload = verifyAdminSession(token) as AdminSessionPayload | null;
  if (!payload) return null;

  if (payload.type === "super") return { type: "super" };

  const coll = await getAdminUsersCollection();
  const user = await coll.findOne({ _id: new ObjectId(payload.adminId) });
  if (!user)
    return null;

  return {
    type: "admin",
    adminId: user._id.toString(),
    email: user.email,
    username: user.username,
    limits: user.limits,
    firstLoginDone: user.firstLoginDone,
  };
}
