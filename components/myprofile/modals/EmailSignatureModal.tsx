"use client";

import { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ProfileData } from "@/app/_actions/profile";
import { Copy, Check } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

interface EmailSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: ProfileData;
}

export function EmailSignatureModal({ isOpen, onClose, profile }: EmailSignatureModalProps) {
  const signatureRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();
  const signatureTheme = theme === 'dark' ? 'dark' : 'light';

  if (!profile) return null;

  const handleCopy = async () => {
    if (!signatureRef.current) return;
    
    try {
      const html = signatureRef.current.innerHTML;
      const blob = new Blob([html], { type: "text/html" });
      const clipboardItem = new ClipboardItem({ "text/html": blob });
      
      await navigator.clipboard.write([clipboardItem]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy signature", err);
      // Fallback for older browsers
      const range = document.createRange();
      range.selectNode(signatureRef.current);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand("copy");
      window.getSelection()?.removeAllRanges();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smartwave.name';
  const publicProfileUrl = profile.shorturl 
    ? `${baseUrl}/publicprofile/${profile.shorturl}` 
    : baseUrl;
    
  // Use company logo if available, else user photo, else placeholder
  const avatarUrl = profile.companyLogo || profile.photo || `${baseUrl}/images/default-avatar.png`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Email Signature</DialogTitle>
        </DialogHeader>
        
        <div className={`p-4 ${signatureTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} rounded-lg overflow-auto border border-gray-200 dark:border-gray-700`}>
          <div ref={signatureRef} className="p-6" style={{ fontFamily: 'Arial, sans-serif', backgroundColor: signatureTheme === 'dark' ? '#0f172a' : '#ffffff', color: signatureTheme === 'dark' ? '#f3f4f6' : '#333333', borderRadius: '8px' }}>
            <table cellPadding="0" cellSpacing="0" border={0} style={{ width: '100%', maxWidth: '500px' }}>
              <tbody>
                <tr>
                  <td style={{ verticalAlign: 'top', width: '120px', paddingRight: '20px' }}>
                    {/* Fallback to regular img tag for email client compatibility */}
                    <img 
                      src={avatarUrl.startsWith('/') ? `${baseUrl}${avatarUrl}` : avatarUrl} 
                      alt={`${profile.firstName} ${profile.lastName}`}
                      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                      width="100"
                      height="100"
                    />
                  </td>
                  <td style={{ verticalAlign: 'top' }}>
                    <h2 style={{ margin: '0 0 5px 0', fontSize: '18px', color: signatureTheme === 'dark' ? '#00f5d4' : '#00b4d8', fontWeight: 'bold' }}>
                      {profile.firstName} {profile.lastName}
                    </h2>
                    {profile.title && (
                      <p style={{ margin: '0 0 2px 0', fontSize: '14px', color: signatureTheme === 'dark' ? '#9ca3af' : '#666666' }}>
                        {profile.title}
                      </p>
                    )}
                    {profile.company && (
                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', fontWeight: 'bold', color: signatureTheme === 'dark' ? '#f3f4f6' : '#333333' }}>
                        {profile.company}
                      </p>
                    )}
                    
                    <table cellPadding="0" cellSpacing="0" border={0} style={{ fontSize: '12px', color: signatureTheme === 'dark' ? '#9ca3af' : '#666666' }}>
                      <tbody>
                        {(profile.mobile || profile.workPhone) && (
                          <tr>
                            <td style={{ paddingBottom: '4px', paddingRight: '8px', color: signatureTheme === 'dark' ? '#00f5d4' : '#00b4d8' }}><strong>P:</strong></td>
                            <td style={{ paddingBottom: '4px' }}>{profile.mobile || profile.workPhone}</td>
                          </tr>
                        )}
                        {(profile.workEmail || profile.personalEmail || profile.userEmail) && (
                          <tr>
                            <td style={{ paddingBottom: '4px', paddingRight: '8px', color: signatureTheme === 'dark' ? '#00f5d4' : '#00b4d8' }}><strong>E:</strong></td>
                            <td style={{ paddingBottom: '4px' }}>
                              <a href={`mailto:${profile.workEmail || profile.personalEmail || profile.userEmail}`} style={{ color: signatureTheme === 'dark' ? '#9ca3af' : '#666666', textDecoration: 'none' }}>
                                {profile.workEmail || profile.personalEmail || profile.userEmail}
                              </a>
                            </td>
                          </tr>
                        )}
                        {profile.website && (
                          <tr>
                            <td style={{ paddingBottom: '4px', paddingRight: '8px', color: signatureTheme === 'dark' ? '#00f5d4' : '#00b4d8' }}><strong>W:</strong></td>
                            <td style={{ paddingBottom: '4px' }}>
                              <a href={profile.website} style={{ color: signatureTheme === 'dark' ? '#9ca3af' : '#666666', textDecoration: 'none' }}>
                                {profile.website.replace(/^https?:\/\//, '')}
                              </a>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    
                    <div style={{ marginTop: '15px' }}>
                      <a 
                        href={publicProfileUrl} 
                        style={{ 
                          display: 'inline-block', 
                          padding: '8px 16px', 
                          backgroundColor: signatureTheme === 'dark' ? '#00f5d4' : '#00b4d8', 
                          color: signatureTheme === 'dark' ? '#0f172a' : '#ffffff', 
                          textDecoration: 'none', 
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        View My Digital Profile
                      </a>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleCopy} className="w-full bg-[#00b4d8] hover:bg-[#00f5d4] text-black">
            {copied ? (
              <><Check className="mr-2 h-4 w-4" /> Copied to Clipboard!</>
            ) : (
              <><Copy className="mr-2 h-4 w-4" /> Copy HTML Signature</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
