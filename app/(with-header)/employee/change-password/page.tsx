"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeeChangePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = session?.user as { role?: string; firstLoginDone?: boolean; email?: string } | undefined;
  const isEmployee = user?.role === "employee";
  const mustChange = user?.firstLoginDone === false;

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
    if (!session?.user?.email) {
      setError("Session expired. Please sign in again.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/employee/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update password");
        return;
      }
      // Re-sign-in with new password so the JWT gets firstLoginDone: true from DB
      const signInResult = await signIn("credentials", {
        email: session.user.email,
        password: newPassword,
        callbackUrl: "/employee/dashboard",
        redirect: false,
      });
      if (signInResult?.error) {
        setError("Password updated but session refresh failed. Please sign in again with your new password.");
        return;
      }
      router.push("/employee/dashboard");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>;
  if (status === "unauthenticated" || !isEmployee) {
    router.replace("/auth/signin");
    return null;
  }
  if (!mustChange) {
    router.replace("/employee/dashboard");
    return null;
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Set your password</CardTitle>
          <CardDescription>
            You must set a new password before using your profile. Use your work email and this new password for future sign-ins.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new">New password</Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                minLength={6}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Updating…" : "Set password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
