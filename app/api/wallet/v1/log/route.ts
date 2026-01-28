import { NextRequest, NextResponse } from "next/server";

// POST v1/log
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("[Apple Wallet Device Log]:", JSON.stringify(body, null, 2));
        return new NextResponse(null, { status: 200 });
    } catch (error) {
        return new NextResponse(null, { status: 500 });
    }
}
