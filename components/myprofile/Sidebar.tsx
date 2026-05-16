"use client";

import { ProfileData } from "@/app/_actions/profile";
import { generateAndUpdateShortUrl } from "@/app/_actions/profile";
import DigitalCard from "@/components/dashboardlogin/digital-card";
import QRCodeGenerator from "@/components/dashboardlogin/qr-code-generator";
import { Button } from "@/components/ui/button";
import { hasRequiredProfileFields, REQUIRED_PROFILE_FIELDS_MESSAGE } from "@/lib/profile-completeness";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "lucide-react";

type Props = {
  profile?: ProfileData;
  /** Logged-in user email; used when profile/userEmail is not yet in state (e.g. before first save). */
  userEmail?: string;
};

export default function MyProfileSidebar({ profile, userEmail: sessionUserEmail }: Props) {
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);
  const [initialShortUrl, setInitialShortUrl] = useState(profile?.shorturl);

  const isProfileComplete = hasRequiredProfileFields(profile);

  const handleGenerateShortUrl = async () => {
    if (!isProfileComplete) {
      toast.error(REQUIRED_PROFILE_FIELDS_MESSAGE);
      return;
    }

    const emailToUse = profile?.userEmail || sessionUserEmail;
    if (!emailToUse?.trim()) {
      toast.error("Cannot generate URL: sign-in email is missing.");
      return;
    }
    try {
      setIsGeneratingUrl(true);
      const result = await generateAndUpdateShortUrl(emailToUse);
      if (result.success && result.shorturl) {
        toast.success("Short URL generated successfully!");
        setInitialShortUrl(result.shorturl);
      } else {
        toast.error(result.error || "Failed to generate short URL");
      }
    } catch (error) {
      toast.error("An error occurred while generating short URL");
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  // Show sidebar if we have either profile data or session email (so "Generate Short URL" can run)
  const hasProfileOrEmail = profile || sessionUserEmail;
  if (!hasProfileOrEmail) return null;

  // Use either the passed shorturl (from preview/edit) or the one we know exists
  const activeShortUrl = profile?.shorturl || initialShortUrl;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Digital Card</div>
        <DigitalCard user={profile || ({ userEmail: sessionUserEmail, name: sessionUserEmail ?? "" } as ProfileData)} />
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Shareable Profile</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
          {activeShortUrl
            ? "Your profile is live! Share this link with others."
            : "Create a shareable short URL for your digital profile."
          }
        </p>
        {!activeShortUrl ? (
          <div className="group relative">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
              onClick={handleGenerateShortUrl}
              disabled={isGeneratingUrl || !isProfileComplete}
              aria-describedby={!isProfileComplete ? "short-url-required-fields" : undefined}
            >
              <Link className="h-4 w-4 mr-2" />
              {isGeneratingUrl ? 'Generating...' : 'Generate Short URL'}
            </Button>
            {!isProfileComplete && (
              <div
                id="short-url-required-fields"
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 hidden w-64 -translate-x-1/2 rounded-md border border-gray-200 bg-white px-3 py-2 text-center text-xs text-gray-900 shadow-lg group-hover:block group-focus-within:block dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              >
                {REQUIRED_PROFILE_FIELDS_MESSAGE}
              </div>
            )}
          </div>
        ) : (
          <div title={!isProfileComplete ? REQUIRED_PROFILE_FIELDS_MESSAGE : undefined}>
            <Button
              className="w-full bg-gradient-to-r from-green-600 to-cyan-500 text-white"
              onClick={() => window.open(`/publicprofile/${activeShortUrl}`, '_blank')}
              disabled={!isProfileComplete}
            >
              <Link className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
          </div>
        )}
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">QR Code</div>
        <QRCodeGenerator user={profile || ({ userEmail: sessionUserEmail, name: sessionUserEmail ?? "" } as ProfileData)} />
      </div>
    </div>
  );
}


