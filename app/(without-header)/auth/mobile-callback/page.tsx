"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const DEFAULT_SCHEME = "smartwave";

/**
 * Mobile Google auth redirector.
 * Use as returnUrl when calling POST /api/mobile/auth/google/start:
 *   returnUrl = `${API_BASE}/auth/mobile-callback`
 * After OAuth, the server redirects here with ?token=JWT.
 * This page redirects to {scheme}://auth/callback?token=JWT so the native app
 * can open (via deep link) and capture the token.
 */
export default function MobileAuthCallbackPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"redirecting" | "done" | "missing">("redirecting");

  useEffect(() => {
    const token = searchParams.get("token");
    const scheme = (typeof process.env.NEXT_PUBLIC_MOBILE_DEEP_LINK_SCHEME === "string"
      ? process.env.NEXT_PUBLIC_MOBILE_DEEP_LINK_SCHEME
      : DEFAULT_SCHEME).replace(/:\/?\/?$/, "");

    if (!token?.trim()) {
      setStatus("missing");
      return;
    }

    const deepLink = `${scheme}://auth/callback?token=${encodeURIComponent(token)}`;
    window.location.replace(deepLink);
    setStatus("done");
  }, [searchParams]);

  if (status === "missing") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <div className="text-center text-slate-600 dark:text-slate-400">
          <p className="font-medium">No token received</p>
          <p className="text-sm mt-2">Close this window and try signing in again from the app.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <div className="text-center text-slate-600 dark:text-slate-400">
        <p className="font-medium">Sign-in successful</p>
        <p className="text-sm mt-2">Redirecting you back to the app…</p>
        <p className="text-xs mt-4">If the app does not open, close this window and open the app manually.</p>
      </div>
    </div>
  );
}
