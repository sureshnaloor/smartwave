"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LocationPicker from "@/components/admin/LocationPicker";
import PhotoUpload from "@/components/admin/PhotoUpload";
import { DigitalProfile } from "@/components/digitalprofile/digitalprofile";
import { ProfileData } from "@/components/digitalprofile/types";
import { Eye, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "sonner";

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
  [key: string]: unknown;
};

type Pass = {
  _id: string;
  name: string;
  description?: string;
  type: string;
  status: string;
  location?: { name: string; lat?: number; lng?: number };
  dateStart?: string;
  dateEnd?: string;
};

// ... existing code ...

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
    temporaryPassword: "",
    mobile: "",
    workPhone: "",
    photo: "",
    website: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    notes: "",
  });
  const [createdTempPassword, setCreatedTempPassword] = useState<string | null>(null);

  const [passForm, setPassForm] = useState({
    name: "",
    description: "",
    type: "event" as "event" | "access",
    locationName: "",
    lat: "",
    lng: "",
    dateStart: "",
    dateEnd: ""
  });
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const [passSubmitting, setPassSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [editProfileEmail, setEditProfileEmail] = useState<string | null>(null);
  const [editProfileForm, setEditProfileForm] = useState(profileForm);
  const [editProfileLoading, setEditProfileLoading] = useState(false);
  const [editProfileSubmitting, setEditProfileSubmitting] = useState(false);
  const [editProfileError, setEditProfileError] = useState("");
  const [deleteProfileEmail, setDeleteProfileEmail] = useState<string | null>(null);
  const [deleteProfileSubmitting, setDeleteProfileSubmitting] = useState(false);

  // ... existing states ...

  const [editPassId, setEditPassId] = useState<string | null>(null);
  const [editPassForm, setEditPassForm] = useState({
    name: "",
    description: "",
    type: "event" as "event" | "access",
    status: "draft" as "draft" | "active",
    locationName: "",
    lat: "",
    lng: "",
    dateStart: "",
    dateEnd: ""
  });
  const [editPassSubmitting, setEditPassSubmitting] = useState(false);
  const [editPassError, setEditPassError] = useState("");
  const [deletePassId, setDeletePassId] = useState<string | null>(null);
  const [companySubmitting, setCompanySubmitting] = useState(false);
  const [companyMessage, setCompanyMessage] = useState("");
  const [deletePassSubmitting, setDeletePassSubmitting] = useState(false);
  const [viewProfile, setViewProfile] = useState<EmployeeProfile | null>(null);

  // Company Profile State
  const [companyForm, setCompanyForm] = useState({
    name: "",
    email: "",
    logo: "",
    address: "",
    lat: "",
    lng: ""
  });
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/me", { credentials: "include" })
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
    fetch("/api/admin/employee-profiles", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setProfiles(Array.isArray(data.profiles) ? data.profiles : []);
        if (typeof data.limit === "number") setProfilesLimit(data.limit);
        if (typeof data.used === "number") setProfilesUsed(data.used);
      })
      .catch(() => { });
    fetch("/api/admin/passes", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => {
        if (data.error) return;
        setPasses(Array.isArray(data.passes) ? data.passes : []);
        if (typeof data.limit === "number") setPassesLimit(data.limit);
        if (typeof data.used === "number") setPassesUsed(data.used);
      })
      .catch(() => { });

    // Fetch Company Details
    fetch("/api/admin/company", { credentials: "include" })
      .then(r => r.json())
      .then(data => {
        if (data.company) {
          setCompanyForm({
            name: data.company.name || "",
            email: data.company.email || "",
            logo: data.company.logo || "",
            address: data.company.address || "",
            lat: data.company.location?.lat?.toString() || "",
            lng: data.company.location?.lng?.toString() || ""
          });
        }
      })
      .catch(() => { });
  }, [session]);

  useEffect(() => {
    if (!editProfileEmail) return;
    setEditProfileLoading(true);
    setEditProfileError("");
    fetch(`/api/admin/employee-profiles/${encodeURIComponent(editProfileEmail)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.profile) {
          const p = data.profile as Record<string, unknown>;
          setEditProfileForm({
            firstName: (p.firstName as string) ?? "",
            lastName: (p.lastName as string) ?? "",
            middleName: (p.middleName as string) ?? "",
            title: (p.title as string) ?? "",
            company: (p.company as string) ?? "",
            workEmail: (p.workEmail as string) ?? editProfileEmail,
            temporaryPassword: "",
            mobile: (p.mobile as string) ?? "",
            workPhone: (p.workPhone as string) ?? "",
            photo: (p.photo as string) ?? "",
            website: (p.website as string) ?? "",
            linkedin: (p.linkedin as string) ?? "",
            twitter: (p.twitter as string) ?? "",
            facebook: (p.facebook as string) ?? "",
            instagram: (p.instagram as string) ?? "",
            notes: (p.notes as string) ?? "",
          });
        } else setEditProfileError(data.error ?? "Failed to load profile");
      })
      .finally(() => setEditProfileLoading(false));
  }, [editProfileEmail]);

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProfileEmail) return;
    setEditProfileError("");
    setEditProfileSubmitting(true);
    try {
      const res = await fetch(`/api/admin/employee-profiles/${encodeURIComponent(editProfileEmail)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editProfileForm.firstName,
          lastName: editProfileForm.lastName,
          middleName: editProfileForm.middleName,
          title: editProfileForm.title,
          company: editProfileForm.company,
          mobile: editProfileForm.mobile,
          workPhone: editProfileForm.workPhone,
          photo: editProfileForm.photo || undefined,
          website: editProfileForm.website || undefined,
          linkedin: editProfileForm.linkedin || undefined,
          twitter: editProfileForm.twitter || undefined,
          facebook: editProfileForm.facebook || undefined,
          instagram: editProfileForm.instagram || undefined,
          notes: editProfileForm.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditProfileError(data.error ?? "Failed to update");
        return;
      }
      setProfiles((prev) => prev.map((p) => (p.workEmail === editProfileEmail ? { ...p, ...data.profile, name: data.profile?.name ?? p.name } : p)));
      setEditProfileEmail(null);
    } catch {
      setEditProfileError("Network error");
    } finally {
      setEditProfileSubmitting(false);
    }
  };

  const deleteProfile = async () => {
    if (!deleteProfileEmail) return;
    setDeleteProfileSubmitting(true);
    try {
      const res = await fetch(`/api/admin/employee-profiles/${encodeURIComponent(deleteProfileEmail)}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to delete");
        setDeleteProfileEmail(null);
        return;
      }
      setProfiles((prev) => prev.filter((p) => p.workEmail !== deleteProfileEmail));
      setProfilesUsed((u) => Math.max(0, u - 1));
      setDeleteProfileEmail(null);
    } catch {
      setError("Network error");
    } finally {
      setDeleteProfileSubmitting(false);
    }
  };

  const updatePass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPassId) return;
    setEditPassError("");
    setEditPassSubmitting(true);
    try {
      const payload: any = {
        name: editPassForm.name,
        description: editPassForm.description || undefined,
        type: editPassForm.type,
        status: editPassForm.status,
        dateStart: editPassForm.dateStart || null,
        dateEnd: editPassForm.dateEnd || null,
      };

      if (editPassForm.locationName) {
        payload.location = {
          name: editPassForm.locationName,
          lat: editPassForm.lat ? parseFloat(editPassForm.lat) : undefined,
          lng: editPassForm.lng ? parseFloat(editPassForm.lng) : undefined,
        };
      }

      const res = await fetch(`/api/admin/passes/${editPassId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditPassError(data.error ?? "Failed to update");
        return;
      }
      setPasses((prev) => prev.map((p) => (p._id === editPassId ? { ...p, ...data.pass } : p)));
      setEditPassId(null);
    } catch {
      setEditPassError("Network error");
    } finally {
      setEditPassSubmitting(false);
    }
  };

  const deletePass = async () => {
    if (!deletePassId) return;
    setDeletePassSubmitting(true);
    try {
      const res = await fetch(`/api/admin/passes/${deletePassId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to delete pass");
        setDeletePassId(null);
        return;
      }
      setPasses((prev) => prev.filter((p) => p._id !== deletePassId));
      setPassesUsed((u) => Math.max(0, u - 1));
      setDeletePassId(null);
    } catch {
      setError("Network error");
    } finally {
      setDeletePassSubmitting(false);
    }
  };

  const createProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCreatedTempPassword(null);
    if (!profileForm.workEmail.trim()) {
      setError("Work email is required");
      return;
    }
    if (!profileForm.temporaryPassword || profileForm.temporaryPassword.length < 6) {
      setError("Temporary password is required (min 6 characters). Employee will use it for first login and must change it.");
      return;
    }
    setProfileSubmitting(true);
    try {
      const res = await fetch("/api/admin/employee-profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workEmail: profileForm.workEmail.trim(),
          temporaryPassword: profileForm.temporaryPassword,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          middleName: profileForm.middleName,
          title: profileForm.title,
          company: profileForm.company,
          mobile: profileForm.mobile,
          workPhone: profileForm.workPhone,
          photo: profileForm.photo || undefined,
          website: profileForm.website || undefined,
          linkedin: profileForm.linkedin || undefined,
          twitter: profileForm.twitter || undefined,
          facebook: profileForm.facebook || undefined,
          instagram: profileForm.instagram || undefined,
          notes: profileForm.notes || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create profile");
        return;
      }
      setProfiles((prev) => [data.profile, ...prev]);
      setProfilesUsed((u) => u + 1);
      setCreatedTempPassword(data.temporaryPassword ?? null);
      setProfileForm({
        firstName: "",
        lastName: "",
        middleName: "",
        title: "",
        company: "",
        workEmail: "",
        temporaryPassword: "",
        mobile: "",
        workPhone: "",
        photo: "",
        website: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        instagram: "",
        notes: "",
      });
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
      const payload: any = {
        name: passForm.name,
        description: passForm.description || undefined,
        type: passForm.type,
        dateStart: passForm.dateStart || undefined,
        dateEnd: passForm.dateEnd || undefined,
      };

      if (passForm.locationName) {
        payload.location = {
          name: passForm.locationName,
          lat: passForm.lat ? parseFloat(passForm.lat) : undefined,
          lng: passForm.lng ? parseFloat(passForm.lng) : undefined,
        };
      }

      const res = await fetch("/api/admin/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create pass");
        return;
      }
      setPasses((prev) => [data.pass, ...prev]);
      setPassesUsed((u) => u + 1);
      setPassForm({
        name: "",
        description: "",
        type: "event",
        locationName: "",
        lat: "",
        lng: "",
        dateStart: "",
        dateEnd: ""
      });
    } catch {
      setError("Network error");
    } finally {
      setPassSubmitting(false);
    }
  };

  const handleTemplateDownload = () => {
    const headers = [
      "workEmail (required)",
      "firstName",
      "lastName",
      "middleName",
      "title",
      "mobile",
      "workPhone",
      "notes"
    ];
    const sample = [
      "john.doe@example.com",
      "John",
      "Doe",
      "",
      "Software Engineer",
      "+1-555-0100",
      "+1-555-0101",
      "Employee of the month"
    ];
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + sample.join(",");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_upload_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error("Please upload a valid CSV file.");
      return;
    }

    setIsBulkUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      if (!text) return;

      // Simple CSV parser
      const rows = text.split(/\r?\n/).slice(1); // skip header
      const data = rows.map(row => {
        // Handle quotes if simple split fails? For template simplicity, assume simple CSV for now.
        // Ideally use a library but avoiding deps for now.
        // Matches: values separated by commas, respecting quotes
        const matches = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || row.split(',');

        // Fallback to simple split if regex fails or for simple cases
        const values = row.split(',').map(v => v.trim());
        // Map indices to fields based on template
        // 0: email, 1: first, 2: last, 3: middle, 4: title, 5: mobile, 6: work, 7: notes
        return {
          workEmail: values[0],
          firstName: values[1],
          lastName: values[2],
          middleName: values[3],
          title: values[4],
          mobile: values[5],
          workPhone: values[6],
          notes: values[7]
        };
      }).filter(r => r.workEmail && r.workEmail.includes('@')); // Basic validation

      if (data.length === 0) {
        toast.error("No valid rows found in CSV.");
        setIsBulkUploading(false);
        return;
      }

      if (profilesUsed + data.length > profilesLimit) {
        toast.error(`Cannot upload ${data.length} profiles. Limit exceeded (Remaining: ${profilesLimit - profilesUsed}).`);
        setIsBulkUploading(false);
        return;
      }

      let successCount = 0;
      let failCount = 0;

      for (const emp of data) {
        try {
          // Generate a random temp password
          const tempPass = Math.random().toString(36).slice(-8);

          const res = await fetch("/api/admin/employee-profiles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              workEmail: emp.workEmail,
              temporaryPassword: tempPass,
              firstName: emp.firstName,
              lastName: emp.lastName,
              middleName: emp.middleName,
              title: emp.title,
              mobile: emp.mobile,
              workPhone: emp.workPhone,
              notes: emp.notes
            })
          });

          if (res.ok) {
            successCount++;
            // Update list locally
            const d = await res.json();
            setProfiles(prev => [d.profile, ...prev]);
            setProfilesUsed(u => u + 1);
          } else {
            failCount++;
          }
        } catch (err) {
          failCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} profiles.`);
      }
      if (failCount > 0) {
        toast.warning(`Failed to add ${failCount} profiles. Check duplicates or email format.`);
      }
      setIsBulkUploading(false);
      // Reset file input
      e.target.value = "";
    };
    reader.readAsText(file);
  };

  const updateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCompanyMessage("");
    setCompanySubmitting(true);
    try {
      const res = await fetch("/api/admin/company", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: companyForm.name,
          email: companyForm.email,
          logo: companyForm.logo,
          address: companyForm.address,
          location: {
            lat: companyForm.lat ? parseFloat(companyForm.lat) : undefined,
            lng: companyForm.lng ? parseFloat(companyForm.lng) : undefined
          }
        })
      });
      if (res.ok) {
        setCompanyMessage("Company profile updated successfully.");
      } else {
        setCompanyMessage("Failed to update profile.");
      }
    } catch {
      setCompanyMessage("Network error.");
    } finally {
      setCompanySubmitting(false);
    }
  };

  if (session === "loading" || !session || session.type !== "admin") {
    return <div className="pt-8 text-center text-slate-600 dark:text-slate-400">Loading...</div>;
  }

  const cardClass = "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900";
  const titleClass = "text-slate-900 dark:text-slate-100";
  const descClass = "text-slate-600 dark:text-slate-400";
  const labelClass = "text-slate-700 dark:text-slate-300";
  const inputClass = "mt-1 border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white";
  const selectClass = "mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white";
  const listItemClass = "rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/50";
  const listTitleClass = "font-medium text-slate-900 dark:text-slate-100";
  const listSubClass = "text-sm text-slate-600 dark:text-slate-400";
  const listMutedClass = "text-xs text-slate-500 dark:text-slate-500";
  const errorClass = "text-sm text-red-600 dark:text-red-400";
  const warnClass = "text-sm text-amber-600 dark:text-amber-400";

  return (
    <div className="space-y-8">
      <div>
        <h1 className={`text-2xl font-bold ${titleClass}`}>Admin Dashboard</h1>
        <p className={descClass}>
          Limits: {profilesUsed}/{profilesLimit} profiles · {passesUsed}/{passesLimit} passes
        </p>
      </div>

      <Tabs defaultValue="profiles" className="w-full">
        <TabsList className="mb-4 bg-slate-200 dark:bg-slate-800">
          <TabsTrigger value="profiles">Employee Profiles</TabsTrigger>
          <TabsTrigger value="passes">Event / Access Passes</TabsTrigger>
          <TabsTrigger value="company">Company Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <Card className={cardClass}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className={titleClass}>Create Employee Profile</CardTitle>
                  <CardDescription className={descClass}>
                    Add a profile manually or upload via CSV.
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleTemplateDownload} className="gap-2">
                    <Download className="w-4 h-4" /> Template
                  </Button>
                  <div className="relative">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleBulkUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isBulkUploading || profilesUsed >= profilesLimit}
                    />
                    <Button size="sm" className="gap-2" disabled={isBulkUploading || profilesUsed >= profilesLimit}>
                      {isBulkUploading ? "Uploading..." : <><FileSpreadsheet className="w-4 h-4" /> Upload CSV</>}
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {createdTempPassword && (
                <div className="mb-4 rounded-lg border-2 border-amber-500 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-600 p-4">
                  <p className="font-semibold text-amber-800 dark:text-amber-200">Temporary password (show to employee once)</p>
                  <p className="mt-1 font-mono text-lg text-amber-900 dark:text-amber-100">{createdTempPassword}</p>
                  <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">Employee must sign in with work email and this password, then set their own password immediately.</p>
                  <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => setCreatedTempPassword(null)}>Dismiss</Button>
                </div>
              )}
              <form onSubmit={createProfile} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label className={labelClass}>Work email (required)</Label>
                  <Input type="email" value={profileForm.workEmail} onChange={(e) => setProfileForm((f) => ({ ...f, workEmail: e.target.value }))} className={inputClass} placeholder="employee@company.com" required />
                </div>
                <div>
                  <Label className={labelClass}>Temporary password (required, min 6)</Label>
                  <Input type="password" value={profileForm.temporaryPassword} onChange={(e) => setProfileForm((f) => ({ ...f, temporaryPassword: e.target.value }))} className={inputClass} placeholder="Employee uses for first login" minLength={6} required />
                </div>
                <div>
                  <Label className={labelClass}>First name</Label>
                  <Input value={profileForm.firstName} onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Last name</Label>
                  <Input value={profileForm.lastName} onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Middle name</Label>
                  <Input value={profileForm.middleName} onChange={(e) => setProfileForm((f) => ({ ...f, middleName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Job title</Label>
                  <Input value={profileForm.title} onChange={(e) => setProfileForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
                </div>
                <div className="sm:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100 italic">Company Information (Inherited from Admin Profile)</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className={labelClass}>Company Name</Label>
                      <Input value={companyForm.name || "N/A"} disabled className={inputClass + " bg-slate-100 dark:bg-slate-800 opacity-70"} />
                    </div>
                    <div>
                      <Label className={labelClass}>Company Email</Label>
                      <Input value={companyForm.email || "N/A"} disabled className={inputClass + " bg-slate-100 dark:bg-slate-800 opacity-70"} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className={labelClass}>Company Address</Label>
                      <Input value={companyForm.address || "N/A"} disabled className={inputClass + " bg-slate-100 dark:bg-slate-800 opacity-70"} />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">To update these fields, go to the "Company Profile" tab.</p>
                </div>
                <div className="sm:col-span-2">
                  <PhotoUpload
                    currentPhotoUrl={profileForm.photo}
                    onPhotoUploaded={(url) => setProfileForm((f) => ({ ...f, photo: url }))}
                  />
                </div>
                <div>
                  <Label className={labelClass}>Mobile</Label>
                  <Input value={profileForm.mobile} onChange={(e) => setProfileForm((f) => ({ ...f, mobile: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Work phone</Label>
                  <Input value={profileForm.workPhone} onChange={(e) => setProfileForm((f) => ({ ...f, workPhone: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Website</Label>
                  <Input value={profileForm.website} onChange={(e) => setProfileForm((f) => ({ ...f, website: e.target.value }))} className={inputClass} placeholder="https://..." />
                </div>
                <div>
                  <Label className={labelClass}>LinkedIn</Label>
                  <Input value={profileForm.linkedin} onChange={(e) => setProfileForm((f) => ({ ...f, linkedin: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Twitter</Label>
                  <Input value={profileForm.twitter} onChange={(e) => setProfileForm((f) => ({ ...f, twitter: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Facebook</Label>
                  <Input value={profileForm.facebook} onChange={(e) => setProfileForm((f) => ({ ...f, facebook: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Instagram</Label>
                  <Input value={profileForm.instagram} onChange={(e) => setProfileForm((f) => ({ ...f, instagram: e.target.value }))} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <Label className={labelClass}>Notes</Label>
                  <Input value={profileForm.notes} onChange={(e) => setProfileForm((f) => ({ ...f, notes: e.target.value }))} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <p className={`mb-2 text-xs ${listMutedClass}`}>Company logo is shared from your account. Excel upload: coming soon.</p>
                  {error && <p className={errorClass}>{error}</p>}
                  <Button type="submit" disabled={profileSubmitting || profilesUsed >= profilesLimit}>
                    {profileSubmitting ? "Creating..." : "Create Profile"}
                  </Button>
                  {profilesUsed >= profilesLimit && <p className={`mt-2 ${warnClass}`}>Profile limit reached. Ask super admin to increase your limit.</p>}
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={titleClass}>Employee Profiles ({profiles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {profiles.length === 0 ? (
                <p className={descClass}>No profiles yet.</p>
              ) : (
                <ul className="space-y-2">
                  {profiles.map((p) => (
                    <li key={p._id} className={`${listItemClass} flex flex-wrap items-center justify-between gap-2`}>
                      <div>
                        <p className={listTitleClass}>{p.name}</p>
                        {(p.title || p.company) && <p className={listSubClass}>{[p.title, p.company].filter(Boolean).join(" · ")}</p>}
                        {p.workEmail && <p className={listMutedClass}>{p.workEmail}</p>}
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="ghost" size="sm" onClick={() => setViewProfile(p)} title="View Digital Profile">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button type="button" variant="outline" size="sm" onClick={() => setEditProfileEmail(p.workEmail ?? null)}>Edit</Button>
                        <Button type="button" variant="outline" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => setDeleteProfileEmail(p.workEmail ?? null)}>Delete</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit employee profile dialog */}
        <Dialog open={!!editProfileEmail} onOpenChange={(open) => !open && setEditProfileEmail(null)}>
          <DialogContent className={`max-h-[90vh] overflow-y-auto ${cardClass}`}>
            <DialogHeader>
              <DialogTitle className={titleClass}>Edit Employee Profile</DialogTitle>
              <DialogDescription className={descClass}>Work email cannot be changed.</DialogDescription>
            </DialogHeader>
            {editProfileLoading ? (
              <p className={descClass}>Loading...</p>
            ) : (
              <form onSubmit={updateProfile} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label className={labelClass}>Work email (read-only)</Label>
                  <Input value={editProfileForm.workEmail} readOnly className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>First name</Label>
                  <Input value={editProfileForm.firstName} onChange={(e) => setEditProfileForm((f) => ({ ...f, firstName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Last name</Label>
                  <Input value={editProfileForm.lastName} onChange={(e) => setEditProfileForm((f) => ({ ...f, lastName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Middle name</Label>
                  <Input value={editProfileForm.middleName} onChange={(e) => setEditProfileForm((f) => ({ ...f, middleName: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Job title</Label>
                  <Input value={editProfileForm.title} onChange={(e) => setEditProfileForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
                </div>
                <div className="sm:col-span-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100 italic">Company Information (Inherited from Admin Profile)</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label className={labelClass}>Company Name</Label>
                      <Input value={companyForm.name || "N/A"} disabled className={inputClass + " bg-slate-100 dark:bg-slate-800 opacity-70"} />
                    </div>
                    <div>
                      <Label className={labelClass}>Company Email</Label>
                      <Input value={companyForm.email || "N/A"} disabled className={inputClass + " bg-slate-100 dark:bg-slate-800 opacity-70"} />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className={labelClass}>Company Address</Label>
                      <Input value={companyForm.address || "N/A"} disabled className={inputClass + " bg-slate-100 dark:bg-slate-800 opacity-70"} />
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-2">To update these fields, go to the "Company Profile" tab.</p>
                </div>
                <div className="sm:col-span-2">
                  <PhotoUpload
                    currentPhotoUrl={editProfileForm.photo}
                    onPhotoUploaded={(url) => setEditProfileForm((f) => ({ ...f, photo: url }))}
                  />
                </div>
                <div>
                  <Label className={labelClass}>Mobile</Label>
                  <Input value={editProfileForm.mobile} onChange={(e) => setEditProfileForm((f) => ({ ...f, mobile: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Work phone</Label>
                  <Input value={editProfileForm.workPhone} onChange={(e) => setEditProfileForm((f) => ({ ...f, workPhone: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Website</Label>
                  <Input value={editProfileForm.website} onChange={(e) => setEditProfileForm((f) => ({ ...f, website: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>LinkedIn</Label>
                  <Input value={editProfileForm.linkedin} onChange={(e) => setEditProfileForm((f) => ({ ...f, linkedin: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Twitter</Label>
                  <Input value={editProfileForm.twitter} onChange={(e) => setEditProfileForm((f) => ({ ...f, twitter: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Facebook</Label>
                  <Input value={editProfileForm.facebook} onChange={(e) => setEditProfileForm((f) => ({ ...f, facebook: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <Label className={labelClass}>Instagram</Label>
                  <Input value={editProfileForm.instagram} onChange={(e) => setEditProfileForm((f) => ({ ...f, instagram: e.target.value }))} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <Label className={labelClass}>Notes</Label>
                  <Input value={editProfileForm.notes} onChange={(e) => setEditProfileForm((f) => ({ ...f, notes: e.target.value }))} className={inputClass} />
                </div>
                {editProfileError && <p className={`sm:col-span-2 ${errorClass}`}>{editProfileError}</p>}
                <DialogFooter className="sm:col-span-2">
                  <Button type="button" variant="outline" onClick={() => setEditProfileEmail(null)}>Cancel</Button>
                  <Button type="submit" disabled={editProfileSubmitting}>Save changes</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete employee profile confirm */}
        <Dialog open={!!deleteProfileEmail} onOpenChange={(open) => !open && !deleteProfileSubmitting && setDeleteProfileEmail(null)}>
          <DialogContent className={cardClass}>
            <DialogHeader>
              <DialogTitle className={titleClass}>Remove employee?</DialogTitle>
              <DialogDescription className={descClass}>
                This will remove the employee profile and account. They will no longer be able to sign in.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDeleteProfileEmail(null)} disabled={deleteProfileSubmitting}>Cancel</Button>
              <Button type="button" variant="destructive" onClick={deleteProfile} disabled={deleteProfileSubmitting}>
                {deleteProfileSubmitting ? "Removing..." : "Remove"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <TabsContent value="passes" className="space-y-6">
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={titleClass}>Create Event or Access Pass</CardTitle>
              <CardDescription className={descClass}>
                Passes will be available for users to opt-in (by location, interest, etc.) — opt-in flow coming soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createPass} className="space-y-4 max-w-md">
                <div>
                  <Label className={labelClass}>Name</Label>
                  <Input value={passForm.name} onChange={(e) => setPassForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} placeholder="e.g. Annual Conference 2025" required />
                </div>
                <div>
                  <Label className={labelClass}>Description</Label>
                  <Input value={passForm.description} onChange={(e) => setPassForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} placeholder="Optional" />
                </div>
                <div>
                  <Label className={labelClass}>Type</Label>
                  <select value={passForm.type} onChange={(e) => setPassForm((f) => ({ ...f, type: e.target.value as "event" | "access" }))} className={selectClass}>
                    <option value="event">Event</option>
                    <option value="access">Access</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label className={labelClass + " mb-2 block"}>Pin Location on Map</Label>
                    <LocationPicker
                      lat={passForm.lat ? parseFloat(passForm.lat) : undefined}
                      lng={passForm.lng ? parseFloat(passForm.lng) : undefined}
                      onLocationChange={(lat, lng) => setPassForm(f => ({ ...f, lat: lat.toString(), lng: lng.toString() }))}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className={labelClass}>Location Name</Label>
                    <Input value={passForm.locationName} onChange={(e) => setPassForm((f) => ({ ...f, locationName: e.target.value }))} className={inputClass} placeholder="e.g. Madison Garden" />
                  </div>
                  <div>
                    <Label className={labelClass}>Latitude</Label>
                    <Input type="number" step="any" value={passForm.lat} onChange={(e) => setPassForm((f) => ({ ...f, lat: e.target.value }))} className={inputClass} placeholder="e.g. 40.7128" />
                  </div>
                  <div>
                    <Label className={labelClass}>Longitude</Label>
                    <Input type="number" step="any" value={passForm.lng} onChange={(e) => setPassForm((f) => ({ ...f, lng: e.target.value }))} className={inputClass} placeholder="e.g. -74.0060" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className={labelClass}>Start Date</Label>
                    <Input type="datetime-local" value={passForm.dateStart} onChange={(e) => setPassForm((f) => ({ ...f, dateStart: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <Label className={labelClass}>End Date</Label>
                    <Input type="datetime-local" value={passForm.dateEnd} onChange={(e) => setPassForm((f) => ({ ...f, dateEnd: e.target.value }))} className={inputClass} />
                  </div>
                </div>
                {error && <p className={errorClass}>{error}</p>}
                <Button type="submit" disabled={passSubmitting || passesUsed >= passesLimit}>
                  {passSubmitting ? "Creating..." : "Create Pass"}
                </Button>
                {passesUsed >= passesLimit && <p className={warnClass}>Pass limit reached. Ask super admin to increase your limit.</p>}
              </form>
            </CardContent>
          </Card>

          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={titleClass}>Passes ({passes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {passes.length === 0 ? (
                <p className={descClass}>No passes yet.</p>
              ) : (
                <ul className="space-y-2">
                  {passes.map((p) => (
                    <li key={p._id} className={`${listItemClass} flex flex-wrap items-center justify-between gap-2`}>
                      <div>
                        <p className={listTitleClass}>{p.name}</p>
                        {p.description && <p className={listSubClass}>{p.description}</p>}
                        <p className={listMutedClass}>{p.type} · {p.status}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => {
                          setEditPassId(p._id);
                          setEditPassForm({
                            name: p.name,
                            description: p.description ?? "",
                            type: p.type as "event" | "access",
                            status: p.status as "draft" | "active",
                            locationName: p.location?.name ?? "",
                            lat: p.location?.lat?.toString() ?? "",
                            lng: p.location?.lng?.toString() ?? "",
                            dateStart: p.dateStart ? new Date(p.dateStart).toISOString().slice(0, 16) : "",
                            dateEnd: p.dateEnd ? new Date(p.dateEnd).toISOString().slice(0, 16) : ""
                          });
                          setEditPassError("");
                        }}>Edit</Button>
                        <Button type="button" variant="outline" size="sm" className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onClick={() => setDeletePassId(p._id)}>Delete</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card className={cardClass}>
            <CardHeader>
              <CardTitle className={titleClass}>Company Profile</CardTitle>
              <CardDescription className={descClass}>
                These details will be shared with all employees created by you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={updateCompany} className="space-y-6 max-w-2xl">
                {/* Logo Upload */}
                <div>
                  <Label className={labelClass + " mb-2 block"}>Company Logo</Label>
                  <PhotoUpload
                    currentPhotoUrl={companyForm.logo}
                    onPhotoUploaded={(url) => setCompanyForm(f => ({ ...f, logo: url }))}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className={labelClass}>Company Name</Label>
                    <Input
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm(f => ({ ...f, name: e.target.value }))}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <Label className={labelClass}>Main Email</Label>
                    <Input
                      type="email"
                      value={companyForm.email}
                      onChange={(e) => setCompanyForm(f => ({ ...f, email: e.target.value }))}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label className={labelClass}>Address</Label>
                  <Input
                    value={companyForm.address}
                    onChange={(e) => setCompanyForm(f => ({ ...f, address: e.target.value }))}
                    className={inputClass}
                    placeholder="Headquarters Address"
                  />
                </div>

                {/* Location Picker */}
                <div>
                  <Label className={labelClass + " mb-2 block"}>Headquarters Location (Google Maps)</Label>
                  <LocationPicker
                    lat={companyForm.lat ? parseFloat(companyForm.lat) : undefined}
                    lng={companyForm.lng ? parseFloat(companyForm.lng) : undefined}
                    onLocationChange={(lat, lng) => setCompanyForm(f => ({ ...f, lat: lat.toString(), lng: lng.toString() }))}
                  />
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <Input placeholder="Latitude" value={companyForm.lat} readOnly className={inputClass + " bg-slate-100 dark:bg-slate-900"} />
                    <Input placeholder="Longitude" value={companyForm.lng} readOnly className={inputClass + " bg-slate-100 dark:bg-slate-900"} />
                  </div>
                </div>

                {companyMessage && (
                  <p className={`text-sm ${companyMessage.includes("success") ? "text-green-600 dark:text-green-400" : "text-red-600"}`}>
                    {companyMessage}
                  </p>
                )}

                <Button type="submit" disabled={companySubmitting}>
                  {companySubmitting ? "Saving..." : "Save Company Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        {/* View Profile Dialog */}
        <Dialog open={!!viewProfile} onOpenChange={(open) => !open && setViewProfile(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-50 dark:bg-slate-950 p-0 border-0">
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full"
                onClick={() => setViewProfile(null)}
              >
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
              </Button>
              {viewProfile && (
                <DigitalProfile
                  profileData={{
                    firstName: viewProfile.firstName || "",
                    lastName: viewProfile.lastName || "",
                    middleName: (viewProfile.middleName as string) || "",
                    name: `${viewProfile.firstName || ""} ${viewProfile.lastName || ""}`.trim(),
                    title: viewProfile.title || "",
                    company: viewProfile.company || companyForm.name || "Company Name",
                    companyLogo: companyForm.logo || "",
                    workEmail: viewProfile.workEmail || "",
                    workPhone: viewProfile.workPhone as string || "",
                    mobile: viewProfile.mobile || "",
                    photo: (viewProfile.photo as string) || "",
                    website: (viewProfile.website as string) || "",
                    linkedin: (viewProfile.linkedin as string) || undefined,
                    twitter: (viewProfile.twitter as string) || undefined,
                    facebook: (viewProfile.facebook as string) || undefined,
                    instagram: (viewProfile.instagram as string) || undefined,
                    notes: (viewProfile.notes as string) || "",
                    shorturl: (viewProfile.shorturl as string) || "preview",

                    // Address - Map company address if available
                    workStreet: companyForm.address || "",
                    workCity: "",
                    workState: "",
                    workZipcode: "",
                    workCountry: "",
                    homeStreet: "",
                    homeDistrict: "",
                    homeCity: "",
                    homeState: "",
                    homeZipcode: "",
                    homeCountry: "",
                    homePhone: "",
                    personalEmail: "",
                    fax: "",


                    dates: {},
                    locations: {
                      work: {
                        lat: parseFloat(companyForm.lat || "0"),
                        lng: parseFloat(companyForm.lng || "0"),
                        label: companyForm.address || companyForm.name || "Office"
                      }
                    },
                  } as ProfileData}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

      </Tabs>

      {/* Edit pass dialog */}
      <Dialog open={!!editPassId} onOpenChange={(open) => !open && setEditPassId(null)}>
        <DialogContent className={cardClass}>
          <DialogHeader>
            <DialogTitle className={titleClass}>Edit Pass</DialogTitle>
          </DialogHeader>
          <form onSubmit={updatePass} className="space-y-4">
            <div>
              <Label className={labelClass}>Name</Label>
              <Input value={editPassForm.name} onChange={(e) => setEditPassForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} required />
            </div>
            <div>
              <Label className={labelClass}>Description</Label>
              <Input value={editPassForm.description} onChange={(e) => setEditPassForm((f) => ({ ...f, description: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <Label className={labelClass}>Type</Label>
              <select value={editPassForm.type} onChange={(e) => setEditPassForm((f) => ({ ...f, type: e.target.value as "event" | "access" }))} className={selectClass}>
                <option value="event">Event</option>
                <option value="access">Access</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label className={labelClass + " mb-2 block"}>Pin Location on Map</Label>
                <LocationPicker
                  lat={editPassForm.lat ? parseFloat(editPassForm.lat) : undefined}
                  lng={editPassForm.lng ? parseFloat(editPassForm.lng) : undefined}
                  onLocationChange={(lat, lng) => setEditPassForm(f => ({ ...f, lat: lat.toString(), lng: lng.toString() }))}
                />
              </div>
              <div className="sm:col-span-2">
                <Label className={labelClass}>Location Name</Label>
                <Input value={editPassForm.locationName} onChange={(e) => setEditPassForm((f) => ({ ...f, locationName: e.target.value }))} className={inputClass} placeholder="e.g. Madison Garden" />
              </div>
              <div>
                <Label className={labelClass}>Latitude</Label>
                <Input type="number" step="any" value={editPassForm.lat} onChange={(e) => setEditPassForm((f) => ({ ...f, lat: e.target.value }))} className={inputClass} placeholder="e.g. 40.7128" />
              </div>
              <div>
                <Label className={labelClass}>Longitude</Label>
                <Input type="number" step="any" value={editPassForm.lng} onChange={(e) => setEditPassForm((f) => ({ ...f, lng: e.target.value }))} className={inputClass} placeholder="e.g. -74.0060" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className={labelClass}>Start Date</Label>
                <Input type="datetime-local" value={editPassForm.dateStart} onChange={(e) => setEditPassForm((f) => ({ ...f, dateStart: e.target.value }))} className={inputClass} />
              </div>
              <div>
                <Label className={labelClass}>End Date</Label>
                <Input type="datetime-local" value={editPassForm.dateEnd} onChange={(e) => setEditPassForm((f) => ({ ...f, dateEnd: e.target.value }))} className={inputClass} />
              </div>
            </div>

            <div>
              <Label className={labelClass}>Status</Label>
              <select value={editPassForm.status} onChange={(e) => setEditPassForm((f) => ({ ...f, status: e.target.value as "draft" | "active" }))} className={selectClass}>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
              </select>
            </div>
            {editPassError && <p className={errorClass}>{editPassError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditPassId(null)}>Cancel</Button>
              <Button type="submit" disabled={editPassSubmitting}>Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete pass confirm */}
      <Dialog open={!!deletePassId} onOpenChange={(open) => !open && !deletePassSubmitting && setDeletePassId(null)}>
        <DialogContent className={cardClass}>
          <DialogHeader>
            <DialogTitle className={titleClass}>Delete pass?</DialogTitle>
            <DialogDescription className={descClass}>
              This pass will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeletePassId(null)} disabled={deletePassSubmitting}>Cancel</Button>
            <Button type="button" variant="destructive" onClick={deletePass} disabled={deletePassSubmitting}>
              {deletePassSubmitting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div >
  );
}
