"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Session =
  | { type: "super" }
  | {
      type: "admin";
      adminId: string;
      email: string;
      username: string;
      limits: { profiles: number; passes: number };
      firstLoginDone?: boolean;
    };

export function AdminLayoutClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<Session | null | "loading">("loading");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => setSession(data.session ?? null))
      .catch(() => setSession(null));
  }, [pathname]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setSession(null);
    router.push("/admin");
    router.refresh();
  };

  if (session === "loading") {
    return (
      <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <span className="text-slate-400">Loading...</span>
        </div>
      </header>
    );
  }

  if (!session) {
    return (
      <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/admin" className="font-semibold text-slate-200">
            SmartWave Admin
          </Link>
          <div className="flex gap-4">
            <Link href="/admin/super" className="text-sm text-slate-400 hover:text-white">
              Super Admin
            </Link>
            <Link href="/admin/login" className="text-sm text-slate-400 hover:text-white">
              Admin Login
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={session.type === "super" ? "/admin/super/dashboard" : "/admin/dashboard"} className="font-semibold text-slate-200">
            SmartWave Admin
          </Link>
          {session.type === "admin" && (
            <span className="text-sm text-slate-400">
              {session.username} ({session.email})
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded bg-slate-700 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
