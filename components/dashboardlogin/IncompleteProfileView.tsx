"use client";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProfileForm from "./profile-form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
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
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { User } from "./types"; // Import the User type from types.ts

interface IncompleteProfileViewProps {
  onProfileComplete: (data: User) => void;
}

// Define FormData type to match all the fields we're using
type FormData = {
  firstName: string;
  lastName: string;
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

export default function IncompleteProfileView({
  onProfileComplete,
}: IncompleteProfileViewProps) {
  const [progress, setProgress] = useState(0);
  const [activeTab, setActiveTab] = useState("personal");
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
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
  });

  useEffect(() => {
    const mandatoryFields = [
      "firstName",
      "lastName",
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

  // Add handleSubmit function
  const handleSubmit = () => {
    if (!isMandatoryFieldsFilled()) {
      return; // Don't submit if mandatory fields aren't filled
    }

    // Construct the full name from firstName and lastName
    const fullName = `${formData.firstName} ${formData.lastName}`.trim();

    // Construct the complete user data
    const completeUserData: User = {
      ...formData,
      name: fullName,
      isPremium: false,
    };

    // Call the onProfileComplete callback with the user data
    onProfileComplete(completeUserData);
  };

  // Helper function to check if all mandatory fields are filled
  const isMandatoryFieldsFilled = () => {
    const mandatoryFields = [
      "firstName",
      "lastName",
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

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="personal">Personal</TabsTrigger>
            <TabsTrigger value="organization">Organization</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="work-address">Work Address</TabsTrigger>
            <TabsTrigger value="home-address">Home Address</TabsTrigger>
            <TabsTrigger value="social">Social</TabsTrigger>
            <TabsTrigger value="additional">Additional</TabsTrigger>
          </TabsList>

          {/* personal tab */}
          <TabsContent value="personal" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="firstName">First Name</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder="Doe"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload("photo")}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab("organization")}
                variant="outline"
              >
                Next
              </Button>
            </div>
          </TabsContent>
          {/* Organization tab */}
          <TabsContent value="organization" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="company">Company</Label>
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="CEO"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workEmail">Work Email</Label>
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
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button onClick={() => setActiveTab("contact")} variant="outline">
                Previous
              </Button>
              <Button
                onClick={() => setActiveTab("contact")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            </div>
          </TabsContent>
          {/* Contact tab */}
          <TabsContent value="contact" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="mobile">Mobile</Label>
                <Input
                  id="mobile"
                  value={formData.mobile}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, mobile: e.target.value }))
                  }
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workPhone">Work Phone</Label>
                <Input
                  id="workPhone"
                  value={formData.workPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      workPhone: e.target.value,
                    }))
                  }
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fax">Fax</Label>
                <Input
                  id="fax"
                  value={formData.fax}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, fax: e.target.value }))
                  }
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homePhone">Home Phone</Label>
                <Input
                  id="homePhone"
                  value={formData.homePhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homePhone: e.target.value,
                    }))
                  }
                  placeholder="1234567890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="personalEmail">Personal Email</Label>
                <Input
                  id="personalEmail"
                  value={formData.personalEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      personalEmail: e.target.value,
                    }))
                  }
                  placeholder="john.doe@example.com"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab("organization")}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setActiveTab("work-address")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            </div>
          </TabsContent>
          {/* Work Address Tab */}

          <TabsContent value="work-address" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="homeStreet">Street Address</Label>
                <Input
                  id="homeStreet"
                  value={formData.homeStreet}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeStreet: e.target.value,
                    }))
                  }
                  placeholder="123 Home Street"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeDistrict">District</Label>
                <Input
                  id="homeDistrict"
                  value={formData.homeDistrict}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeDistrict: e.target.value,
                    }))
                  }
                  placeholder="Residential Area"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeCity">City</Label>
                <Input
                  id="homeCity"
                  value={formData.homeCity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeCity: e.target.value,
                    }))
                  }
                  placeholder="San Francisco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeState">State</Label>
                <Input
                  id="homeState"
                  value={formData.homeState}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeState: e.target.value,
                    }))
                  }
                  placeholder="California"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeZipcode">Zipcode</Label>
                <Input
                  id="homeZipcode"
                  value={formData.homeZipcode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeZipcode: e.target.value,
                    }))
                  }
                  placeholder="94105"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="homeCountry">Country</Label>
                <Input
                  id="homeCountry"
                  value={formData.homeCountry}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeCountry: e.target.value,
                    }))
                  }
                  placeholder="United States"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab("work-address")}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setActiveTab("social")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            </div>
          </TabsContent>
          {/* Home Address Tab */}
          <TabsContent value="home-address" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="homeStreet">Street Address</Label>
                <Input
                  id="homeStreet"
                  value={formData.homeStreet}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeStreet: e.target.value,
                    }))
                  }
                  placeholder="123 Home Street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="homeDistrict">District</Label>
                <Input
                  id="homeDistrict"
                  value={formData.homeDistrict}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeDistrict: e.target.value,
                    }))
                  }
                  placeholder="Residential Area"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeCity">City</Label>
                <Input
                  id="homeCity"
                  value={formData.homeCity}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeCity: e.target.value,
                    }))
                  }
                  placeholder="San Francisco"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeState">State</Label>
                <Input
                  id="homeState"
                  value={formData.homeState}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      homeState: e.target.value,
                    }))
                  }
                  placeholder="California"
                />
              </div>
              <div className="space-y-2"></div>
              <Label htmlFor="homeZipcode">Zipcode</Label>
              <Input
                id="homeZipcode"
                value={formData.homeZipcode}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    homeZipcode: e.target.value,
                  }))
                }
                placeholder="94105"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="homeCountry">Country</Label>
              <Input
                id="homeCountry"
                value={formData.homeCountry}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    homeCountry: e.target.value,
                  }))
                }
                placeholder="United States"
              />
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab("home-address")}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setActiveTab("social")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next
              </Button>
            </div>
          </TabsContent>

          {/* Social/Online Presence Tab */}
          <TabsContent value="social" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      website: e.target.value,
                    }))
                  }
                  placeholder="https://www.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  type="url"
                  value={formData.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      linkedin: e.target.value,
                    }))
                  }
                  placeholder="https://www.linkedin.com/in/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter/X Profile</Label>
                <Input
                  id="twitter"
                  type="url"
                  value={formData.twitter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      twitter: e.target.value,
                    }))
                  }
                  placeholder="https://twitter.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook Profile</Label>
                <Input
                  id="facebook"
                  type="url"
                  value={formData.facebook}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      facebook: e.target.value,
                    }))
                  }
                  placeholder="https://facebook.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram Profile</Label>
                <Input
                  id="instagram"
                  type="url"
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instagram: e.target.value,
                    }))
                  }
                  placeholder="https://instagram.com/username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="youtube">YouTube Channel</Label>
                <Input
                  id="youtube"
                  type="url"
                  value={formData.youtube}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      youtube: e.target.value,
                    }))
                  }
                  placeholder="https://youtube.com/c/channelname"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                onClick={() => setActiveTab("home-address")}
                variant="outline"
              >
                Previous
              </Button>
              <Button
                onClick={() => setActiveTab("additional")}
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
              <Button onClick={() => setActiveTab("social")} variant="outline">
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
        </Tabs>
      </div>

      {/* Benefits and FAQ section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
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

        <div className="bg-white p-6 rounded-lg shadow-sm">
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
