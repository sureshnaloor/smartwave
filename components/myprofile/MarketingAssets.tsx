"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/app/_actions/profile";
import { Mail, Linkedin, Twitter, Facebook, MessageCircle, Share2 } from "lucide-react";
import { EmailSignatureModal } from "./modals/EmailSignatureModal";
import { SocialCardModal, SocialPlatform } from "./modals/SocialCardModal";

interface MarketingAssetsProps {
  profile?: ProfileData;
}

export default function MarketingAssets({ profile }: MarketingAssetsProps) {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [socialModalState, setSocialModalState] = useState<{
    isOpen: boolean;
    platform: SocialPlatform;
  }>({
    isOpen: false,
    platform: "linkedin",
  });

  if (!profile) return null;

  const openSocialModal = (platform: SocialPlatform) => {
    setSocialModalState({ isOpen: true, platform });
  };

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <div className="flex items-center space-x-2 mb-3">
        <Share2 className="w-4 h-4 text-[#00b4d8]" />
        <div className="text-sm font-semibold text-gray-900 dark:text-white">Marketing Assets</div>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
        Generate professional email signatures and social media banners for your profile.
      </p>

      <div className="space-y-3">
        {/* Email Signature Button */}
        <Button 
          variant="outline" 
          className="w-full justify-start border-gray-200 dark:border-gray-700 hover:border-[#00b4d8] hover:bg-gray-50 dark:hover:bg-gray-800"
          onClick={() => setIsEmailModalOpen(true)}
        >
          <Mail className="w-4 h-4 mr-3 text-gray-500" />
          Email Signature
        </Button>

        {/* Social Platforms */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            className="w-full justify-start text-xs border-gray-200 dark:border-gray-700 hover:border-[#0077b5] hover:text-[#0077b5] hover:bg-blue-50 dark:hover:bg-[#0077b5]/10"
            onClick={() => openSocialModal("linkedin")}
          >
            <Linkedin className="w-3 h-3 mr-2" />
            LinkedIn
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-xs border-gray-200 dark:border-gray-700 hover:border-gray-900 hover:text-gray-900 dark:hover:border-white dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => openSocialModal("twitter")}
          >
            <Twitter className="w-3 h-3 mr-2" />
            X (Twitter)
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-xs border-gray-200 dark:border-gray-700 hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-blue-50 dark:hover:bg-[#1877F2]/10"
            onClick={() => openSocialModal("facebook")}
          >
            <Facebook className="w-3 h-3 mr-2" />
            Facebook
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start text-xs border-gray-200 dark:border-gray-700 hover:border-[#25D366] hover:text-[#25D366] hover:bg-green-50 dark:hover:bg-[#25D366]/10"
            onClick={() => openSocialModal("whatsapp")}
          >
            <MessageCircle className="w-3 h-3 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>

      {/* Modals */}
      <EmailSignatureModal 
        isOpen={isEmailModalOpen} 
        onClose={() => setIsEmailModalOpen(false)} 
        profile={profile} 
      />
      
      <SocialCardModal 
        isOpen={socialModalState.isOpen} 
        onClose={() => setSocialModalState(prev => ({ ...prev, isOpen: false }))} 
        profile={profile} 
        platform={socialModalState.platform}
      />
    </div>
  );
}
