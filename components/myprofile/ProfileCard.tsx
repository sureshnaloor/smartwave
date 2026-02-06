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
  /** When true (e.g. employee profile), display only; no edit/save/upload */
  readOnly?: boolean;
};

export default function ProfileCard({ userEmail, initialData, onPreviewChange, readOnly = false }: Props) {
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
    <div className="relative max-w-5xl mx-auto">
      {/* Main Card Container */}
      <div className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-gray-950/50 overflow-hidden border border-slate-100 dark:border-gray-800">

        {/* Vibrant Header Background */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-gray-900 to-transparent"></div>
        </div>

        {/* Content Wrapper */}
        <div className="relative px-8 pb-12 pt-12">

          {/* Identity Section - Floating above */}
          <div className="flex flex-col md:flex-row items-start md:items-end gap-8 mb-12">

            {/* Photo */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-white p-1.5 shadow-xl shadow-indigo-900/10 rotate-[-2deg] group-hover:rotate-0 transition-transform duration-300 ease-out">
                <div className="w-full h-full rounded-xl overflow-hidden bg-slate-50 relative">
                  {readOnly ? (
                    form.photo ? (
                      <img src={form.photo} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400/60 dark:text-gray-500/60 font-normal italic">No photo</div>
                    )
                  ) : (
                    <PhotoUpload
                      value={form.photo || ""}
                      onUploaded={(url) => {
                        setForm((p) => ({ ...p, photo: url }));
                        setIsDirty(true);
                        void saveProfile({ photo: url, userEmail }, userEmail).then(() => {
                          snapshotRef.current = { ...snapshotRef.current, photo: url };
                          setIsDirty(false);
                          setLastSavedAt(Date.now());
                        });
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Name & Title */}
            <div className="flex-1 min-w-0 pb-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <EditableField label="First Name" value={form.firstName || ""} placeholder="First Name" onChange={(v) => updateField("firstName", v)} className="!bg-white/80 backdrop-blur-sm !border-white/40 !shadow-sm" readOnly={readOnly} />
                <EditableField label="Middle Name" value={form.middleName || ""} placeholder="Middle Name" onChange={(v) => updateField("middleName", v)} className="!bg-white/80 backdrop-blur-sm !border-white/40 !shadow-sm" readOnly={readOnly} />
                <EditableField label="Last Name" value={form.lastName || ""} placeholder="Last Name" onChange={(v) => updateField("lastName", v)} className="!bg-white/80 backdrop-blur-sm !border-white/40 !shadow-sm" readOnly={readOnly} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <EditableField label="Job Title" value={form.title || ""} placeholder="What do you do?" onChange={(v) => updateField("title", v)} className="!bg-white/50" readOnly={readOnly} />
                <EditableField label="Company" value={form.company || ""} placeholder="Where do you work?" onChange={(v) => updateField("company", v)} className="!bg-white/50" readOnly={readOnly} />
              </div>
            </div>

            {/* Company Logo */}
            <div className="hidden md:block w-24 h-24 rounded-2xl bg-white p-2 shadow-lg shadow-slate-200/50 border border-slate-100 rotate-[2deg] hover:rotate-0 transition-transform duration-300">
              {readOnly ? (
                form.companyLogo ? (
                  <img src={form.companyLogo} alt="Company" className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400/60 dark:text-gray-500/60 font-normal italic">No logo</div>
                )
              ) : (
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
              )}
            </div>
          </div>

          {/* Main Form Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">

            {/* Left Column */}
            <div className="space-y-10">
              {/* Contact Info */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Contact Details</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 pl-2 border-l-2 border-blue-50 dark:border-blue-900/30">
                  <EditableField label="Mobile" readOnly={readOnly} value={form.mobile || ""} placeholder="+1 (555) 000-0000" onChange={(v) => updateField("mobile", v)} icon="phone" />
                  <EditableField label="Work Phone" readOnly={readOnly} value={form.workPhone || ""} placeholder="+1 (555) 000-0000" onChange={(v) => updateField("workPhone", v)} icon="phone" />
                  <EditableField label="Work Email" readOnly={readOnly} value={form.workEmail || ""} placeholder="you@company.com" onChange={(v) => updateField("workEmail", v)} icon="mail" />
                  <EditableField label="Personal Email" readOnly={readOnly} value={form.personalEmail || ""} placeholder="you@gmail.com" onChange={(v) => updateField("personalEmail", v)} icon="mail" />
                  <EditableField label="Website" readOnly={readOnly} value={form.website || ""} placeholder="https://yourwebsite.com" onChange={(v) => updateField("website", v)} icon="link" />
                </div>
              </section>

              {/* Social Media */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Social Profiles</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 border-l-2 border-purple-50 dark:border-purple-900/30">
                  <EditableField label="LinkedIn" readOnly={readOnly} value={form.linkedin || ""} placeholder="LinkedIn Profile" onChange={(v) => updateField("linkedin", v)} icon="linkedin" />
                  <EditableField label="Twitter/X" readOnly={readOnly} value={form.twitter || ""} placeholder="Twitter Handle" onChange={(v) => updateField("twitter", v)} icon="twitter" />
                  <EditableField label="Instagram" readOnly={readOnly} value={form.instagram || ""} placeholder="Instagram Handle" onChange={(v) => updateField("instagram", v)} icon="instagram" />
                  <EditableField label="Facebook" readOnly={readOnly} value={form.facebook || ""} placeholder="Facebook Profile" onChange={(v) => updateField("facebook", v)} icon="facebook" />
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-10">
              {/* Work Address */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Work Address</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-emerald-50 dark:border-emerald-900/30">
                  <div className="col-span-2"><EditableField label="Street Address" value={form.workStreet || ""} readOnly={readOnly} placeholder="123 Business Rd" onChange={(v) => updateField("workStreet", v)} icon="map" /></div>
                  <EditableField label="City" value={form.workCity || ""} readOnly={readOnly} placeholder="City" onChange={(v) => updateField("workCity", v)} icon="map" />
                  <EditableField label="State" value={form.workState || ""} readOnly={readOnly} placeholder="State" onChange={(v) => updateField("workState", v)} icon="map" />
                  <EditableField label="Zip Code" value={form.workZipcode || ""} readOnly={readOnly} placeholder="12345" onChange={(v) => updateField("workZipcode", v)} icon="hash" />
                  <EditableField label="Country" value={form.workCountry || ""} readOnly={readOnly} placeholder="Country" onChange={(v) => updateField("workCountry", v)} icon="flag" />
                </div>
              </section>

              {/* Home Address */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/30 rounded-lg text-orange-600 dark:text-orange-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Home Address</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-orange-50 dark:border-orange-900/30">
                  <div className="col-span-2"><EditableField label="Street Address" value={form.homeStreet || ""} readOnly={readOnly} placeholder="456 Home Ln" onChange={(v) => updateField("homeStreet", v)} icon="map" /></div>
                  <EditableField label="City" value={form.homeCity || ""} readOnly={readOnly} placeholder="City" onChange={(v) => updateField("homeCity", v)} icon="map" />
                  <EditableField label="State" value={form.homeState || ""} readOnly={readOnly} placeholder="State" onChange={(v) => updateField("homeState", v)} icon="map" />
                  <EditableField label="Zip Code" value={form.homeZipcode || ""} readOnly={readOnly} placeholder="12345" onChange={(v) => updateField("homeZipcode", v)} icon="hash" />
                  <EditableField label="Country" value={form.homeCountry || ""} readOnly={readOnly} placeholder="Country" onChange={(v) => updateField("homeCountry", v)} icon="flag" />
                </div>
              </section>

              {/* Additional Info */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">Additional Info</h3>
                </div>
                <div className="grid grid-cols-1 gap-3 pl-2 border-l-2 border-pink-50 dark:border-pink-900/30">
                  <EditableField label="Birthday" readOnly={readOnly} value={form.birthday || ""} placeholder="YYYY-MM-DD" onChange={(v) => updateField("birthday", v)} icon="calendar" inputType="date" />
                  <EditableField label="Notes" readOnly={readOnly} value={form.notes || ""} placeholder="Any additional notes..." onChange={(v) => updateField("notes", v)} icon="note" multiline />
                </div>
              </section>
            </div>
          </div>

        </div>
      </div>

      {/* Desktop status badge */}
      <div className="hidden md:block fixed bottom-8 right-8 z-50">
        {(isSaving || lastSavedAt) && (
          <div className={`rounded-full shadow-lg border border-slate-100 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md px-4 py-2 text-sm font-medium transition-all duration-500 transform ${isSaving ? 'opacity-100 translate-y-0' : 'opacity-80 translate-y-2 hover:opacity-100 hover:translate-y-0'}`}>
            {isSaving ? (
              <span className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400"><Spinner className="h-4 w-4 animate-spin" />Saving changes...</span>
            ) : (
              <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400"><Check className="h-4 w-4" />All changes saved</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


