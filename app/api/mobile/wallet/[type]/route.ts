import { NextRequest, NextResponse } from "next/server";
import { getBearerUser } from "@/lib/mobile-auth";
import { getProfile } from "@/app/_actions/profile";
import { generateApplePass } from "@/lib/wallet/apple";
import { generateGoogleWalletUrl, updateGoogleWalletObject } from "@/lib/wallet/google";
import { getPassById } from "@/lib/wallet/pass-helper";
import { generateAndUpdateShortUrl } from "@/app/_actions/profile";

export const dynamic = "force-dynamic";

/**
 * GET /api/mobile/wallet/[type]
 * Authorization: Bearer <token>
 * Query params: passId (optional) - if provided, generates pass for that event/access pass
 * Returns: Apple Wallet .pkpass file or Google Wallet redirect
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { type: string } }
) {
  // Accept Bearer token from header or query parameter (for Linking.openURL compatibility)
  const authHeader = req.headers.get("authorization");
  const { searchParams } = new URL(req.url);
  const tokenFromQuery = searchParams.get("token");
  
  let user = getBearerUser(authHeader);
  if (!user && tokenFromQuery) {
    // Try token from query parameter as fallback
    const { verifyMobileToken } = await import("@/lib/mobile-auth");
    const payload = verifyMobileToken(tokenFromQuery);
    if (payload) {
      user = payload;
    }
  }
  
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const passId = searchParams.get("passId");

    // Get user profile
    let profile = await getProfile(user.email);
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Ensure user has a short URL before generating wallet pass
    if (!profile.shorturl) {
      const result = await generateAndUpdateShortUrl(user.email);
      if (result.success && result.shorturl) {
        profile = await getProfile(user.email) ?? profile;
      }
    }

    let passData: any = undefined;
    if (passId) {
      passData = await getPassById(passId);
      if (!passData) {
        return NextResponse.json({ error: "Pass/Event not found" }, { status: 404 });
      }

      // Verify user has access to this pass (must be approved)
      const client = await (await import("@/lib/mongodb")).default;
      const db = client.db(process.env.MONGODB_DB || "smartwave");
      const dbUser = await db.collection("users").findOne({ email: user.email });
      
      if (dbUser) {
        const { getUserPassMembershipsCollection } = await import("@/lib/admin/db");
        const membershipsColl = await getUserPassMembershipsCollection();
        const membership = await membershipsColl.findOne({
          userId: dbUser._id,
          passId: passData._id,
          status: "approved",
        });

        if (!membership) {
          return NextResponse.json(
            { error: "You must be approved for this pass before adding it to your wallet." },
            { status: 403 }
          );
        }
      }
    }

    const type = params.type;

    if (type === "apple") {
      try {
        console.log(`[Mobile Wallet API] Generating Apple Pass for ${user.email} (PassId: ${passId || 'profile'})...`);
        const userId = profile._id?.toString() || "manual_id";
        const host = req.headers.get("host") || "www.smartwave.name";
        const protocol = host.includes("localhost") ? "http" : "https";
        const webUrl = `${protocol}://${host}/api/wallet`;

        const buffer = await generateApplePass(profile, host, passData);

        console.log(`[Mobile Wallet API] Sending Apple Pass response (${buffer.length} bytes)`);

        return new NextResponse(buffer as any, {
          status: 200,
          headers: {
            "Content-Type": "application/vnd.apple.pkpass",
            "Content-Disposition": `attachment; filename="${passData ? 'event' : 'smartwave'}.pkpass"`,
            "Cache-Control": "no-cache, no-store, must-revalidate",
          },
        });
      } catch (err) {
        console.error("[Mobile Wallet API] Apple Pass error:", err);
        return NextResponse.json(
          { error: (err as Error).message },
          { status: 500 }
        );
      }
    } else if (type === "google") {
      try {
        const host = req.headers.get("host") || "www.smartwave.name";

        // Force an update to Google's servers before redirecting.
        await updateGoogleWalletObject(profile, passData, host);

        const url = generateGoogleWalletUrl(profile, passData, host);
        return NextResponse.redirect(url);
      } catch (err) {
        console.error("[Mobile Wallet API] Google Wallet error:", err);
        return NextResponse.json(
          { error: (err as Error).message },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json({ error: "Invalid wallet type" }, { status: 400 });
    }
  } catch (error) {
    console.error("[Mobile Wallet API] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
