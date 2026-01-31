import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import clientPromise from "@/lib/mongodb";
import { signMobileToken } from "@/lib/mobile-auth";

export const dynamic = "force-dynamic";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * POST /api/mobile/auth/google
 * Body: { idToken: string } — Google ID token from OAuth (e.g. expo-auth-session with id_token)
 *   OR  { code: string, redirectUri: string } — auth code from OAuth; we exchange for id_token
 * Returns: { token: string, user: { id, email, name, image } } or 4xx/5xx
 */
export async function POST(req: NextRequest) {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: "Google auth not configured" }, { status: 503 });
  }

  try {
    const body = await req.json();
    let idToken: string | null =
      typeof body.idToken === "string" ? body.idToken.trim() : null;

    if (!idToken && typeof body.code === "string" && typeof body.redirectUri === "string") {
      const code = body.code.trim();
      const redirectUri = body.redirectUri.trim();
      if (!code || !redirectUri) {
        return NextResponse.json(
          { error: "code and redirectUri are required" },
          { status: 400 }
        );
      }
      const oauth2 = new OAuth2Client(
        GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET,
        redirectUri
      );
      const { tokens } = await oauth2.getToken(code);
      idToken = tokens.id_token ?? null;
      if (!idToken) {
        return NextResponse.json(
          { error: "Google did not return an id_token" },
          { status: 400 }
        );
      }
    }

    if (!idToken) {
      return NextResponse.json(
        { error: "idToken or (code + redirectUri) is required" },
        { status: 400 }
      );
    }

    const client = new OAuth2Client(GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload?.email) {
      return NextResponse.json(
        { error: "Invalid Google token: no email" },
        { status: 401 }
      );
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
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }

    const token = signMobileToken({
      email: user.email,
      id: user._id.toString(),
      name: user.name ?? undefined,
    });

    return NextResponse.json({
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name ?? null,
        image: user.image ?? null,
      },
    });
  } catch (e) {
    console.error("[mobile auth google]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Google sign-in failed" },
      { status: 500 }
    );
  }
}
