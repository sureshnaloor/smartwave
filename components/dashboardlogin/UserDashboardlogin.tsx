"use client"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"

import Footer from "@/components/Footer"
import CompletedProfileView from "./CompletedProfileView"
import IncompleteProfileView from "./IncompleteProfileView"


import { User } from "./types"
import { getProfile } from "@/app/_actions/profile"
import { toast } from "sonner"

export default function UserDashboardlogin() {
  const { data: session, status } = useSession()
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditingChild, setIsEditingChild] = useState(false)
  const [user, setUser] = useState<User>({
    firstName: "",
    lastName: "",
    
    middleName: "",
    photo: "",
    birthday: "",
    title: "",
    company: "",
    companyLogo: "",
    workEmail: "",
    personalEmail: "",
    mobile: "",
    workPhone: "",
    fax: "",
    homePhone: "",
    workStreet: "",
    workDistrict: "",
    workCity: "",
    workState: "",
    workZipcode: "",
    workCountry: "",
    homeStreet: "",
    homeDistrict: "",
    homeCity: "",
    homeState: "",
    homeZipcode: "",
    homeCountry: "",
    website: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    youtube: "",
    notes: "",
    isPremium: false,
    name: "",
    workAddress: "",
  })

  useEffect(() => {
  
    const fetchUserData = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          setIsLoading(true);
          const profileData = await getProfile(session.user.email);
          // console.log('Profile data fetched:', profileData);
          
          if (profileData) {
            // Map ProfileData to User type
            setUser({
              ...user,
              firstName: profileData.firstName || "",
              lastName: profileData.lastName || "",
              
              middleName: profileData.middleName || "",
              photo: profileData.photo || "",
              birthday: profileData.birthday || "",
              title: profileData.title || "",
              company: profileData.company || "",
              companyLogo: profileData.companyLogo || "",
              workEmail: profileData.workEmail || "",
              personalEmail: profileData.personalEmail || "",
              mobile: profileData.mobile || "",
              workPhone: profileData.workPhone || "",
              fax: profileData.fax || "",
              homePhone: profileData.homePhone || "",
              workStreet: profileData.workStreet || "",
              workDistrict: profileData.workDistrict || "",
              workCity: profileData.workCity || "",
              workState: profileData.workState || "",
              workZipcode: profileData.workZipcode || "",
              workCountry: profileData.workCountry || "",
              homeStreet: profileData.homeStreet || "",
              homeDistrict: profileData.homeDistrict || "",
              homeCity: profileData.homeCity || "",
              homeState: profileData.homeState || "",
              homeZipcode: profileData.homeZipcode || "",
              homeCountry: profileData.homeCountry || "",
              website: profileData.website || "",
              linkedin: profileData.linkedin || "",
              twitter: profileData.twitter || "",
              facebook: profileData.facebook || "",
              instagram: profileData.instagram || "",
              youtube: profileData.youtube || "",
              notes: profileData.notes || "",
              isPremium: profileData.isPremium || false,
              name: profileData.firstName + " " + profileData.lastName || "",
            });
            setIsProfileComplete(true);
          } else {
            setIsProfileComplete(false);
            // console.log('No profile data found for user');
          }
        } catch (error) {
          // console.error('Error fetching profile:', error);
          toast.error('Failed to load profile data');
          setIsProfileComplete(false);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchUserData();
  }, [session, status]);

  const handleProfileComplete = (profileData: User) => {
    setUser(profileData)
    setIsProfileComplete(true)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we load your profile</p>
        </div>
      </div>
    );
  }

  if (status !== 'authenticated' || !session?.user?.email) {
    // console.error('Not authenticated in UserDashboard:', { status, email: session?.user?.email });
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please log in to continue</h2>
          <p className="text-gray-600">You need to be logged in to access your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto py-8 px-4">
          {isProfileComplete ? (
            <CompletedProfileView userEmail={session.user.email} onEditModeChange={setIsEditingChild} />
          ) : (
            <IncompleteProfileView 
              onProfileComplete={(data: any) => {
                // Convert ProfileData to User type
                const userData: User = {
                  ...data,
                  _id: data._id?.toString() // Convert ObjectId to string
                };
                handleProfileComplete(userData);
              }}
              userEmail={session.user.email}
            />
          )}
        </main>
      </div>
      {/* Hide Footer completely while editing */}
      {!(isEditingChild || !isProfileComplete) && <Footer />}
    </>
  )
}



