"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import { Download, User, ChevronRight } from "lucide-react"

import ProfileForm from "../dashboardlogin/profile-form"
import DigitalCard from "../dashboardlogin/digital-card"
import QRCodeGenerator from "../dashboardlogin/qr-code-generator"
import CalendarIntegration from "../dashboardlogin/calendar-integration"
import PaymentOptions from "../dashboardlogin/payment-options"

interface User {
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  photo: string;
  isPremium: boolean;
}

export default function UserDashboardlogin() {
  const [isProfileComplete, setIsProfileComplete] = useState(false)
  const [user, setUser] = useState<User>({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    photo: "",
    isPremium: false,
  })

  // Simulate fetching user data
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchUserData = () => {
      // Simulating an API response
      const userData = localStorage.getItem("userData")
      if (userData) {
        const parsedData = JSON.parse(userData)
        setUser(parsedData)
        setIsProfileComplete(true)
      }
    }

    fetchUserData()
  }, [])

  const handleProfileComplete = (profileData: User) => {
    setUser(profileData)
    setIsProfileComplete(true)
    // In a real app, you would save this to your backend
    localStorage.setItem("userData", JSON.stringify(profileData))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-red-600 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">SmartWave</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:bg-white/20">
              <User className="mr-2 h-4 w-4" />
              {isProfileComplete ? user.name : "My Account"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {isProfileComplete ? (
          <CompletedProfileView user={user} />
        ) : (
          <IncompleteProfileView onProfileComplete={handleProfileComplete} />
        )}
      </main>

      <footer className="bg-blue-900 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 SmartWave. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function CompletedProfileView({ user }: { user: User }) {
  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-blue-600">Welcome back, {user.name}!</h2>

      <Tabs defaultValue="digital-card" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="digital-card">Digital Card</TabsTrigger>
          <TabsTrigger value="qr-code">QR Code</TabsTrigger>
          <TabsTrigger value="vcard">vCard</TabsTrigger>
          <TabsTrigger value="digital-profile">Digital Profile</TabsTrigger>
          <TabsTrigger value="premium" disabled={user?.isPremium === false}>
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
              <DigitalCard user={user} />
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
              <QRCodeGenerator user={user} />
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
                      <h4 className="text-sm font-medium text-gray-500">Name</h4>
                      <p className="text-lg">{user.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Title</h4>
                      <p className="text-lg">{user.title}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Company</h4>
                      <p className="text-lg">{user.company}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Email</h4>
                      <p className="text-lg">{user.email}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                      <p className="text-lg">{user.phone}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Website</h4>
                      <p className="text-lg">{user.website}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold mb-4 text-red-500">Download vCard</h3>
              <p className="text-gray-600 mb-6">
                Download your vCard to easily share your contact information with others.
              </p>
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
                {user.photo ? (
                  <Image
                    src={user.photo || "/placeholder.svg"}
                    alt={user.name}
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
                  <h3 className="text-2xl font-semibold text-blue-600">{user.name}</h3>
                  <p className="text-lg text-gray-600">{user.title}</p>
                  <p className="text-red-500">{user.company}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-600 mb-2">Contact Information</h4>
                    <div className="space-y-2">
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Email:</span> {user.email}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Phone:</span> {user.phone}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Website:</span> {user.website}
                      </p>
                      <p className="flex items-center text-gray-700">
                        <span className="font-medium w-20">Address:</span> {user.address}
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
          {user.isPremium ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">Calendar Integration</h3>
                <p className="text-gray-600 mb-6">
                  Manage your availability and let others schedule meetings with you.
                </p>
                <CalendarIntegration user={user} />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-red-500">Payment Options</h3>
                <p className="text-gray-600 mb-6">
                  Configure your payment methods to receive payments directly through your digital card.
                </p>
                <PaymentOptions user={user} />
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
    </div>
  )
}

function IncompleteProfileView({ onProfileComplete }: { onProfileComplete: (data: { 
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  photo: string;
  isPremium: boolean;
}) => void }) {
  const [progress, setProgress] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    company: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    photo: "",
  })

  // Calculate progress based on filled fields
  useEffect(() => {
    const requiredFields = ["name", "email", "phone"]
    const optionalFields = ["title", "company", "website", "address", "photo"]
    let filledRequired = 0
    requiredFields.forEach((field) => {
      if (formData[field as keyof typeof formData]) filledRequired++
    })
    let filledOptional = 0
    optionalFields.forEach((field) => {
      if (formData[field as keyof typeof formData]) filledOptional++
    })

    const requiredProgress = (filledRequired / requiredFields.length) * 70
    const optionalProgress = (filledOptional / optionalFields.length) * 30

    setProgress(Math.round(requiredProgress + optionalProgress))
  }, [formData])

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600 mb-4">
          Fill in your information to create your digital card. Fields marked with * are required.
        </p>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Profile Completion</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <ProfileForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={() => onProfileComplete({ ...formData, isPremium: false })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Benefits of SmartWave</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">Eco-friendly alternative to paper business cards</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">Always up-to-date information</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">Easy to share via QR code or direct link</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">Rich digital profile with more than just contact info</span>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center mt-1">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="ml-2 text-gray-700">Premium features like calendar integration and payment options</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold text-blue-600 mb-4">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">How does SmartWave work?</AccordionTrigger>
              <AccordionContent>
                SmartWave creates a digital business card that can be shared via QR code or direct link. Recipients can
                save your contact information directly to their phone or view your complete digital profile.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">Is my information secure?</AccordionTrigger>
              <AccordionContent>
                Yes, your information is secure. You control what information is visible on your digital card and who
                can access it.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Can I update my information later?</AccordionTrigger>
              <AccordionContent>
                You can update your information at any time, and all your shared cards will automatically reflect the
                changes.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">What are the premium features?</AccordionTrigger>
              <AccordionContent>
                Premium features include calendar integration for scheduling meetings, payment options to receive money
                directly, and advanced analytics to track who viewed your card.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

