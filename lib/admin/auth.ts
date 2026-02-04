import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { getAdminUsersCollection } from "./db";
import type { AdminSessionPayload, AdminUser } from "./types";
import { DEFAULT_ADMIN_LIMITS } from "./types";

const COOKIE_NAME = "admin_session";
const JWT_SECRET = process.env.NEXTAUTH_SECRET;
const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;

/** Check if super admin credentials (from .env) are configured */
export function isSuperAdminConfigured(): boolean {
  return !!(SUPER_ADMIN_EMAIL && SUPER_ADMIN_PASSWORD);
}

/** Verify super admin email + password against .env */
export function verifySuperAdminCredentials(
  email: string,
  password: string
): boolean {
  if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) return false;
  const normalized = email.trim().toLowerCase();
  return normalized === SUPER_ADMIN_EMAIL && password === SUPER_ADMIN_PASSWORD;
}

/** Verify admin user (from MongoDB) credentials */
export async function verifyAdminUserCredentials(
  email: string,
  password: string
): Promise<AdminUser | null> {
  const coll = await getAdminUsersCollection();
  const user = await coll.findOne({ email: email.trim().toLowerCase() });
  if (!user?.password) return null;
  const valid = await compare(password, user.password);
  return valid ? user : null;
}

/** Hash password for storing in DB */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

/** Create JWT for admin session */
export function signAdminSession(payload: AdminSessionPayload): string {
  if (!JWT_SECRET) throw new Error("NEXTAUTH_SECRET required for admin session");
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

/** Verify and decode admin session JWT */
export function verifyAdminSession(token: string): AdminSessionPayload | null {
  if (!JWT_SECRET) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AdminSessionPayload;
    return decoded;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };
