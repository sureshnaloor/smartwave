"use client";

import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * When an employee has not yet changed their temporary password,
 * redirect them to /employee/change-password. Place in (with-header) layout.
 */
export default function EmployeeFirstLoginRedirect() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    const user = session.user as { role?: string; firstLoginDone?: boolean };
    if (user.role !== "employee" || user.firstLoginDone !== false) return;
    if (pathname?.startsWith("/employee/change-password")) return;
    router.replace("/employee/change-password");
  }, [status, session, pathname, router]);

  return null;
}
