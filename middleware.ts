import { NextRequest, NextResponse } from "next/server";

/**
 * Middleware to add CORS headers for mobile API routes
 * Allows requests from Expo web dev server (localhost:8081) and other common origins
 */
export function middleware(request: NextRequest) {
  // Only apply to mobile API routes
  if (!request.nextUrl.pathname.startsWith("/api/mobile")) {
    return NextResponse.next();
  }

  const origin = request.headers.get("origin");
  const isDevelopment = process.env.NODE_ENV === "development";
  
  // In development, allow all localhost origins (more permissive)
  // In production, use strict whitelist
  let isAllowedOrigin = false;
  
  if (isDevelopment) {
    // Allow any localhost or 127.0.0.1 origin in development
    isAllowedOrigin = origin ? (
      origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:") ||
      origin === request.nextUrl.origin
    ) : false;
  } else {
    // Production: strict whitelist
    const allowedOrigins = [
      request.nextUrl.origin, // Same origin
      // Add production origins here
      // "https://www.smartwave.name",
    ];
    
    // Also allow origins from environment variable (comma-separated)
    const envOrigins = process.env.ALLOWED_CORS_ORIGINS?.split(",").map(o => o.trim()).filter(Boolean) || [];
    allowedOrigins.push(...envOrigins);
    
    isAllowedOrigin = origin ? allowedOrigins.includes(origin) : false;
  }

  // Handle preflight OPTIONS requests
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    
    if (isAllowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", origin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours
    }
    
    return response;
  }

  // For actual requests, add CORS headers
  const response = NextResponse.next();
  
  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.headers.set("Access-Control-Allow-Credentials", "true");
  }

  return response;
}

export const config = {
  matcher: "/api/mobile/:path*",
};
