"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";

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

  const headerClass = "border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 px-4 py-3";
  const linkClass = "font-semibold text-slate-800 dark:text-slate-200";
  const subLinkClass = "text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white";
  const mutedClass = "text-slate-500 dark:text-slate-400";
  const btnClass = "rounded bg-slate-200 px-3 py-1.5 text-sm text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600";

  if (session === "loading") {
    return (
      <header className={headerClass}>
        <div className="container mx-auto flex items-center justify-between">
          <span className={mutedClass}>Loading...</span>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  if (!session) {
    return (
      <header className={headerClass}>
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/admin" className={linkClass}>
            SmartWave Admin
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/admin/super" className={subLinkClass}>
              Super Admin
            </Link>
            <Link href="/admin/login" className={subLinkClass}>
              Admin Login
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className={headerClass}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href={session.type === "super" ? "/admin/super/dashboard" : "/admin/dashboard"} className={linkClass}>
            SmartWave Admin
          </Link>
          {session.type === "admin" && (
            <>
              <Link href="/admin/passes" className={subLinkClass}>
                My Passes
              </Link>
              <Link href="/admin/passes/memberships" className={subLinkClass}>
                Membership Requests
              </Link>
              <span className={`text-sm ${mutedClass}`}>
                {session.username} ({session.email})
              </span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button type="button" onClick={handleLogout} className={btnClass}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
