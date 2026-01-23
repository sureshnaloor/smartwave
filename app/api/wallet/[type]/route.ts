
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getProfile } from "@/app/_actions/profile";
import { generateApplePass } from "@/lib/wallet/apple";
import { generateGoogleWalletUrl } from "@/lib/wallet/google";

export async function GET(
    req: NextRequest,
    { params }: { params: { type: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const profile = await getProfile(session.user.email);
        if (!profile) {
            return new NextResponse("Profile not found", { status: 404 });
        }

        const type = params.type;

        if (type === "apple") {
            try {
                const buffer = await generateApplePass(profile);
                return new NextResponse(new Uint8Array(buffer), {
                    headers: {
                        "Content-Type": "application/vnd.apple.pkpass",
                        "Content-Disposition": 'attachment; filename="smartwave.pkpass"',
                    },
                });
            } catch (err) {
                return new NextResponse(
                    JSON.stringify({ error: (err as Error).message }),
                    { status: 500, headers: { "Content-Type": "application/json" } }
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
