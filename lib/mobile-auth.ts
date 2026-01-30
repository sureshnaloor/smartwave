/**
 * Mobile app auth: issue and verify JWT for API access.
 * Uses same secret as NextAuth so we stay consistent.
 */
import jwt from "jsonwebtoken";

const secret = process.env.NEXTAUTH_SECRET;
if (!secret) {
  console.warn("[mobile-auth] NEXTAUTH_SECRET not set; mobile auth will fail.");
}

export interface MobileJwtPayload {
  email: string;
  id: string;
  name?: string;
  iat?: number;
  exp?: number;
}

const MOBILE_JWT_EXPIRY = "30d";

export function signMobileToken(payload: Omit<MobileJwtPayload, "iat" | "exp">): string {
  if (!secret) throw new Error("NEXTAUTH_SECRET is required for mobile auth");
  return jwt.sign(payload, secret, { expiresIn: MOBILE_JWT_EXPIRY });
}

export function verifyMobileToken(token: string): MobileJwtPayload | null {
  if (!secret) return null;
  try {
    const decoded = jwt.verify(token, secret) as MobileJwtPayload;
    return decoded;
  } catch {
    return null;
  }
}

export function getBearerUser(authHeader: string | null): MobileJwtPayload | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  return verifyMobileToken(token);
}
