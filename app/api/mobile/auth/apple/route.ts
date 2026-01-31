import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { createPublicKey } from "crypto";
import clientPromise from "@/lib/mongodb";
import { signMobileToken } from "@/lib/mobile-auth";

export const dynamic = "force-dynamic";

const APPLE_CLIENT_ID = process.env.APPLE_CLIENT_ID;
const APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";

type AppleJwtPayload = {
  sub: string;
  email?: string;
  email_verified?: boolean;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
};

async function verifyAppleIdToken(idToken: string): Promise<AppleJwtPayload> {
  const decoded = jwt.decode(idToken, { complete: true }) as { header: { kid: string }; payload: AppleJwtPayload } | null;
  if (!decoded?.header?.kid || !decoded?.payload) {
    throw new Error("Invalid Apple identity token");
  }

  const res = await fetch(APPLE_KEYS_URL);
  const { keys } = (await res.json()) as { keys: Array<{ kid: string; n: string; e: string; kty: string }> };
  const key = keys.find((k) => k.kid === decoded.header.kid);
  if (!key) throw new Error("Apple signing key not found");

  const publicKey = createPublicKey({
    key: key as { kty: string; n: string; e: string },
    format: "jwk",
  });

  const payload = jwt.verify(idToken, publicKey, {
    algorithms: ["RS256"],
    issuer: "https://appleid.apple.com",
    audience: [APPLE_CLIENT_ID],
  }) as AppleJwtPayload;

  return payload;
}

/**
 * POST /api/mobile/auth/apple
 * Body: { identityToken: string }
 * Verifies Apple identity token, finds/creates user, returns { token, user } (same shape as Google).
 */
export async function POST(req: NextRequest) {
  if (!APPLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "Apple Sign-In not configured. Set APPLE_CLIENT_ID (iOS bundle ID)." },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const identityToken = typeof body.identityToken === "string" ? body.identityToken.trim() : "";
    if (!identityToken) {
      return NextResponse.json(
        { error: "identityToken is required" },
        { status: 400 }
      );
    }

    const payload = await verifyAppleIdToken(identityToken);
    const appleId = payload.sub;
    const email = payload.email?.toLowerCase() ?? null;
    if (!email) {
      return NextResponse.json(
        { error: "Apple token has no email. User may have hidden it; we require email." },
        { status: 400 }
      );
    }

    const dbClient = await clientPromise;
    const db = dbClient.db(process.env.MONGODB_DB || "smartwave");
    let user = await db.collection("users").findOne({ email });

    if (!user) {
      const insert = await db.collection("users").insertOne({
        email,
        name: null,
        image: null,
        appleId,
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      user = await db.collection("users").findOne({ _id: insert.insertedId });
    } else if (!user.appleId) {
      await db.collection("users").updateOne(
        { _id: user._id },
        { $set: { appleId, updatedAt: new Date() } }
      );
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
    console.error("[mobile auth apple]", e);
    const msg = e instanceof Error ? e.message : "Apple sign-in failed";
    return NextResponse.json({ error: msg }, { status: 401 });
  }
}
