"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Session = {
  type: "admin";
  adminId: string;
  email: string;
  username: string;
  limits: { profiles: number; passes: number };
};

type EmployeeProfile = {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  title?: string;
  company?: string;
  workEmail?: string;
  mobile?: string;
};

type Pass = {
  _id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null | "loading">("loading");
  const [profiles, setProfiles] = useState<EmployeeProfile[]>([]);
  const [profilesLimit, setProfilesLimit] = useState(0);
  const [profilesUsed, setProfilesUsed] = useState(0);
  const [passes, setPasses] = useState<Pass[]>([]);
  const [passesLimit, setPassesLimit] = useState(0);
  const [passesUsed, setPassesUsed] = useState(0);
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    title: "",
    company: "",
    workEmail: "",
    mobile: "",
    workPhone: "",
  });
  const [passForm, setPassForm] = useState({ name: "", description: "", type: "event" as "event" | "access" });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passSubmitting, setPassSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((data) => {
        const s = data.session;
        if (!s || s.type !== "admin") {
          router.replace("/admin/login");
          return;
        }
        setSession(s);
      })
      .catch(() => setSession(null));
  }, [router]);

  useEffect(() => {
    if (session === "loading" || !session || session.type !== "admin") return;
    fetch("/api/admin/employee-profiles")
      .then((r) => r.json())
      .then((data) => {
        if (data.profiles) setProfiles(data.profiles);
        if (typeof data.limit === "number") setProfilesLimit(data.limit);
        if (typeof data.used === "number") setProfilesUsed(data.used);
      });
    fetch("/api/admin/passes")
      .then((r) => r.json())
      .then((data) => {
        if (data.passes) setPasses(data.passes);
        if (typeof data.limit === "number") setPassesLimit(data.limit);
        if (typeof data.used === "number") setPassesUsed(data.used);
      });
  }, [session]);

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setProfileSubmitting(true);
    try {
      const res = await fetch("/api/admin/employee-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create profile");
        return;
      }
      setProfiles((prev) => [data.profile, ...prev]);
      setProfilesUsed((u) => u + 1);
      setProfileForm({ firstName: "", lastName: "", middleName: "", title: "", company: "", workEmail: "", mobile: "", workPhone: "" });
    } catch {
      setError("Network error");
    } finally {
      setProfileSubmitting(false);
    }
  };

  const createPass = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setPassSubmitting(true);
    try {
      const res = await fetch("/api/admin/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: passForm.name, description: passForm.description || undefined, type: passForm.type }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create pass");
        return;
      }
      setPasses((prev) => [data.pass, ...prev]);
      setPassesUsed((u) => u + 1);
      setPassForm({ name: "", description: "", type: "event" });
    } catch {
      setError("Network error");
    } finally {
      setPassSubmitting(false);
    }
  };

  if (session === "loading" || !session || session.type !== "admin") {
    return <div className="pt-8 text-center text-slate-400">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Admin Dashboard</h1>
        <p className="text-slate-400">
          Limits: {profilesUsed}/{profilesLimit} profiles · {passesUsed}/{passesLimit} passes
        </p>
      </div>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="mb-4 bg-slate-800">
          <TabsTrigger value="profiles">Employee Profiles</TabsTrigger>
          <TabsTrigger value="passes">Event / Access Passes</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <Card className="border-slate-700 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-100">Create Employee Profile</CardTitle>
              <CardDescription className="text-slate-400">
                Add a profile manually. Excel upload coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createProfile} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className="text-slate-300">First name</Label>
                  <Input
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Last name</Label>
                  <Input
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Middle name</Label>
                  <Input
                    value={profileForm.middleName}
                    onChange={(e) => setProfileForm((f) => ({ ...f, middleName: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Job title</Label>
                  <Input
                    value={profileForm.title}
                    onChange={(e) => setProfileForm((f) => ({ ...f, title: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Company</Label>
                  <Input
                    value={profileForm.company}
                    onChange={(e) => setProfileForm((f) => ({ ...f, company: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Work email</Label>
                  <Input
                    type="email"
                    value={profileForm.workEmail}
                    onChange={(e) => setProfileForm((f) => ({ ...f, workEmail: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Mobile</Label>
                  <Input
                    value={profileForm.mobile}
                    onChange={(e) => setProfileForm((f) => ({ ...f, mobile: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Work phone</Label>
                  <Input
                    value={profileForm.workPhone}
                    onChange={(e) => setProfileForm((f) => ({ ...f, workPhone: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                  />
                </div>
                <div className="sm:col-span-2">
                  <p className="mb-2 text-xs text-slate-500">Excel upload: coming soon.</p>
                  {error && <p className="text-sm text-red-400">{error}</p>}
                  <Button type="submit" disabled={profileSubmitting || profilesUsed >= profilesLimit}>
                    {profileSubmitting ? "Creating..." : "Create Profile"}
                  </Button>
                  {profilesUsed >= profilesLimit && (
                    <p className="mt-2 text-sm text-amber-400">Profile limit reached. Ask super admin to increase your limit.</p>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-100">Employee Profiles ({profiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {profiles.length === 0 ? (
                <p className="text-slate-400">No profiles yet.</p>
              ) : (
                <ul className="space-y-2">
                  {profiles.map((p) => (
                    <li key={p._id} className="rounded border border-slate-700 bg-slate-800/50 p-3">
                      <p className="font-medium text-slate-100">{p.name}</p>
                      {(p.title || p.company) && (
                        <p className="text-sm text-slate-400">{[p.title, p.company].filter(Boolean).join(" · ")}</p>
                      )}
                      {p.workEmail && <p className="text-xs text-slate-500">{p.workEmail}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="passes" className="space-y-6">
          <Card className="border-slate-700 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-100">Create Event or Access Pass</CardTitle>
              <CardDescription className="text-slate-400">
                Passes will be available for users to opt-in (by location, interest, etc.) — opt-in flow coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createPass} className="space-y-4 max-w-md">
                <div>
                  <Label className="text-slate-300">Name</Label>
                  <Input
                    value={passForm.name}
                    onChange={(e) => setPassForm((f) => ({ ...f, name: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                    placeholder="e.g. Annual Conference 2025"
                    required
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Description</Label>
                  <Input
                    value={passForm.description}
                    onChange={(e) => setPassForm((f) => ({ ...f, description: e.target.value }))}
                    className="mt-1 border-slate-600 bg-slate-800 text-white"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <Label className="text-slate-300">Type</Label>
                  <select
                    value={passForm.type}
                    onChange={(e) => setPassForm((f) => ({ ...f, type: e.target.value as "event" | "access" }))}
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 px-3 py-2 text-white"
                  >
                    <option value="event">Event</option>
                    <option value="access">Access</option>
                  </select>
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" disabled={passSubmitting || passesUsed >= passesLimit}>
                  {passSubmitting ? "Creating..." : "Create Pass"}
                </Button>
                {passesUsed >= passesLimit && (
                  <p className="text-sm text-amber-400">Pass limit reached. Ask super admin to increase your limit.</p>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-slate-100">Passes ({passes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {passes.length === 0 ? (
                <p className="text-slate-400">No passes yet.</p>
              ) : (
                <ul className="space-y-2">
                  {passes.map((p) => (
                    <li key={p._id} className="rounded border border-slate-700 bg-slate-800/50 p-3">
                      <p className="font-medium text-slate-100">{p.name}</p>
                      {p.description && <p className="text-sm text-slate-400">{p.description}</p>}
                      <p className="text-xs text-slate-500">{p.type} · {p.status}</p>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
