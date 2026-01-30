"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminChangePasswordPage() {
  const router = useRouter();
  const [session, setSession] = useState<{ type: string } | null | "loading">("loading");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        setSession(data.session ?? null);
        if (!data.session || data.session.type !== "admin") {
          router.replace("/admin/login");
          return;
        }
        if (data.session.firstLoginDone) {
          router.replace("/admin/dashboard");
        }
      })
      .catch(() => setSession(null));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update password");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (session === "loading" || (session && session.type !== "admin")) {
    return <div className="pt-8 text-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-sm pt-8">
      <Card className="border-slate-700 bg-slate-900">
        <CardHeader>
          <CardTitle className="text-slate-100">Change Password</CardTitle>
          <CardDescription className="text-slate-400">
            You must set a new password before using the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new" className="text-slate-300">New Password</Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 border-slate-600 bg-slate-800 text-white"
                minLength={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm" className="text-slate-300">Confirm Password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 border-slate-600 bg-slate-800 text-white"
                minLength={6}
                required
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating..." : "Set Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
