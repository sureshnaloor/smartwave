"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, } from "lucide-react"
import DigitalCard from "./digital-card"
import QRCodeGenerator from "./qr-code-generator"
import CalendarIntegration from "./calendar-integration"
import PaymentOptions from "./payment-options"
import { getProfile, ProfileData } from '@/app/_actions/profile';
import IncompleteProfileView from './IncompleteProfileView';
import VCardEditor from "./vcard-editor"
import DigitalProfile from "./digital-profile"

// Add this import at the top with other imports
import { toast } from "sonner"

interface CompletedProfileViewProps {
  userEmail?: string;
  onEditModeChange?: (isEditing: boolean) => void;
}

export default function CompletedProfileView({ userEmail: propUserEmail, onEditModeChange }: CompletedProfileViewProps) {
  const { data: session } = useSession();
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use email from props or session
  const userEmail = propUserEmail || session?.user?.email;

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!userEmail) {
        setError('Please sign in to view your profile');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const profile = await getProfile(userEmail);
        
        if (!isMounted) return;

        if (!profile) {
          setProfileData(null);
        } else {
          setProfileData(profile);
        }
      } catch (error) {
        if (!isMounted) return;
        setError('Failed to load profile. Please try again.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const handleProfileUpdate = async (updatedData: ProfileData) => {
    try {
      if (!userEmail) return;
      setProfileData(updatedData);
      setIsEditing(false);
      // Avoid full page refresh; rely on local state updates
    } catch (error) {
      // console.error('Error updating profile:', error);
    }
  };

  useEffect(() => {
    onEditModeChange?.(isEditing);
  }, [isEditing, onEditModeChange]);

  const renderProfileContent = () => {
    if (!profileData) return null;
    return (
      <>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-2">
          <div>
            <h2 className="text-[14px] md:text-[18px] font-bold text-sky-800">Welcome back, {profileData.name}!</h2>
            <p className="text-sm md:text-base text-gray-600">Manage your digital business card and profile</p>
          </div>
        </div>
        <Tabs defaultValue="digital-card" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger className="text-xs md:text-sm px-1 md:px-3 py-1.5" value="digital-card">Digital Card</TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm px-1 md:px-3 py-1.5" value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm px-1 md:px-3 py-1.5" value="vcard">vCard</TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm px-1 md:px-3 py-1.5" value="digital-profile">Digital Profile</TabsTrigger>
            <TabsTrigger className="text-xs md:text-sm px-1 md:px-3 py-1.5" value="premium" disabled={profileData?.isPremium === false}>
              Premium
            </TabsTrigger>
          </TabsList>

          <TabsContent value="digital-card" className="mt-4 md:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-teal-600">Your Digital Card</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  This is how your digital business card looks. You can share it with anyone using the QR code or download
                  options.
                </p>
                <DigitalCard user={profileData} />
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-red-500">Share Your Card</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">Share your digital card via email, text message, or social media.</p>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  <Button className="text-xs md:text-sm bg-blue-600 hover:bg-blue-700">Email</Button>
                  <Button className="text-xs md:text-sm bg-green-600 hover:bg-green-700">WhatsApp</Button>
                  <Button className="text-xs md:text-sm bg-blue-400 hover:bg-blue-500">Twitter</Button>
                  <Button className="text-xs md:text-sm bg-blue-800 hover:bg-blue-900">LinkedIn</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr-code" className="mt-4 md:mt-6">
            <div>
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-teal-600">Your QR Code</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  This QR code links directly to your digital profile. When scanned, it will open your complete SmartWave
                  profile.
                </p>
                <QRCodeGenerator user={profileData} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vcard" className="mt-4 md:mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div>
                <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-teal-600">Your vCard</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Download your contact information as a vCard file (.vcf) that can be imported into any contact app.
                </p>
                <VCardEditor user={profileData} onUpdate={handleProfileUpdate} />
              </div>
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-red-500">Download vCard</h3>
                <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                  Download your vCard to easily share your contact information with others.
                </p>
               {/* Inside the vCard download button onClick handler, update the vCard generation: */}
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-xs md:text-sm"
                  onClick={async () => {
                    try {
                      // Convert image URLs to base64
                      let photoBase64 = '';
                      let logoBase64 = '';
                  
                      if (profileData.photo) {
                        const photoResponse = await fetch(profileData.photo);
                        const photoBlob = await photoResponse.blob();
                        photoBase64 = await new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result as string);
                          reader.readAsDataURL(photoBlob);
                        });
                      }
                  
                      if (profileData.companyLogo) {
                        const logoResponse = await fetch(profileData.companyLogo);
                        const logoBlob = await logoResponse.blob();
                        logoBase64 = await new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => resolve(reader.result as string);
                          reader.readAsDataURL(logoBlob);
                        });
                      }
                  
                      // Generate vCard data with photo and logo
                      const vCardData = [
                        'BEGIN:VCARD',
                        'VERSION:3.0',
                        `FN:${profileData.name}`,
                        `N:${profileData.lastName || ''};${profileData.firstName || ''};${profileData.middleName || ''};;`,
                        `TITLE:${profileData.title || ''}`,
                        `ORG:${profileData.company || ''}`,
                        `EMAIL;type=WORK:${profileData.workEmail || ''}`,
                        `TEL;type=WORK:${profileData.workPhone || ''}`,
                        `TEL;type=CELL:${profileData.mobile || ''}`,
                        `ADR;type=WORK:;;${profileData.workStreet || ''};${profileData.workCity || ''};${profileData.workState || ''};${profileData.workZipcode || ''};${profileData.workCountry || ''}`,
                        profileData.website ? `URL:${profileData.website}` : '',
                        photoBase64 ? `PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64.split(',')[1]}` : '',
                        logoBase64 ? `LOGO;ENCODING=b;TYPE=JPEG:${logoBase64.split(',')[1]}` : '',
                        'END:VCARD'
                      ].filter(Boolean).join('\n');
                      const blob = new Blob([vCardData], { type: 'text/vcard' });
                      const url = window.URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${profileData.name.replace(/\s+/g, '-')}.vcf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(url);
                    } catch (error) {
                      // console.error('Error generating vCard:', error);
                      toast.error("Failed to generate vCard with images. Please try again.");
                    }
                  }}
                >
                  <Download className="mr-2 h-3 w-3 md:h-4 md:w-4" />
                  Download vCard (.vcf)
                </Button>
                <div className="mt-6 md:mt-8">
                  <h4 className="font-semibold text-base md:text-lg mb-2">How to use your vCard</h4>
                  <ol className="list-decimal list-inside space-y-1 md:space-y-2 text-sm md:text-base text-gray-700">
                    <li>Download the vCard file</li>
                    <li>Open your contacts app on your phone or computer</li>
                    <li>Import the vCard file</li>
                    <li>Your contact information will be added to the contacts app</li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="digital-profile" className="mt-4 md:mt-6">
            <DigitalProfile user={profileData} onUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="premium" className="mt-4 md:mt-6">
            {profileData.isPremium ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div>
                  <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-blue-600">Calendar Integration</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                    Manage your availability and let others schedule meetings with you.
                  </p>
                  <CalendarIntegration user={profileData} />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-red-500">Payment Options</h3>
                  <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                    Configure your payment methods to receive payments directly through your digital card.
                  </p>
                  <PaymentOptions user={profileData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <h3 className="text-lg md:text-2xl font-semibold mb-2 md:mb-4 text-blue-600">Upgrade to Premium</h3>
                <p className="text-sm md:text-base text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
                  Unlock premium features like calendar integration and payment options to make your digital card even
                  more powerful.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-6 md:px-8 py-2 md:py-3 text-sm md:text-lg">
                  Upgrade Now
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </>
    );
  };

  if (!userEmail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please sign in to view your profile</p>
          <Button 
            onClick={() => window.location.href = '/auth/signin'}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // If no profile exists or we're in editing mode, show IncompleteProfileView
  if (!profileData || isEditing) {
    return (
      <IncompleteProfileView
        onProfileComplete={(data) => {
          setProfileData(data as unknown as ProfileData);
          setIsEditing(false);
        }}
        userEmail={userEmail}
        initialData={isEditing && profileData ? profileData : undefined}
        isEditing={isEditing}
      />
    );
  }

  return (
    <div className="space-y-8">
      {renderProfileContent()}
    </div>
  );
}
