
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile, getProfileByShortUrl, generateAndUpdateShortUrl } from "@/app/_actions/profile";
import { generateApplePass } from "@/lib/wallet/apple";
import { generateGoogleWalletUrl } from "@/lib/wallet/google";

export async function GET(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const shorturl = searchParams.get("shorturl");

        let profile = null;

        if (shorturl) {
            profile = await getProfileByShortUrl(shorturl);
        } else {
            const session = await getServerSession(authOptions);
            if (!session?.user?.email) {
                return new NextResponse("Unauthorized", { status: 401 });
            }
            profile = await getProfile(session.user.email);
        }

        if (!profile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        // Ensure user has a short URL before generating wallet pass
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
                console.log(`[Wallet API] Generating Apple Pass for ${profile.userEmail}...`);
                const buffer = await generateApplePass(profile);

                console.log(`[Wallet API] Sending Apple Pass response (${buffer.length} bytes)`);

                return new NextResponse(buffer as any, {
                    status: 200,
                    headers: {
                        "Content-Type": "application/vnd.apple.pkpass",
                        "Content-Disposition": 'attachment; filename="smartwave.pkpass"',
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
                const url = generateGoogleWalletUrl(profile);
                return NextResponse.redirect(url);
            } catch (err) {
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
