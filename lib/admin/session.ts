import { cookies } from "next/headers";
import { verifyAdminSession } from "./auth";
import { getAdminUsersCollection } from "./db";
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

/** Get current admin session from cookie (for Server Components / server actions) */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return null;

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
