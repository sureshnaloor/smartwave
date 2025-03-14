"use client"

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, User, ChevronRight, Mail, Phone } from "lucide-react"
import DigitalCard from "./digital-card"
import QRCodeGenerator from "./qr-code-generator"
import CalendarIntegration from "./calendar-integration"
import PaymentOptions from "./payment-options"
import { User as UserType } from '@/app/types';
import { getProfile, ProfileData } from '@/app/actions/profile';
import IncompleteProfileView from './IncompleteProfileView';

interface CompletedProfileViewProps {
  userEmail?: string;
}

export default function CompletedProfileView({ userEmail: propUserEmail }: CompletedProfileViewProps) {
  const { data: session } = useSession();
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
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const renderProfileContent = () => {
    if (!profileData) return null;
    return (
      <>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-blue-600">Welcome back, {profileData.name}!</h2>
            <p className="text-gray-600">Manage your digital business card and profile</p>
          </div>
          <Button 
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Edit Profile
          </Button>
        </div>
        <Tabs defaultValue="digital-card" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="digital-card">Digital Card</TabsTrigger>
            <TabsTrigger value="qr-code">QR Code</TabsTrigger>
            <TabsTrigger value="vcard">vCard</TabsTrigger>
            <TabsTrigger value="digital-profile">Digital Profile</TabsTrigger>
            <TabsTrigger value="premium" disabled={profileData?.isPremium === false}>
              Premium
            </TabsTrigger>
          </TabsList>

          <TabsContent value="digital-card" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">Your Digital Card</h3>
                <p className="text-gray-600 mb-6">
                  This is how your digital business card looks. You can share it with anyone using the QR code or download
                  options.
                </p>
                <DigitalCard user={profileData} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-4 text-red-500">Share Your Card</h3>
                <p className="text-gray-600 mb-6">Share your digital card via email, text message, or social media.</p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-blue-600 hover:bg-blue-700">Email</Button>
                  <Button className="bg-green-600 hover:bg-green-700">WhatsApp</Button>
                  <Button className="bg-blue-400 hover:bg-blue-500">Twitter</Button>
                  <Button className="bg-blue-800 hover:bg-blue-900">LinkedIn</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="qr-code" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">Your QR Code</h3>
                <p className="text-gray-600 mb-6">
                  This QR code links directly to your digital profile. When scanned, it will open your complete SmartWave
                  profile.
                </p>
                <QRCodeGenerator user={profileData} />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-4 text-red-500">Download Options</h3>
                <p className="text-gray-600 mb-6">Download your QR code in different formats and sizes.</p>
                <div className="space-y-4">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download PNG (High Resolution)
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download for Print (300 DPI)
                  </Button>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    <Download className="mr-2 h-4 w-4" />
                    Download for Web (72 DPI)
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vcard" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">Your vCard</h3>
                <p className="text-gray-600 mb-6">
                  Download your contact information as a vCard file (.vcf) that can be imported into any contact app.
                </p>
                <Card className="border-2 border-blue-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                        <p className="text-lg">{profileData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Name Components</h4>
                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Last:</span>
                            <p>{profileData.lastName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">First:</span>
                            <p>{profileData.firstName}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Middle:</span>
                            <p>{profileData.middleName}</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Title</h4>
                        <p className="text-lg">{profileData.title}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Company</h4>
                        <p className="text-lg">{profileData.company}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Work Contact</h4>
                        <div className="space-y-2">
                          <p className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            {profileData.workEmail}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            {profileData.workPhone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-gray-500" />
                            Mobile: {profileData.mobile}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Work Address</h4>
                        <p className="text-base">
                          {[
                            profileData.workStreet,
                            profileData.workCity,
                            profileData.workState,
                            profileData.workZipcode,
                            profileData.workCountry
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      {profileData.website && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Website</h4>
                          <p className="text-lg">{profileData.website}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-2xl font-semibold mb-4 text-red-500">Download vCard</h3>
                <p className="text-gray-600 mb-6">
                  Download your vCard to easily share your contact information with others.
                </p>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => {
                    // Generate vCard data
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
                      'END:VCARD'
                    ].filter(Boolean).join('\n');

                    // Create and trigger download
                    const blob = new Blob([vCardData], { type: 'text/vcard' });
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${profileData.name.replace(/\s+/g, '-')}.vcf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download vCard (.vcf)
                </Button>
                <div className="mt-8">
                  <h4 className="font-semibold text-lg mb-2">How to use your vCard</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Download the vCard file</li>
                    <li>Open your contacts app on your phone or computer</li>
                    <li>Import the vCard file</li>
                    <li>Your contact information will be added to the contacts app</li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="digital-profile" className="mt-6">
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center space-x-4 mb-6">
                  {profileData.photo ? (
                    <Image
                      src={profileData.photo || "/placeholder.svg"}
                      alt={profileData.name}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-semibold text-blue-600">{profileData.name}</h3>
                    <p className="text-lg text-gray-600">{profileData.title}</p>
                    <p className="text-red-500">{profileData.company}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-2">Contact Information</h4>
                      <div className="space-y-2">
                        <p className="flex items-center text-gray-700">
                          <span className="font-medium w-20">Email:</span> {profileData.workEmail}
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="font-medium w-20">Phone:</span> {profileData.mobile}
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="font-medium w-20">Website:</span> {profileData.website}
                        </p>
                        <p className="flex items-center text-gray-700">
                          <span className="font-medium w-20">Address:</span> {profileData.workAddress}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-2">About Me</h4>
                      <p className="text-gray-700">
                        Professional with expertise in the field. Passionate about delivering high-quality work and
                        building meaningful connections.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-2">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button className="w-full justify-between bg-blue-600 hover:bg-blue-700">
                          Download vCard <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button className="w-full justify-between bg-red-500 hover:bg-red-600">
                          Download QR Code <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button className="w-full justify-between bg-green-600 hover:bg-green-700">
                          Schedule Meeting <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-blue-600 mb-2">Social Media</h4>
                      <div className="flex space-x-2">
                        <Button variant="outline" className="border-blue-300 text-blue-600">
                          LinkedIn
                        </Button>
                        <Button variant="outline" className="border-blue-300 text-blue-600">
                          Twitter
                        </Button>
                        <Button variant="outline" className="border-blue-300 text-blue-600">
                          Instagram
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="premium" className="mt-6">
            {profileData.isPremium ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-blue-600">Calendar Integration</h3>
                  <p className="text-gray-600 mb-6">
                    Manage your availability and let others schedule meetings with you.
                  </p>
                  <CalendarIntegration user={profileData} />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-4 text-red-500">Payment Options</h3>
                  <p className="text-gray-600 mb-6">
                    Configure your payment methods to receive payments directly through your digital card.
                  </p>
                  <PaymentOptions user={profileData} />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">Upgrade to Premium</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Unlock premium features like calendar integration and payment options to make your digital card even
                  more powerful.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-red-600 text-white px-8 py-3 text-lg">
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
