"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProfileData, saveProfile } from "@/app/_actions/profile";
import { useDebouncedSave } from "@/hooks/useDebouncedSave";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";
import { Spinner, Check } from "@/components/ui/icons";
import EditableField from "@/components/myprofile/EditableField";
import PhotoUpload from "@/components/myprofile/PhotoUpload";
import CompanyLogoUpload from "@/components/myprofile/CompanyLogoUpload";

type Props = {
  userEmail: string;
  initialData?: ProfileData;
  onPreviewChange?: (p: Partial<ProfileData>) => void;
};

export default function ProfileCard({ userEmail, initialData, onPreviewChange }: Props) {
  const [form, setForm] = useState<Partial<ProfileData>>(() => ({
    firstName: initialData?.firstName || "",
    middleName: initialData?.middleName || "",
    lastName: initialData?.lastName || "",
    title: initialData?.title || "",
    company: initialData?.company || "",
    workEmail: initialData?.workEmail || "",
    personalEmail: initialData?.personalEmail || "",
    mobile: initialData?.mobile || "",
    workPhone: initialData?.workPhone || "",
    homePhone: initialData?.homePhone || "",
    fax: initialData?.fax || "",
    website: initialData?.website || "",
    workStreet: initialData?.workStreet || "",
    workDistrict: initialData?.workDistrict || "",
    workCity: initialData?.workCity || "",
    workState: initialData?.workState || "",
    workZipcode: initialData?.workZipcode || "",
    workCountry: initialData?.workCountry || "",
    homeStreet: initialData?.homeStreet || "",
    homeDistrict: initialData?.homeDistrict || "",
    homeCity: initialData?.homeCity || "",
    homeState: initialData?.homeState || "",
    homeZipcode: initialData?.homeZipcode || "",
    homeCountry: initialData?.homeCountry || "",
    linkedin: initialData?.linkedin || "",
    twitter: initialData?.twitter || "",
    facebook: initialData?.facebook || "",
    instagram: initialData?.instagram || "",
    youtube: initialData?.youtube || "",
    notes: initialData?.notes || "",
    photo: initialData?.photo || "",
    companyLogo: initialData?.companyLogo || "",
    birthday: initialData?.birthday || "",
    name: initialData?.name || "",
  }));
  const [isDirty, setIsDirty] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);
  const snapshotRef = useRef<Partial<ProfileData>>({ ...form });

  useUnsavedChanges({ isDirty, profilePathStartsWith: "/myprofile" });

  // Compute display name
  const displayName = useMemo(() => {
    const parts = [form.firstName, form.middleName, form.lastName].filter(Boolean);
    return parts.join(" ").trim();
  }, [form.firstName, form.middleName, form.lastName]);

  const { schedule, isSaving } = useDebouncedSave<Partial<ProfileData>>(async (data) => {
    if (!userEmail) return;
    const changed = Object.keys(data).some((k) => {
      const key = k as keyof ProfileData;
      return data[key] !== snapshotRef.current[key];
    });
    if (!changed) return;
    const result = await saveProfile({ ...data, userEmail }, userEmail);
    if (result.success) {
      snapshotRef.current = { ...snapshotRef.current, ...data };
      setIsDirty(false);
      setLastSavedAt(Date.now());
    }
  }, 800);

  const updateField = (key: keyof ProfileData, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value } as Partial<ProfileData>;
      // recompute name
      const parts = [next.firstName, next.middleName, next.lastName].filter(Boolean);
      next.name = parts.join(" ").trim();
      onPreviewChange?.(next);
      return next;
    });
    setIsDirty(true);
    // Exclude image fields from autosave here; dedicated upload components will save explicitly
    if (key !== "photo" && key !== "companyLogo") {
      const parts = [
        key === "firstName" ? value : form.firstName,
        key === "middleName" ? value : form.middleName,
        key === "lastName" ? value : form.lastName,
      ].filter(Boolean);
      const newName = parts.join(" ").trim();
      const payload: Partial<ProfileData> = { [key]: value } as Partial<ProfileData>;
      if (["firstName", "middleName", "lastName"].includes(key)) {
        payload.name = newName;
      }
      schedule(payload);
    }
  };

  return (
    <div className="relative">
      {/* Wallet-pass style header bar */}
      <div className="h-3 w-full bg-gradient-to-r from-blue-700 via-sky-500 to-cyan-400 rounded-t-2xl" />
      <div className="rounded-b-2xl border border-blue-100 shadow-[inset_8px_0_14px_-10px_rgba(30,58,138,0.35),inset_-8px_0_14px_-10px_rgba(8,47,73,0.35)] bg-white overflow-hidden">
        {/* Header: photo | identity | company logo */}
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 rounded-lg border bg-white/60 px-4 py-4 hover:shadow-sm transition-shadow">
            <div className="w-20 h-20 sm:w-24 sm:h-24">
              <PhotoUpload
                value={form.photo || ""}
                onUploaded={(url) => {
                  setForm((p) => ({ ...p, photo: url }));
                  setIsDirty(true);
                  // explicit save for images
                  void saveProfile({ photo: url, userEmail }, userEmail).then(() => {
                    snapshotRef.current = { ...snapshotRef.current, photo: url };
                    setIsDirty(false);
                    setLastSavedAt(Date.now());
                  });
                }}
              />
            </div>
            <div className="flex-1 min-w-0 text-center">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <EditableField label="First Name" value={form.firstName || ""} placeholder="First" onChange={(v) => updateField("firstName", v)} className="text-base sm:text-lg font-semibold" />
                <EditableField label="Middle Name" value={form.middleName || ""} placeholder="Middle" onChange={(v) => updateField("middleName", v)} className="text-base sm:text-lg" />
                <EditableField label="Last Name" value={form.lastName || ""} placeholder="Last" onChange={(v) => updateField("lastName", v)} className="text-base sm:text-lg font-semibold" />
              </div>
              <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <EditableField label="Title" value={form.title || ""} placeholder="Job Title" onChange={(v) => updateField("title", v)} />
                <EditableField label="Company" value={form.company || ""} placeholder="Company" onChange={(v) => updateField("company", v)} />
              </div>
            </div>
            <div className="w-20 h-20 sm:w-24 sm:h-24">
              <CompanyLogoUpload
                value={form.companyLogo || ""}
                onUploaded={(url) => {
                  setForm((p) => ({ ...p, companyLogo: url }));
                  setIsDirty(true);
                  void saveProfile({ companyLogo: url, userEmail }, userEmail).then(() => {
                    snapshotRef.current = { ...snapshotRef.current, companyLogo: url };
                    setIsDirty(false);
                    setLastSavedAt(Date.now());
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 space-y-5">
          {/* Contact */}
          <div className="rounded-lg border bg-white/60 p-4 hover:shadow-sm transition-shadow">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-700 mb-3">Contact</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditableField label="Mobile" value={form.mobile || ""} placeholder="Add mobile" onChange={(v) => updateField("mobile", v)} icon="phone" />
              <EditableField label="Work Phone" value={form.workPhone || ""} placeholder="Add work phone" onChange={(v) => updateField("workPhone", v)} icon="phone" />
              <EditableField label="Home Phone" value={form.homePhone || ""} placeholder="Add home phone" onChange={(v) => updateField("homePhone", v)} icon="phone" />
              <EditableField label="Fax" value={form.fax || ""} placeholder="Add fax" onChange={(v) => updateField("fax", v)} icon="phone" />
              <EditableField label="Work Email" value={form.workEmail || ""} placeholder="Add work email" onChange={(v) => updateField("workEmail", v)} icon="mail" />
              <EditableField label="Personal Email" value={form.personalEmail || ""} placeholder="Add personal email" onChange={(v) => updateField("personalEmail", v)} icon="mail" />
              <EditableField label="Website" value={form.website || ""} placeholder="Add website" onChange={(v) => updateField("website", v)} icon="link" />
            </div>
          </div>

          {/* Work Address */}
          <div className="rounded-lg border bg-white/60 p-4 hover:shadow-sm transition-shadow">
            <div className="text-xs font-semibold uppercase tracking-wide text-blue-700 mb-3">Work Address</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditableField label="Street" value={form.workStreet || ""} placeholder="Street" onChange={(v) => updateField("workStreet", v)} icon="map" />
              <EditableField label="District" value={form.workDistrict || ""} placeholder="District" onChange={(v) => updateField("workDistrict", v)} icon="map" />
              <EditableField label="City" value={form.workCity || ""} placeholder="City" onChange={(v) => updateField("workCity", v)} icon="map" />
              <EditableField label="State" value={form.workState || ""} placeholder="State" onChange={(v) => updateField("workState", v)} icon="map" />
              <EditableField label="Zip" value={form.workZipcode || ""} placeholder="Zip" onChange={(v) => updateField("workZipcode", v)} icon="hash" />
              <EditableField label="Country" value={form.workCountry || ""} placeholder="Country" onChange={(v) => updateField("workCountry", v)} icon="flag" />
            </div>
          </div>

          {/* Home Address */}
          <div className="rounded-lg border bg-white/60 p-4 hover:shadow-sm transition-shadow">
            <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700 mb-3">Home Address</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditableField label="Street" value={form.homeStreet || ""} placeholder="Street" onChange={(v) => updateField("homeStreet", v)} icon="map" />
              <EditableField label="District" value={form.homeDistrict || ""} placeholder="District" onChange={(v) => updateField("homeDistrict", v)} icon="map" />
              <EditableField label="City" value={form.homeCity || ""} placeholder="City" onChange={(v) => updateField("homeCity", v)} icon="map" />
              <EditableField label="State" value={form.homeState || ""} placeholder="State" onChange={(v) => updateField("homeState", v)} icon="map" />
              <EditableField label="Zip" value={form.homeZipcode || ""} placeholder="Zip" onChange={(v) => updateField("homeZipcode", v)} icon="hash" />
              <EditableField label="Country" value={form.homeCountry || ""} placeholder="Country" onChange={(v) => updateField("homeCountry", v)} icon="flag" />
            </div>
          </div>

          {/* Social */}
          <div className="rounded-lg border bg-white/60 p-4 hover:shadow-sm transition-shadow">
            <div className="text-xs font-semibold uppercase tracking-wide text-purple-700 mb-3">Social</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditableField label="LinkedIn" value={form.linkedin || ""} placeholder="LinkedIn URL" onChange={(v) => updateField("linkedin", v)} icon="linkedin" />
              <EditableField label="Twitter/X" value={form.twitter || ""} placeholder="Twitter URL" onChange={(v) => updateField("twitter", v)} icon="twitter" />
              <EditableField label="Facebook" value={form.facebook || ""} placeholder="Facebook URL" onChange={(v) => updateField("facebook", v)} icon="facebook" />
              <EditableField label="Instagram" value={form.instagram || ""} placeholder="Instagram URL" onChange={(v) => updateField("instagram", v)} icon="instagram" />
              <EditableField label="YouTube" value={form.youtube || ""} placeholder="YouTube URL" onChange={(v) => updateField("youtube", v)} icon="youtube" />
            </div>
          </div>

          {/* Extras */}
          <div className="rounded-lg border bg-white/60 p-4 hover:shadow-sm transition-shadow">
            <div className="text-xs font-semibold uppercase tracking-wide text-cyan-700 mb-3">Additional</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <EditableField label="Birthday" value={form.birthday || ""} placeholder="YYYY-MM-DD" onChange={(v) => updateField("birthday", v)} icon="calendar" inputType="date" />
              <EditableField label="Notes" value={form.notes || ""} placeholder="Notes" onChange={(v) => updateField("notes", v)} icon="note" multiline />
            </div>
          </div>
        </div>
        {/* Bottom gradient bar for visual closure */}
        <div className="h-2 w-full bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-700 rounded-b-2xl" />
      </div>

      {/* No explicit Save button; autosave handles persistence */}

      {/* Desktop status badge */}
      <div className="hidden md:block fixed top-4 right-4 z-30">
        {(isSaving || lastSavedAt) && (
          <div className={`rounded-full shadow-sm border bg-white/95 backdrop-blur px-3 py-1.5 text-xs transition-opacity duration-300 ${isSaving ? 'opacity-100' : 'opacity-100'}`}>
            {isSaving ? (
              <span className="inline-flex items-center gap-2 text-blue-700"><Spinner className="h-3 w-3" />Saving…</span>
            ) : (
              <span className="inline-flex items-center gap-2 text-green-700"><Check className="h-3 w-3" />Saved</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


