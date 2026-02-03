import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyAdminSession } from "@/lib/admin/auth";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "admin_session";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

    if (!sessionCookie) {
        redirect("/admin/login");
    }

    const session = await verifyAdminSession(sessionCookie.value);
    if (!session) {
        redirect("/admin/login");
    }

    return <>{children}</>;
}
