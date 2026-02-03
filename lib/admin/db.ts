import clientPromise from "@/lib/mongodb";
import type { AdminUser } from "./types";
import type { UserPassMembership } from "./pass";

const DB_NAME = process.env.MONGODB_DB || "smartwave";

export async function getAdminUsersCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<AdminUser>("adminusers");
}

export async function getAdminPassesCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection("admin_passes");
}

export async function getUserPassMembershipsCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<UserPassMembership>("user_pass_memberships");
}
