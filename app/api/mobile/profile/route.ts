import { NextRequest, NextResponse } from "next/server";
import { getBearerUser } from "@/lib/mobile-auth";
import { getProfile, saveProfile, generateAndUpdateShortUrl } from "@/app/_actions/profile";
import type { ProfileData } from "@/app/_actions/profile";

export const dynamic = "force-dynamic";

/**
 * GET /api/mobile/profile
 * Authorization: Bearer <token>
 * Returns: profile JSON or 401. Ensures shorturl exists so the app can show Add to Wallet.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const user = getBearerUser(authHeader);
  if (!user?.email) {
    const hasBearer = authHeader?.toLowerCase().startsWith("bearer ");
    const tokenLen = hasBearer ? (authHeader!.slice(7).trim().length ?? 0) : 0;
    if (hasBearer && tokenLen > 0) {
      console.warn("[mobile profile GET] 401 invalid_token – received token length:", tokenLen);
    }
    const payload = {
      error: "Unauthorized",
      code: hasBearer ? "invalid_token" : "missing_token",
      hint: hasBearer
        ? "Token may be expired or invalid. Sign in again to get a new token."
        : "Send the JWT from the OAuth redirect: Authorization: Bearer <token>",
    };
    return NextResponse.json(payload, { status: 401 });
  }

  try {
    let profile = await getProfile(user.email);
    if (!profile) {
      // Create minimal profile so first-time Google/Apple sign-in users get 200 (callback may not have run yet)
      const created = await generateAndUpdateShortUrl(user.email);
      if (created.success) profile = await getProfile(user.email) ?? null;
    }
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    if (!profile.shorturl) {
      const result = await generateAndUpdateShortUrl(user.email);
      if (result.success) profile = await getProfile(user.email) ?? profile;
    }
    const plain = JSON.parse(JSON.stringify(profile)) as ProfileData;
    return NextResponse.json(plain);
  } catch (e) {
    console.error("[mobile profile GET]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/mobile/profile
 * Authorization: Bearer <token>
 * Body: partial profile (same fields as web)
 * Returns: { success: true } or error
 */
export async function PATCH(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const user = getBearerUser(authHeader);
  if (!user?.email) {
    const hasBearer = authHeader?.toLowerCase().startsWith("bearer ");
    const payload = {
      error: "Unauthorized",
      code: hasBearer ? "invalid_token" : "missing_token",
      hint: hasBearer
        ? "Token may be expired or invalid. Sign in again to get a new token."
        : "Send the JWT from the OAuth redirect: Authorization: Bearer <token>",
    };
    return NextResponse.json(payload, { status: 401 });
  }

  try {
    const body = await req.json();
    // Only allow updating profile fields (no _id, userEmail override)
    const allowedKeys = [
      "firstName", "lastName", "middleName", "photo", "birthday",
      "title", "company", "companyLogo", "workEmail", "personalEmail",
      "mobile", "workPhone", "fax", "homePhone",
      "workStreet", "workDistrict", "workCity", "workState", "workZipcode", "workCountry",
      "homeStreet", "homeDistrict", "homeCity", "homeState", "homeZipcode", "homeCountry",
      "website", "linkedin", "twitter", "facebook", "instagram", "youtube", "notes",
    ] as const;
    const updates: Partial<ProfileData> = {};
    for (const key of allowedKeys) {
      if (body[key] !== undefined) {
        (updates as Record<string, unknown>)[key] = body[key];
      }
    }

    const result = await saveProfile(updates, user.email);
    if (!result.success) {
      return NextResponse.json({ error: result.error ?? "Update failed" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[mobile profile PATCH]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
