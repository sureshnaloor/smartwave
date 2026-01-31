import { NextRequest, NextResponse } from "next/server";
import { signState } from "@/lib/mobile-google-state";

export const dynamic = "force-dynamic";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const STATE_SECRET = process.env.MOBILE_GOOGLE_STATE_SECRET || process.env.GOOGLE_CLIENT_SECRET;

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

/**
 * POST /api/mobile/auth/google/start
 * Body: { returnUrl: string, code_challenge: string, code_verifier: string }
 * Returns: { authUrl: string } — open this URL in the browser; after Google sign-in,
 *   user is redirected to our callback, then to returnUrl?token=JWT
 */
export async function POST(req: NextRequest) {
  if (!GOOGLE_CLIENT_ID || !STATE_SECRET) {
    return NextResponse.json(
      { error: "Google auth or MOBILE_GOOGLE_STATE_SECRET not configured" },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const returnUrl = typeof body.returnUrl === "string" ? body.returnUrl.trim() : "";
    const codeChallenge = typeof body.code_challenge === "string" ? body.code_challenge.trim() : "";
    const codeVerifier = typeof body.code_verifier === "string" ? body.code_verifier.trim() : "";

    if (!returnUrl || !codeChallenge || !codeVerifier) {
      return NextResponse.json(
        { error: "returnUrl, code_challenge, and code_verifier are required" },
        { status: 400 }
      );
    }
    if (!/^(exp:\/\/|smartwave:\/\/|https?:\/\/)/i.test(returnUrl)) {
      return NextResponse.json(
        { error: "returnUrl must start with exp://, smartwave://, or https://" },
        { status: 400 }
      );
    }

    // When behind ngrok/proxy, req.nextUrl.origin can be localhost; use env so redirect_uri matches Google Console
    const origin = (process.env.MOBILE_GOOGLE_CALLBACK_BASE ?? req.nextUrl.origin).replace(/\/$/, "");
    const callbackUrl = `${origin}/api/mobile/auth/google/callback`;

    const state = signState({
      returnUrl,
      code_verifier: codeVerifier,
      exp: Date.now() + 5 * 60 * 1000,
    });

    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: callbackUrl,
      response_type: "code",
      scope: "openid profile email",
      state,
      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      prompt: "select_account",
    });

    const authUrl = `${AUTH_URL}?${params.toString()}`;
    return NextResponse.json({ authUrl });
  } catch (e) {
    console.error("[mobile auth google start]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to build auth URL" },
      { status: 500 }
    );
  }
}
