import { AdminLayoutClient } from "./AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <AdminLayoutClient />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
