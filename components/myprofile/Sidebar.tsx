"use client";

import { ProfileData } from "@/app/_actions/profile";
import { generateAndUpdateShortUrl } from "@/app/_actions/profile";
import DigitalCard from "@/components/dashboardlogin/digital-card";
import QRCodeGenerator from "@/components/dashboardlogin/qr-code-generator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { Link } from "lucide-react";

type Props = {
  profile?: ProfileData;
};

export default function MyProfileSidebar({ profile }: Props) {
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false);

  const handleGenerateShortUrl = async () => {
    if (!profile) return;
    try {
      setIsGeneratingUrl(true);
      const result = await generateAndUpdateShortUrl(profile.userEmail);
      if (result.success) {
        toast.success("Short URL generated successfully!");
        // Force page reload to update the profile data
        window.location.reload();
      } else {
        toast.error(result.error || "Failed to generate short URL");
      }
    } catch (error) {
      toast.error("An error occurred while generating short URL");
    } finally {
      setIsGeneratingUrl(false);
    }
  };

  if (!profile) return null;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Digital Card</div>
        <DigitalCard user={profile} />
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Generate Shareable Link</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Create a shareable short URL for your digital profile.</p>
        {!profile.shorturl ? (
          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
            onClick={handleGenerateShortUrl}
            disabled={isGeneratingUrl}
          >
            <Link className="h-4 w-4 mr-2" />
            {isGeneratingUrl ? 'Generating...' : 'Generate Short URL'}
          </Button>
        ) : (
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-cyan-500 text-white"
            onClick={() => window.open(`/publicprofile/${profile.shorturl}`, '_blank')}
          >
            <Link className="h-4 w-4 mr-2" />
            Share Profile
          </Button>
        )}
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">QR Code</div>
        <QRCodeGenerator user={profile} />
      </div>
    </div>
  );
}


