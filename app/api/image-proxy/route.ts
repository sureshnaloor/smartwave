import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const ALLOWED_HOST_SUFFIXES = [
  "res.cloudinary.com",
  "cloudinary.com",
  "lh3.googleusercontent.com",
  "googleusercontent.com",
]

function isAllowedImageUrl(rawUrl: string, requestOrigin: string): boolean {
  try {
    const parsed = new URL(rawUrl, requestOrigin)
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false
    if (parsed.origin === requestOrigin) return true
    return ALLOWED_HOST_SUFFIXES.some(
      (suffix) => parsed.hostname === suffix || parsed.hostname.endsWith(`.${suffix}`)
    )
  } catch {
    return false
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawUrl = request.nextUrl.searchParams.get("url")
  if (!rawUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 })
  }

  const requestOrigin = request.nextUrl.origin
  if (!isAllowedImageUrl(rawUrl, requestOrigin)) {
    return NextResponse.json({ error: "URL not allowed" }, { status: 403 })
  }

  const targetUrl = new URL(rawUrl, requestOrigin).toString()

  try {
    const upstream = await fetch(targetUrl, { cache: "no-store" })
    if (!upstream.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: upstream.status })
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg"
    const buffer = await upstream.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 })
  }
}
