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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProfileCard
            userEmail={session.user.email}
            initialData={profile || undefined}
            onPreviewChange={(p) => setPreview(p as ProfileData)}
          />
        </div>
        <div className="lg:col-span-1">
          <MyProfileSidebar profile={(preview || profile) || undefined} />
        </div>
      </div>
    </div>
  );
}


