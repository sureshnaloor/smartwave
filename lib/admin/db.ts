import clientPromise from "@/lib/mongodb";
import type { AdminUser } from "./types";

const DB_NAME = process.env.MONGODB_DB || "smartwave";

export async function getAdminUsersCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<AdminUser>("adminusers");
}

export async function getAdminPassesCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection("admin_passes");
}
