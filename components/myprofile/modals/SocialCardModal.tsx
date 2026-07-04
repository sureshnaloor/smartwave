"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/app/_actions/profile";
import { Download, Loader2 } from "lucide-react";
import * as htmlToImage from "html-to-image";
import download from "downloadjs";
import { QRCodeSVG } from "qrcode.react";

export type SocialPlatform = "linkedin" | "twitter" | "facebook" | "whatsapp";

interface SocialCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: ProfileData;
  platform: SocialPlatform;
}

const PLATFORM_CONFIG = {
  linkedin: { width: 1200, height: 627, title: "LinkedIn Post" },
  twitter: { width: 1200, height: 675, title: "X (Twitter) Post" },
  facebook: { width: 1200, height: 630, title: "Facebook Post" },
  whatsapp: { width: 1080, height: 1920, title: "WhatsApp Status" },
};

export function SocialCardModal({ isOpen, onClose, profile, platform }: SocialCardModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  if (!profile) return null;

  const config = PLATFORM_CONFIG[platform];
  // WhatsApp is much taller, so it needs a smaller scale to fit in the modal
  const scale = platform === 'whatsapp' ? 0.25 : 0.4;
  const scaledWidth = config.width * scale;
  const scaledHeight = config.height * scale;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsDownloading(true);
      const dataUrl = await htmlToImage.toPng(cardRef.current, { 
        quality: 0.95,
        pixelRatio: 2 // High res
      });
      download(dataUrl, `smartwave-${platform}-${profile.firstName.toLowerCase()}.png`);
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartwave.name';
  const publicProfileUrl = profile.shorturl 
    ? `${baseUrl}/publicprofile/${profile.shorturl}` 
    : baseUrl;
    
  const avatarUrl = profile.companyLogo || profile.photo || "/images/default-avatar.png";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{config.title} Card</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 min-h-[500px]">
          {/* Wrapper with exact scaled dimensions to prevent layout overflow in the flex container */}
          <div style={{ width: scaledWidth, height: scaledHeight, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)' }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              <div 
                ref={cardRef}
                style={{ 
                  width: `${config.width}px`, 
                  height: `${config.height}px`,
                }}
                className={`relative overflow-hidden flex flex-col justify-center bg-gradient-to-br from-white via-gray-50 to-gray-200 dark:from-gray-900 dark:via-slate-800 dark:to-black p-16 text-gray-900 dark:text-white`}
              >
              {/* Decorative Aurora Background Elements */}
              <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00b4d8] opacity-20 blur-[100px]" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00f5d4] opacity-10 blur-[100px]" />
              <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full bg-[#b87333] opacity-15 blur-[100px]" />

              <div className={`relative z-10 flex flex-col items-center justify-center text-center h-full ${platform === 'whatsapp' ? 'space-y-12' : 'space-y-8'}`}>
                {/* Avatar */}
                <div className={`${platform === 'whatsapp' ? 'w-64 h-64' : 'w-48 h-48'} rounded-full overflow-hidden border-4 border-[#00b4d8] shadow-2xl shadow-[#00b4d8]/20 bg-white`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={avatarUrl.startsWith('/') ? `${baseUrl}${avatarUrl}` : avatarUrl} alt={profile.firstName} className="w-full h-full object-cover" crossOrigin="anonymous" />
                </div>
                
                {/* Details */}
                <div className={`space-y-4 ${platform === 'whatsapp' ? 'mt-8' : ''}`}>
                  <h1 className={`${platform === 'whatsapp' ? 'text-8xl' : 'text-6xl'} font-bold tracking-tight text-gray-900 dark:text-white`}>{profile.firstName} {profile.lastName}</h1>
                  <h2 className={`${platform === 'whatsapp' ? 'text-4xl' : 'text-3xl'} text-gray-600 dark:text-gray-300`}>{profile.title}</h2>
                  {profile.company && (
                    <h3 className={`${platform === 'whatsapp' ? 'text-3xl' : 'text-2xl'} text-[#00b4d8] font-medium`}>{profile.company}</h3>
                  )}
                </div>

                {/* QR Code */}
                <div className={`mt-12 p-6 bg-white rounded-3xl inline-block shadow-xl border border-gray-100 dark:border-none`}>
                  <QRCodeSVG 
                    value={publicProfileUrl} 
                    size={platform === 'whatsapp' ? 400 : 150}
                    level={"H"}
                    includeMargin={false}
                  />
                </div>
                
                {platform === 'whatsapp' && (
                  <p className="mt-16 text-3xl text-gray-500 dark:text-gray-400 font-medium">Scan to save my contact info</p>
                )}
              </div>

              {/* Branding Header/Footer depending on orientation */}
              <div className={`absolute ${platform === 'whatsapp' ? 'top-16 left-0 right-0 text-center' : 'bottom-12 right-16'} z-10`}>
                <div className={`flex items-center justify-center space-x-4 opacity-90`}>
                  <div className={`${platform === 'whatsapp' ? 'w-16 h-16 text-3xl' : 'w-10 h-10 text-xl'} rounded-2xl bg-gradient-to-br from-[#00b4d8] to-[#00f5d4] flex items-center justify-center font-bold text-white dark:text-black shadow-lg`}>S</div>
                  <span className={`${platform === 'whatsapp' ? 'text-4xl' : 'text-2xl'} font-bold tracking-wider text-gray-800 dark:text-white`}>SmartWave</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <DialogFooter className="mt-4 shrink-0">
          <Button 
            onClick={handleDownload} 
            disabled={isDownloading}
            className="w-full bg-[#00b4d8] hover:bg-[#00f5d4] text-black"
          >
            {isDownloading ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Image...</>
            ) : (
              <><Download className="mr-2 h-4 w-4" /> Download Image</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
