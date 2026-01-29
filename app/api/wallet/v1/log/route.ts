import { NextRequest, NextResponse } from "next/server";

// POST v1/log
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("-----------------------------------------");
        console.log("[Apple Wallet DEVICE ERROR LOG]:", JSON.stringify(body, null, 2));
        console.log("-----------------------------------------");
        return new NextResponse(null, { status: 200 });
    } catch (error) {
        return new NextResponse(null, { status: 500 });
    }
}
