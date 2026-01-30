"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type AdminUser = {
  _id: string;
  email: string;
  username: string;
  firstLoginDone: boolean;
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
  const [form, setForm] = useState({ email: "", username: "", password: "", profiles: 10, passes: 5 });
  const [editForm, setEditForm] = useState({ username: "", profiles: 10, passes: 5 });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      setForm({ email: "", username: "", password: "", profiles: 10, passes: 5 });
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

  if (session === "loading") {
    return <div className="pt-8 text-center text-slate-400">Loading...</div>;
  }
  if (!session || session.type !== "super") {
    router.replace("/admin/super");
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Super Admin Dashboard</h1>
        <Button onClick={() => { setCreateOpen(true); setError(""); }}>Create Admin User</Button>
      </div>

      {createOpen && (
        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-100">New Admin User</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={createUser} className="space-y-4">
              <div>
                <Label className="text-slate-300">Email</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="mt-1 border-slate-600 bg-slate-800 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-slate-300">Username</Label>
                <Input
                  value={form.username}
                  onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
                  className="mt-1 border-slate-600 bg-slate-800 text-white"
                  required
                />
              </div>
              <div>
                <Label className="text-slate-300">Initial Password</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="mt-1 border-slate-600 bg-slate-800 text-white"
                  minLength={6}
                  required
                />
                <p className="mt-1 text-xs text-slate-500">User must change on first login.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Profile limit</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.profiles}
                    onChange={(e) => setForm((f) => ({ ...f, profiles: parseInt(e.target.value, 10) || 0 }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Pass limit</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.passes}
                    onChange={(e) => setForm((f) => ({ ...f, passes: parseInt(e.target.value, 10) || 0 }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {editId && (
        <Card className="border-slate-700 bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-slate-100">Edit Admin User</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setEditId(null)}>Cancel</Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={updateUser} className="space-y-4">
              <div>
                <Label className="text-slate-300">Username</Label>
                <Input
                  value={editForm.username}
                  onChange={(e) => setEditForm((f) => ({ ...f, username: e.target.value }))}
                  className="mt-1 border-slate-600 bg-slate-800 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-slate-300">Profile limit</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editForm.profiles}
                    onChange={(e) => setEditForm((f) => ({ ...f, profiles: parseInt(e.target.value, 10) || 0 }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Pass limit</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editForm.passes}
                    onChange={(e) => setEditForm((f) => ({ ...f, passes: parseInt(e.target.value, 10) || 0 }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save"}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="border-slate-700 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-100">Admin Users</CardTitle>
          <CardDescription className="text-slate-400">Create, edit, delete admin users and set their limits.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-slate-400">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-slate-400">No admin users yet. Create one above.</p>
          ) : (
            <div className="space-y-2">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800/50 p-4"
                >
                  <div>
                    <p className="font-medium text-slate-100">{u.username}</p>
                    <p className="text-sm text-slate-400">{u.email}</p>
                    <p className="text-xs text-slate-500">
                      Limits: {u.limits.profiles} profiles, {u.limits.passes} passes
                      {!u.firstLoginDone && " · Must change password on first login"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-600"
                      onClick={() => {
                        setEditId(u._id);
                        setEditForm({ username: u.username, profiles: u.limits.profiles, passes: u.limits.passes });
                        setError("");
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-800 text-red-400 hover:bg-red-900/20"
                      onClick={() => deleteUser(u._id)}
                    >
                      Delete
                    </Button>
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
