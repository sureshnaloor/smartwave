"use client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

import { Textarea } from "@/components/ui/textarea";

import {
  User as UserIcon,
  Upload,
  Building2,
  Phone,
  MapPin,
  Home,
  Globe,
  FileText,
  Calendar as CalendarIcon,
  Mail,
  Briefcase,
  Building,
  Hash,
  MapPinned,
  Flag,
  AtSign,
  Link,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  Youtube,
  FileText as NotesIcon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "./types"; // Import the User type from types.ts
import { saveProfile } from '@/app/actions/profile';

interface IncompleteProfileViewProps {
  onProfileComplete: (data: User) => void;
  userEmail: string;
  initialData?: User;
  isEditing?: boolean;
}

// Define FormData type to match all the fields we're using
type FormData = {
  firstName: string;
  familyName: string;
  middleName: string;
  photo: string;
  birthday: string;
  title: string;
  company: string;
  companyLogo: string;
  workEmail: string;
  personalEmail: string;
  mobile: string;
  workPhone: string;
  fax: string;
  homePhone: string;
  workStreet: string;
  workDistrict: string;
  workCity: string;
  workState: string;
  workZipcode: string;
  workCountry: string;
  homeStreet: string;
  homeDistrict: string;
  homeCity: string;
  homeState: string;
  homeZipcode: string;
  homeCountry: string;
  website: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

// Add this constant for icon color
const iconColor = "rgb(14, 165, 233)" // deep sky blue color

// Add this constant for tab labels
const TAB_LABELS = {
  personal: "Personal",
  organization: "Organization",
  contact: "Contact",
  "work-address": "Work Address",
  "home-address": "Home Address",
  social: "Social",
  additional: "Additional"
} as const;

export default function IncompleteProfileView({
  onProfileComplete,
  userEmail,
  initialData,
  isEditing = false,
}: IncompleteProfileViewProps) {
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<FormData>(() => {
    if (initialData) {
      return {
        firstName: initialData.firstName || "",
        familyName: initialData.lastName || "",
        middleName: initialData.middleName || "",
        photo: initialData.photo || "",
        birthday: initialData.birthday || "",
        title: initialData.title || "",
        company: initialData.company || "",
        companyLogo: initialData.companyLogo || "",
        workEmail: initialData.workEmail || "",
        personalEmail: initialData.personalEmail || "",
        mobile: initialData.mobile || "",
        workPhone: initialData.workPhone || "",
        fax: initialData.fax || "",
        homePhone: initialData.homePhone || "",
        workStreet: initialData.workStreet || "",
        workDistrict: initialData.workDistrict || "",
        workCity: initialData.workCity || "",
        workState: initialData.workState || "",
        workZipcode: initialData.workZipcode || "",
        workCountry: initialData.workCountry || "",
        homeStreet: initialData.homeStreet || "",
        homeDistrict: initialData.homeDistrict || "",
        homeCity: initialData.homeCity || "",
        homeState: initialData.homeState || "",
        homeZipcode: initialData.homeZipcode || "",
        homeCountry: initialData.homeCountry || "",
        website: initialData.website || "",
        linkedin: initialData.linkedin || "",
        twitter: initialData.twitter || "",
        facebook: initialData.facebook || "",
        instagram: initialData.instagram || "",
        youtube: initialData.youtube || "",
        notes: initialData.notes || "",
        name: initialData.name || "",
        email: initialData.workEmail || "",
        phone: initialData.mobile || "",
        address: initialData.workAddress || ""
      };
    }
    return {
      firstName: "",
      familyName: "",
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
      name: "",
      email: "",
      phone: "",
      address: "",
    };
  });

  useEffect(() => {
    const mandatoryFields = [
      "firstName",
      "familyName",
      "middleName",
      "workEmail",
      "mobile",
      "title",
      "company",
      "workStreet",
      "workCity",
      "workState",
      "workCountry",
      "workZipcode",
    ];

    const optionalFields = [
      "personalEmail",
      "workPhone",
      "fax",
      "homePhone",
      "companyLogo",
      "photo",
      "homeStreet",
      "homeCity",
      "homeState",
      "homeCountry",
      "homeZipcode",
      "website",
      "linkedin",
      "twitter",
      "facebook",
      "instagram",
      "youtube",
      "notes",
      "birthday",
    ];

    let filledMandatory = mandatoryFields.filter(
      (field) => formData[field as keyof typeof formData]
    ).length;
    let filledOptional = optionalFields.filter(
      (field) => formData[field as keyof typeof formData]
    ).length;

    const mandatoryProgress = (filledMandatory / mandatoryFields.length) * 80;
    const optionalProgress = (filledOptional / optionalFields.length) * 20;

    setProgress(Math.round(mandatoryProgress + optionalProgress));
  }, [formData]);

  const handleSubmit = async () => {
    if (!userEmail) {
      console.error('No userEmail provided to component:', { userEmail });
      toast.error('User email is required. Please try logging in again.');
      return;
    }

    if (!isMandatoryFieldsFilled()) {
      toast.error('Please fill all mandatory fields');
      return;
    }

    // Construct the full name
    const fullName = [
      formData.firstName,
      formData.middleName,
      formData.familyName
    ].filter(Boolean).join(" ").trim();

    // Construct the work address
    const workAddress = [
      formData.workStreet,
      formData.workDistrict,
      formData.workCity, 
      formData.workState,
      formData.workZipcode,
      formData.workCountry
    ].filter(Boolean).join(", ");

    try {
      console.log('Submitting profile with userEmail:', userEmail);
      
      // Prepare the data for MongoDB
      const profileData = {
        ...formData,
        name: fullName,
        workAddress,
        userEmail, // Add the userEmail from props
        isPremium: initialData?.isPremium || false,
      };

      // Save to MongoDB
      const result = await saveProfile(profileData, userEmail);
      
      if (result.success) {
        toast.success('Profile saved successfully');
        // Call the onProfileComplete callback with the user data
        onProfileComplete(profileData as User);
      } else {
        console.error('Failed to save profile:', result.error);
        toast.error(result.error || 'Failed to save profile. Please try again.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('An unexpected error occurred. Please try again.');
    }
  };

  // Helper function to check if all mandatory fields are filled
  const isMandatoryFieldsFilled = () => {
    const mandatoryFields = [
      "firstName",
      "familyName",
      "workEmail",
      "mobile",
      "title",
      "company",
      "workStreet",
      "workCity",
      "workState",
      "workCountry",
      "workZipcode",
    ];

    return mandatoryFields.every(
      (field) =>
        formData[field as keyof typeof formData] &&
        formData[field as keyof typeof formData].trim() !== ""
    );
  };

  // Handle file upload
  const handleFileUpload =
    (field: "photo" | "companyLogo") =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData((prev) => ({
            ...prev,
            [field]: reader.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

  // Add this function to handle tab navigation
  const navigateTab = (direction: 'next' | 'previous') => {
    const tabOrder = ['personal', 'organization', 'contact', 'work-address', 'home-address', 'social', 'additional'];
    const currentIndex = tabOrder.indexOf(activeTab);
    
    if (direction === 'next' && currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    } else if (direction === 'previous' && currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-blue-600 mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mb-4">
          Fill in your information to create your digital card. Fields marked
          with * are required.
        </p>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Profile Completion</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Desktop view tabs */}
            <TabsList className="hidden md:grid w-full grid-cols-7 h-14 bg-gray-50/90">
              {Object.entries(TAB_LABELS).map(([value, label]) => (
                <TabsTrigger
                  key={value}
                  value={value}
                  className="data-[state=active]:bg-white data-[state=active]:text-red-600 text-sm font-semibold"
                >
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Mobile view current tab indicator */}
            <div className="md:hidden flex items-center justify-between bg-gray-50/90 px-4 py-2 rounded-t-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Step {Object.keys(TAB_LABELS).indexOf(activeTab) + 1} of {Object.keys(TAB_LABELS).length}</span>
                <span className="font-semibold text-red-600">{TAB_LABELS[activeTab as keyof typeof TAB_LABELS]}</span>
              </div>
              <div className="text-xs text-gray-400">
                {progress}% Complete
              </div>
            </div>

            {/* Add a consistent height wrapper for all TabsContent */}
            <div className="min-h-[400px]"> {/* Adjust height as needed */}
              {/* personal tab */}
              <TabsContent value="personal" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="firstName" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      First Name *
                    </Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }))
                        }
                        placeholder="John"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <UserIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="familyName" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Family Name *
                    </Label>
                    <div className="relative">
                      <Input
                        id="familyName"
                        value={formData.familyName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            familyName: e.target.value,
                          }))
                        }
                        placeholder="Doe"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <UserIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="middleName" className="flex items-center gap-2">
                      <UserIcon className="h-4 w-4" />
                      Middle Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            middleName: e.target.value,
                          }))
                        }
                        placeholder="Middle Name"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <UserIcon className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  

                  <div className="space-y-2">
                    <Label htmlFor="photo" className="flex items-center gap-2">
                      <Upload className="h-4 w-4" />
                      Photo
                    </Label>
                    <div className="relative">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload("photo")}
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Upload className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div /> {/* Empty div for spacing */}
                  <Button
                    onClick={() => navigateTab('next')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              {/* Organization tab */}
              <TabsContent value="organization" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Company *
                    </Label>
                    <div className="relative">
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="SmartWave"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Building2 className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Title *
                    </Label>
                    <div className="relative">
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="CEO"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Briefcase className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Work Email *
                    </Label>
                    <div className="relative">
                      <Input
                        id="workEmail"
                        value={formData.workEmail}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            workEmail: e.target.value,
                          }))
                        }
                        placeholder="john.doe@smartwave.com"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Mail className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => navigateTab('previous')}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => navigateTab('next')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              {/* Contact tab */}
              <TabsContent value="contact" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" style={{ color: iconColor }} />
                      Mobile *
                    </Label>
                    <div className="relative">
                      <Input
                        id="mobile"
                        value={formData.mobile}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                        }
                        placeholder="1234567890"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Phone className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workPhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" style={{ color: iconColor }} />
                      Work Phone
                    </Label>
                    <div className="relative">
                      <Input
                        id="workPhone"
                        value={formData.workPhone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workPhone: e.target.value }))
                        }
                        placeholder="1234567890"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Phone className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fax" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" style={{ color: iconColor }} />
                      Fax
                    </Label>
                    <div className="relative">
                      <Input
                        id="fax"
                        value={formData.fax}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, fax: e.target.value }))
                        }
                        placeholder="1234567890"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Phone className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homePhone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" style={{ color: iconColor }} />
                      Home Phone
                    </Label>
                    <div className="relative">
                      <Input
                        id="homePhone"
                        value={formData.homePhone}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, homePhone: e.target.value }))
                        }
                        placeholder="1234567890"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Phone className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personalEmail" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" style={{ color: iconColor }} />
                      Personal Email
                    </Label>
                    <div className="relative">
                      <Input
                        id="personalEmail"
                        value={formData.personalEmail}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, personalEmail: e.target.value }))
                        }
                        placeholder="personal@example.com"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Mail className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => navigateTab('previous')}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => navigateTab('next')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              {/* Work Address Tab */}

              <TabsContent value="work-address" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="workStreet" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      Street Address *
                    </Label>
                    <div className="relative">
                      <Input
                        id="workStreet"
                        value={formData.workStreet}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workStreet: e.target.value }))
                        }
                        placeholder="123 Work Street"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workDistrict" className="flex items-center gap-2">
                      <MapPinned className="h-4 w-4" style={{ color: iconColor }} />
                      District
                    </Label>
                    <div className="relative">
                      <Input
                        id="workDistrict"
                        value={formData.workDistrict}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workDistrict: e.target.value }))
                        }
                        placeholder="Business District"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPinned className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workCity" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      City *
                    </Label>
                    <div className="relative">
                      <Input
                        id="workCity"
                        value={formData.workCity}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workCity: e.target.value }))
                        }
                        placeholder="San Francisco"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workState" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      State *
                    </Label>
                    <div className="relative">
                      <Input
                        id="workState"
                        value={formData.workState}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workState: e.target.value }))
                        }
                        placeholder="California"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workZipcode" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      Zipcode *
                    </Label>
                    <div className="relative">
                      <Input
                        id="workZipcode"
                        value={formData.workZipcode}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workZipcode: e.target.value }))
                        }
                        placeholder="94105"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workCountry" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      Country *
                    </Label>
                    <div className="relative">
                      <Input
                        id="workCountry"
                        value={formData.workCountry}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, workCountry: e.target.value }))
                        }
                        placeholder="United States"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => navigateTab('previous')}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => navigateTab('next')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>
              {/* Home Address Tab */}
              <TabsContent value="home-address" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="homeStreet" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      Street Address *
                    </Label>
                    <div className="relative">
                      <Input
                        id="homeStreet"
                        value={formData.homeStreet}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, homeStreet: e.target.value }))
                        }
                        placeholder="123 Home Street"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="homeDistrict" className="flex items-center gap-2">
                      <MapPinned className="h-4 w-4" style={{ color: iconColor }} />
                      District *
                    </Label>
                    <div className="relative">
                      <Input
                        id="homeDistrict"
                        value={formData.homeDistrict}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, homeDistrict: e.target.value }))
                        }
                        placeholder="Residential Area"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPinned className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeCity" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      City *
                    </Label>
                    <div className="relative">
                      <Input
                        id="homeCity"
                        value={formData.homeCity}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, homeCity: e.target.value }))
                        }
                        placeholder="San Francisco"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeState" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      State *
                    </Label>
                    <div className="relative">
                      <Input
                        id="homeState"
                        value={formData.homeState}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, homeState: e.target.value }))
                        }
                        placeholder="California"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeZipcode" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      Zipcode *
                    </Label>
                    <div className="relative">
                      <Input
                        id="homeZipcode"
                        value={formData.homeZipcode}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, homeZipcode: e.target.value }))
                        }
                        placeholder="94105"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="homeCountry" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" style={{ color: iconColor }} />
                      Country *
                    </Label>
                    <div className="relative">
                      <Input
                        id="homeCountry"
                        value={formData.homeCountry}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, homeCountry: e.target.value }))
                        }
                        placeholder="United States"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <MapPin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => navigateTab('previous')}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => navigateTab('next')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Social/Online Presence Tab */}
              <TabsContent value="social" className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-2">
                      <Globe className="h-4 w-4" style={{ color: iconColor }} />
                      Website
                    </Label>
                    <div className="relative">
                      <Input
                        id="website"
                        type="url"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, website: e.target.value }))
                        }
                        placeholder="www.example.com"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Globe className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4" style={{ color: iconColor }} />
                      LinkedIn
                    </Label>
                    <div className="relative">
                      <Input
                        id="linkedin"
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, linkedin: e.target.value }))
                        }
                        placeholder="LinkedIn Profile"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Linkedin className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter" className="flex items-center gap-2">
                      <Twitter className="h-4 w-4" style={{ color: iconColor }} />
                      Twitter/X
                    </Label>
                    <div className="relative">
                      <Input
                        id="twitter"
                        type="url"
                        value={formData.twitter}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, twitter: e.target.value }))
                        }
                        placeholder="Twitter Profile"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Twitter className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook" className="flex items-center gap-2">
                      <Facebook className="h-4 w-4" style={{ color: iconColor }} />
                      Facebook
                    </Label>
                    <div className="relative">
                      <Input
                        id="facebook"
                        type="url"
                        value={formData.facebook}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, facebook: e.target.value }))
                        }
                        placeholder="Facebook Profile"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Facebook className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram" className="flex items-center gap-2">
                      <Instagram className="h-4 w-4" style={{ color: iconColor }} />
                      Instagram
                    </Label>
                    <div className="relative">
                      <Input
                        id="instagram"
                        type="url"
                        value={formData.instagram}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, instagram: e.target.value }))
                        }
                        placeholder="Instagram Profile"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Instagram className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtube" className="flex items-center gap-2">
                      <Youtube className="h-4 w-4" style={{ color: iconColor }} />
                      YouTube
                    </Label>
                    <div className="relative">
                      <Input
                        id="youtube"
                        type="url"
                        value={formData.youtube}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, youtube: e.target.value }))
                        }
                        placeholder="YouTube Channel"
                        className="pl-10 border-2 focus:border-blue-500"
                      />
                      <Youtube className="h-4 w-4 absolute left-3 top-3" style={{ color: iconColor }} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => navigateTab('previous')}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => navigateTab('next')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                  </Button>
                </div>
              </TabsContent>

              {/* Additional Info Tab */}
              <TabsContent value="additional" className="mt-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    <div className="flex gap-2">
                      <Input
                        id="birthday"
                        type="date"
                        value={formData.birthday}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            birthday: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, notes: e.target.value }))
                      }
                      placeholder="Add any additional information you'd like to share..."
                      className="h-32"
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    onClick={() => navigateTab('previous')}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!isMandatoryFieldsFilled()}
                  >
                    Complete Profile
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Benefits and FAQ section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Benefits of SmartWave
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">
                Eco-friendly alternative to paper business cards
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">
                Always up-to-date information
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">
                Easy to share via QR code or direct link
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">
                Rich digital profile with more than just contact info
              </span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">
                Premium features like calendar integration and payment options
              </span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">
                How does SmartWave work?
              </AccordionTrigger>
              <AccordionContent>
                SmartWave creates a digital business card that can be shared via
                QR code or direct link. Recipients can save your contact
                information directly to their phone or view your complete
                digital profile.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">
                Is my information secure?
              </AccordionTrigger>
              <AccordionContent>
                Yes, your information is secure. You control what information is
                visible on your digital card and who can access it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">
                Can I update my information later?
              </AccordionTrigger>
              <AccordionContent>
                You can update your information at any time, and all your shared
                cards will automatically reflect the changes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">
                What are the premium features?
              </AccordionTrigger>
              <AccordionContent>
                Premium features include calendar integration for scheduling
                meetings, payment options to receive money directly, and
                advanced analytics to track who viewed your card.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
