import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import clientPromise from "@/lib/mongodb";
import { signMobileToken } from "@/lib/mobile-auth";
import { verifyState } from "@/lib/mobile-google-state";
import { generateAndUpdateShortUrl } from "@/app/_actions/profile";

export const dynamic = "force-dynamic";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * GET /api/mobile/auth/google/callback
 * Query: code, state (from Google redirect)
 * Verifies state, exchanges code for tokens, creates/finds user, issues JWT,
 * then redirects to returnUrl?token=JWT (from state)
 */
export async function GET(req: NextRequest) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return new NextResponse("Google auth not configured", { status: 503 });
  }

  const { searchParams } = req.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return new NextResponse("Missing code or state", { status: 400 });
  }

  try {
    const { returnUrl, code_verifier: codeVerifier } = verifyState(state);

    const origin = (process.env.MOBILE_GOOGLE_CALLBACK_BASE ?? req.nextUrl.origin).replace(/\/$/, "");
    const callbackUrl = `${origin}/api/mobile/auth/google/callback`;

    const oauth2 = new OAuth2Client(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      callbackUrl
    );

    const { tokens } = await oauth2.getToken({ code, codeVerifier });
    const idToken = tokens.id_token ?? null;
    if (!idToken) {
      return new NextResponse("Google did not return an id_token", { status: 400 });
    }

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return new NextResponse("Invalid Google token: no email", { status: 401 });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name ?? null;
    const image = payload.picture ?? null;

    const dbClient = await clientPromise;
    const db = dbClient.db(process.env.MONGODB_DB || "smartwave");
    let user = await db.collection("users").findOne({ email });

    if (!user) {
      const insert = await db.collection("users").insertOne({
        email,
        name,
        image,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await db.collection("users").findOne({ _id: insert.insertedId });
    }

    if (!user) {
      return new NextResponse("Failed to create user", { status: 500 });
    }

    // Ensure a profile exists so GET /api/mobile/profile returns 200 (avoids 404 and app reverting to sign-in)
    await generateAndUpdateShortUrl(user.email).catch((e) => {
      console.warn("[mobile auth google callback] ensure profile:", e);
    });

    const token = signMobileToken({
      email: user.email,
      id: user._id.toString(),
      name: user.name ?? undefined,
    });

    const sep = returnUrl.includes("?") ? "&" : "?";
    const redirectTo = `${returnUrl}${sep}token=${encodeURIComponent(token)}`;
    return NextResponse.redirect(redirectTo);
  } catch (e) {
    console.error("[mobile auth google callback]", e);
    const msg = e instanceof Error ? e.message : "Sign-in failed";
    return new NextResponse(`Something went wrong: ${msg}`, { status: 400 });
  }
}
