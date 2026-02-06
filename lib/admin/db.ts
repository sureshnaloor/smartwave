import clientPromise from "@/lib/mongodb";
import type { AdminUser } from "./types";
import type { UserPassMembership } from "./pass";
import type { Notification } from "./notification";

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

export async function getNotificationsCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<Notification>("notifications");
}
