import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin/session";
import Link from "next/link";

export default async function AdminHomePage() {
  const session = await getAdminSession();

  if (session?.type === "super") {
    redirect("/admin/super/dashboard");
  }

  if (session?.type === "admin") {
    if (!session.firstLoginDone) {
      redirect("/admin/change-password");
    }
    redirect("/admin/dashboard");
  }

  return (
    <div className="mx-auto max-w-md space-y-8 pt-12 text-center">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Area</h1>
      <p className="text-slate-600 dark:text-slate-400">Sign in as super admin or as an admin user.</p>
      <div className="flex flex-col gap-4">
        <Link
          href="/admin/super"
          className="rounded-lg bg-amber-600 px-4 py-3 font-medium text-white hover:bg-amber-500 dark:bg-amber-600 dark:hover:bg-amber-500"
        >
          Super Admin Login
        </Link>
        <Link
          href="/admin/login"
          className="rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 font-medium text-slate-800 hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Admin User Login
        </Link>
      </div>
    </div>
  );
}
