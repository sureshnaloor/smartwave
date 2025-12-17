"use client";

import { ProfileData } from "@/app/_actions/profile";
import DigitalCard from "@/components/dashboardlogin/digital-card";
import QRCodeGenerator from "@/components/dashboardlogin/qr-code-generator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Props = {
  profile?: ProfileData;
};

export default function MyProfileSidebar({ profile }: Props) {
  if (!profile) return null;
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Digital Card</div>
        <DigitalCard user={profile} />
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">QR Code</div>
        <QRCodeGenerator user={profile} />
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <div className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">Wallet</div>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Export this card to your wallet (coming soon).</p>
        <Button
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
          onClick={() => toast.info("Export to Wallet is coming soon. We will support Apple/Google Wallet.")}
        >
          Export to Wallet
        </Button>
      </div>
    </div>
  );
}


