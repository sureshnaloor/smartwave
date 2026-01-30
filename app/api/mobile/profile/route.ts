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
  const user = getBearerUser(req.headers.get("authorization"));
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let profile = await getProfile(user.email);
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
  const user = getBearerUser(req.headers.get("authorization"));
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
