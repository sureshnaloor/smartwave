"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type AdminUser = {
  _id: string;
  email: string;
  username: string;
  firstLoginDone: boolean;
  role: "corporate" | "public";
  limits: { profiles: number; passes: number };
  createdAt: string;
  updatedAt: string;
};

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ type: string } | null | "loading">("loading");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: "", username: "", password: "", role: "corporate" as "corporate" | "public", profiles: 10, passes: 5 });
  const [editForm, setEditForm] = useState({ username: "", role: "corporate" as "corporate" | "public", profiles: 10, passes: 5 });
  const [resetPasswordId, setResetPasswordId] = useState<string | null>(null);
  const [resetPasswordForm, setResetPasswordForm] = useState({ password: "" });
  const [resetPasswordResult, setResetPasswordResult] = useState<{ email: string; temporaryPassword: string } | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resetSubmitting, setResetSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        setSession(data.session ?? null);
        if (!data.session || data.session.type !== "super") {
          router.replace("/admin/super");
          return;
        }
      })
      .catch(() => setSession(null));
  }, [router]);

  useEffect(() => {
    if (session !== "loading" && session?.type === "super") {
      fetch("/api/admin/super/users")
        .then((r) => r.json())
        .then((data) => {
          if (data.users) setUsers(data.users);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/super/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          username: form.username,
          password: form.password,
          role: form.role,
          limits: { profiles: form.profiles, passes: form.passes },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create");
        return;
      }
      setUsers((prev) => [data.user, ...prev]);
      setCreateOpen(false);
      setForm({ email: "", username: "", password: "", role: "corporate", profiles: 10, passes: 5 });
      toast?.success?.(`Admin ${data.user.email} created successfully. They can now log in at /admin/login.`);
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editId) return;
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/admin/super/users/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editForm.username,
          role: editForm.role,
          limits: { profiles: editForm.profiles, passes: editForm.passes },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update");
        return;
      }
      setUsers((prev) => prev.map((u) => (u._id === editId ? data.user : u)));
      setEditId(null);
    } catch {
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this admin user? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/super/users/${id}`, { method: "DELETE" });
    if (res.ok) setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordId || !resetPasswordForm.password || resetPasswordForm.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setError("");
    setResetSubmitting(true);
    setResetPasswordResult(null);
    try {
      const res = await fetch(`/api/admin/super/users/${resetPasswordId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: resetPasswordForm.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to reset password");
        return;
      }
      const user = users.find((u) => u._id === resetPasswordId);
      setResetPasswordResult({
        email: user?.email ?? "",
        temporaryPassword: resetPasswordForm.password,
      });
      setUsers((prev) => prev.map((u) => (u._id === resetPasswordId ? { ...u, firstLoginDone: false } : u)));
      setResetPasswordForm({ password: "" });
    } catch {
      setError("Network error");
    } finally {
      setResetSubmitting(false);
    }
  };

  if (session === "loading") {
    return <div className="pt-8 text-center text-slate-600 dark:text-slate-400">Loading...</div>;
  }
  if (!session || session.type !== "super") {
    router.replace("/admin/super");
    return null;
  }

  const cardClass = "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900";
  const titleClass = "text-slate-900 dark:text-slate-100";
  const descClass = "text-slate-600 dark:text-slate-400";
  const labelClass = "text-slate-700 dark:text-slate-300";
  const inputClass = "mt-1 border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white";
  const mutedClass = "text-slate-500 dark:text-slate-500";
  const errorClass = "text-sm text-red-600 dark:text-red-400";
  const rowClass = "flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50";
  const rowTitleClass = "font-medium text-slate-900 dark:text-slate-100";
  const rowSubClass = "text-sm text-slate-600 dark:text-slate-400";
  const rowMutedClass = "text-xs text-slate-500 dark:text-slate-500";

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${titleClass}`}>Super Admin Dashboard</h1>
        <Button onClick={() => { setCreateOpen(true); setError(""); }}>Create Admin User</Button>
      </div>

      {createOpen && (
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className={titleClass}>New Admin User</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <Label className={labelClass}>Email</Label>
                <Input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <Label className={labelClass}>Username</Label>
                <Input value={form.username} onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))} className={inputClass} required />
              </div>
              <div>
                <Label className={labelClass}>Initial Password</Label>
                <Input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className={inputClass} minLength={6} required />
                <p className={`mt-1 text-xs ${mutedClass}`}>User must change on first login.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass}>Role</Label>
                  <select
                    value={form.role}
                    onChange={(e) => {
                      const newRole = e.target.value as "corporate" | "public";
                      setForm((f) => ({
                        ...f,
                        role: newRole,
                        profiles: newRole === "public" ? 0 : f.profiles
                      }));
                    }}
                    className={`mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${inputClass}`}
                  >
                    <option value="corporate">Corporate</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <div>
                  {/* Empty space or another field */}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass}>Profile limit</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.role === "public" ? 0 : form.profiles}
                    onChange={(e) => setForm((f) => ({ ...f, profiles: parseInt(e.target.value, 10) || 0 }))}
                    className={inputClass}
                    disabled={form.role === "public"}
                  />
                  {form.role === "public" && <p className="text-[10px] text-slate-500 mt-1">Profiles disabled for public admins</p>}
                </div>
                <div>
                  <Label className={labelClass}>Pass limit</Label>
                  <Input type="number" min={0} value={form.passes} onChange={(e) => setForm((f) => ({ ...f, passes: parseInt(e.target.value, 10) || 0 }))} className={inputClass} />
                </div>
              </div>
              {error && <p className={errorClass}>{error}</p>}
              <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {resetPasswordId && (
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className={titleClass}>Reset admin password</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { setResetPasswordId(null); setResetPasswordResult(null); setResetPasswordForm({ password: "" }); }}>Cancel</Button>
          </CardHeader>
          <CardContent>
            {resetPasswordResult ? (
              <div className="rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600 p-4 space-y-2">
                <p className="font-semibold text-amber-800 dark:text-amber-200">Temporary password set</p>
                <p className="text-sm text-amber-700 dark:text-amber-300">Share this password with <strong>{resetPasswordResult.email}</strong> once. They must sign in and change it immediately.</p>
                <p className="font-mono text-lg text-amber-900 dark:text-amber-100">{resetPasswordResult.temporaryPassword}</p>
                <Button type="button" variant="outline" size="sm" onClick={() => { setResetPasswordId(null); setResetPasswordResult(null); }}>Done</Button>
              </div>
            ) : (
              <form onSubmit={resetPassword} className="space-y-4">
                <p className={`text-sm ${descClass}`}>Set a new temporary password. The admin must use it once to sign in, then change it on the change-password screen.</p>
                <div>
                  <Label className={labelClass}>New temporary password (min 6 characters)</Label>
                  <Input type="password" value={resetPasswordForm.password} onChange={(e) => setResetPasswordForm({ password: e.target.value })} className={inputClass} minLength={6} required placeholder="••••••••" />
                </div>
                {error && <p className={errorClass}>{error}</p>}
                <Button type="submit" disabled={resetSubmitting}>{resetSubmitting ? "Resetting..." : "Reset password"}</Button>
              </form>
            )}
          </CardContent>
        </Card>
      )}

      {editId && (
        <Card className={cardClass}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className={titleClass}>Edit Admin User</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => { setEditId(null); setResetPasswordId(null); }}>Cancel</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateUser} className="space-y-4">
              <div>
                <Label className={labelClass}>Username</Label>
                <Input value={editForm.username} onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))} className={inputClass} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass}>Role</Label>
                  <select
                    value={editForm.role}
                    onChange={(e) => {
                      const newRole = e.target.value as "corporate" | "public";
                      setEditForm((f) => ({
                        ...f,
                        role: newRole,
                        profiles: newRole === "public" ? 0 : f.profiles
                      }));
                    }}
                    className={`mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm ${inputClass}`}
                  >
                    <option value="corporate">Corporate</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={labelClass}>Profile limit</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editForm.role === "public" ? 0 : editForm.profiles}
                    onChange={(e) => setEditForm((f) => ({ ...f, profiles: parseInt(e.target.value, 10) || 0 }))}
                    className={inputClass}
                    disabled={editForm.role === "public"}
                  />
                  {editForm.role === "public" && <p className="text-[10px] text-slate-500 mt-1">Profiles disabled for public admins</p>}
                </div>
                <div>
                  <Label className={labelClass}>Pass limit</Label>
                  <Input type="number" min={0} value={editForm.passes} onChange={(e) => setEditForm((f) => ({ ...f, passes: parseInt(e.target.value, 10) || 0 }))} className={inputClass} />
                </div>
              </div>
              {error && <p className={errorClass}>{error}</p>}
              <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className={cardClass}>
        <CardHeader>
          <CardTitle className={titleClass}>Admin Users</CardTitle>
          <CardDescription className={descClass}>Create, edit, delete admin users and set their limits.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className={descClass}>Loading...</p>
          ) : users.length === 0 ? (
            <p className={descClass}>No admin users yet. Create one above.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div key={u._id} className={rowClass}>
                  <div>
                    <p className={rowTitleClass}>{u.username}</p>
                    <p className={rowSubClass}>{u.email}</p>
                    <p className={rowMutedClass}>
                      Role: <span className="capitalize font-semibold">{u.role || "corporate"}</span> · Limits: {u.limits.profiles} profiles, {u.limits.passes} passes
                      {!u.firstLoginDone && " · Must change password on first login"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" className="border-slate-300 dark:border-slate-600" onClick={() => { setEditId(u._id); setEditForm({ username: u.username, role: u.role || "corporate", profiles: u.limits.profiles, passes: u.limits.passes }); setError(""); setResetPasswordId(null); }}>Edit</Button>
                    <Button variant="outline" size="sm" className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20" onClick={() => { setResetPasswordId(u._id); setResetPasswordForm({ password: "" }); setResetPasswordResult(null); setError(""); setEditId(null); }}>Reset password</Button>
                    <Button variant="outline" size="sm" className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20" onClick={() => deleteUser(u._id)}>Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
