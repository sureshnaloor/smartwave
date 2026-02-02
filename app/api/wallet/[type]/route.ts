
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, getProfileByShortUrl, generateAndUpdateShortUrl } from "@/app/_actions/profile";
import { generateApplePass } from "@/lib/wallet/apple";
import { generateGoogleWalletUrl, updateGoogleWalletObject } from "@/lib/wallet/google";
import { getPassById } from "@/lib/wallet/pass-helper";

// ... existing imports ...

export async function GET(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const shorturl = searchParams.get("shorturl");
        const passId = searchParams.get("passId");

        let profile = null;

        if (shorturl) {
            profile = await getProfileByShortUrl(shorturl);
        } else {
            const session = await getServerSession(authOptions);
            const email = session?.user?.email;

            // If no session and no shorturl, we can't identify the user.
            // But if passId is provided, maybe we require login? 
            // The user said "users will have option... click add to wallet".
            // So they are likely logged in.
            if (!email) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
            profile = await getProfile(email);
        }

        if (!profile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        let passData: any = undefined;
        if (passId) {
            passData = await getPassById(passId);
            if (!passData) {
                return new NextResponse("Pass/Event not found", { status: 404 });
            }
        }

        // Ensure user has a short URL before generating wallet pass (legacy check, keep it)
        if (!profile.shorturl) {
            const session = await getServerSession(authOptions);
            const userEmail = profile.userEmail || session?.user?.email;
            if (userEmail) {
                const result = await generateAndUpdateShortUrl(userEmail);
                if (result.success && result.shorturl) {
                    profile.shorturl = result.shorturl;
                }
            }
        }

        const type = params.type;

        if (type === "apple") {
            try {
                console.log(`[Wallet API] Generating Apple Pass for ${profile.userEmail} (PassId: ${passId || 'profile'})...`);
                const userId = profile._id?.toString() || "manual_id";
                const host = req.headers.get("host") || "www.smartwave.name";
                const protocol = host.includes("localhost") ? "http" : "https";
                const webUrl = `${protocol}://${host}/api/wallet`;

                const buffer = await generateApplePass(profile, host, passData);

                console.log(`[Wallet API] Sending Apple Pass response (${buffer.length} bytes)`);

                return new NextResponse(buffer as any, {
                    status: 200,
                    headers: {
                        "Content-Type": "application/vnd.apple.pkpass",
                        "Content-Disposition": `attachment; filename="${passData ? 'event' : 'smartwave'}.pkpass"`,
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                    },
                });
            } catch (err) {
                console.error("[Wallet API] Apple Pass error:", err);
                return NextResponse.json(
                    { error: (err as Error).message },
                    { status: 500 }
                );
            }
        } else if (type === "google") {
            try {
                const host = req.headers.get("host") || "www.smartwave.name";

                // Force an update to Google's servers before redirecting.
                // This ensures that if the object ID already exists on Google's side,
                // it is updated with the latest profile/pass data.
                await updateGoogleWalletObject(profile, passData, host);

                const url = generateGoogleWalletUrl(profile, passData, host);
                return NextResponse.redirect(url);
            } catch (err) {
                console.error("[Wallet API] Google Wallet error:", err);
                return new NextResponse(
                    JSON.stringify({ error: (err as Error).message }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
                );
            }
        } else {
            return new NextResponse("Invalid wallet type", { status: 400 });
        }
    } catch (error) {
        console.error("Wallet API Error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
