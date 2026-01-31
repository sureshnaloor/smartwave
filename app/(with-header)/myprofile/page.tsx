"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getProfile, ProfileData } from "@/app/_actions/profile";
import ProfileCard from "@/components/myprofile/ProfileCard";
import MyProfileSidebar from "@/components/myprofile/Sidebar";

export default function MyProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [preview, setPreview] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      if (status === "unauthenticated") {
        router.push("/");
        return;
      }
      if (status === "authenticated" && session?.user?.email) {
        setLoading(true);
        const p = await getProfile(session.user.email);
        setProfile(p);
        setPreview(p);
        setLoading(false);
      }
    };
    run();
  }, [status, session, router]);

  if (loading || status === "loading") return <LoadingSpinner />;
  if (!session?.user?.email) return null;

  const isEmployee = (session.user as { role?: string }).role === "employee";

  return (
    <div className="container mx-auto px-4 py-6">
      {isEmployee && (
        <p className="mb-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 px-4 py-2 text-sm text-amber-800 dark:text-amber-200">
          Your profile is managed by your company admin. You can view and share only; edit and delete are not available.
        </p>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCard
            userEmail={session.user.email}
            initialData={profile || undefined}
            onPreviewChange={(p) => setPreview(p as ProfileData)}
            readOnly={isEmployee}
          />
        </div>
        <div className="lg:col-span-1">
          <MyProfileSidebar
            profile={(preview || profile) || undefined}
            userEmail={session.user.email}
          />
        </div>
      </div>
    </div>
  );
}


