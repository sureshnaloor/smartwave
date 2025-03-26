"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit2, Building2, User, Share2, Link } from "lucide-react"
import VCardEditor from "./vcard-editor"
import { ProfileData, generateAndUpdateShortUrl } from "@/app/_actions/profile"
import Image from "next/image"
import { toast } from "sonner"

interface DigitalProfileProps {
  user: ProfileData
  onUpdate: (updatedData: ProfileData) => void
}

export default function DigitalProfile({ user, onUpdate }: DigitalProfileProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false)

  const handleGenerateShortUrl = async () => {
    try {
      setIsGeneratingUrl(true)
      const result = await generateAndUpdateShortUrl(user.userEmail)
      if (result.success) {
        onUpdate({ ...user, shorturl: result.shorturl })
        toast.success("Short URL generated successfully!")
      } else {
        toast.error(result.error || "Failed to generate short URL")
      }
    } catch (error) {
      toast.error("An error occurred while generating short URL")
    } finally {
      setIsGeneratingUrl(false)
    }
  }

  if (isEditing) {
    return <VCardEditor user={user} onUpdate={(data) => {
      onUpdate(data)
      setIsEditing(false)
    }} />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header with Profile Photo */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <div className="flex items-start gap-6">
            {/* Profile Photo */}
            <div className="shrink-0">
              {user.photo ? (
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
                  <Image
                    src={user.photo}
                    alt={user.name || "Profile photo"}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20">
                  <User className="h-12 w-12 text-white/60" />
                </div>
              )}
            </div>

            {/* Name and Title */}
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-white">{user.name || `${user.firstName} ${user.lastName}`}</h1>
              <p className="text-blue-100 mt-1">{user.title}</p>
            </div>

            <div className="flex gap-2">
              {!user.shorturl ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateShortUrl}
                  disabled={isGeneratingUrl}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Link className="h-4 w-4 mr-2" />
                  {isGeneratingUrl ? 'Generating...' : 'Generate Short URL'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/publicprofile/${user.shorturl}`, '_blank')}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Company Information with Logo */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Company</label>
                  <p className="text-gray-900">{user.company || "Not specified"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Website</label>
                  <p className="text-gray-900">
                    {user.website ? (
                      <a href={user.website} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        {user.website}
                      </a>
                    ) : "Not specified"}
                  </p>
                </div>
              </div>
              
              {/* Company Logo */}
              <div className="flex justify-center md:justify-end">
                {user.companyLogo ? (
                  <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 bg-white p-2">
                    <Image
                      src={user.companyLogo}
                      alt={`${user.company} logo`}
                      width={128}
                      height={128}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-gray-300" />
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Contact Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Work Email</label>
                <p className="text-gray-900">{user.workEmail || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Personal Email</label>
                <p className="text-gray-900">{user.personalEmail || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Work Phone</label>
                <p className="text-gray-900">{user.workPhone || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Mobile</label>
                <p className="text-gray-900">{user.mobile || "Not specified"}</p>
              </div>
            </div>
          </section>

          {/* Work Address */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Work Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-500">Street Address</label>
                <p className="text-gray-900">{user.workStreet || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">City</label>
                <p className="text-gray-900">{user.workCity || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">State</label>
                <p className="text-gray-900">{user.workState || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Zip Code</label>
                <p className="text-gray-900">{user.workZipcode || "Not specified"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-gray-900">{user.workCountry || "Not specified"}</p>
              </div>
            </div>
          </section>

          {/* Social Media */}
          {(user.linkedin || user.twitter || user.facebook || user.instagram || user.youtube) && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Social Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.linkedin && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">LinkedIn</label>
                    <p className="text-gray-900">
                      <a href={user.linkedin} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </p>
                  </div>
                )}
                {user.twitter && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Twitter</label>
                    <p className="text-gray-900">
                      <a href={user.twitter} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </p>
                  </div>
                )}
                {user.facebook && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Facebook</label>
                    <p className="text-gray-900">
                      <a href={user.facebook} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </p>
                  </div>
                )}
                {user.instagram && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Instagram</label>
                    <p className="text-gray-900">
                      <a href={user.instagram} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </p>
                  </div>
                )}
                {user.youtube && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">YouTube</label>
                    <p className="text-gray-900">
                      <a href={user.youtube} target="_blank" rel="noopener noreferrer" 
                         className="text-blue-600 hover:text-blue-800">
                        View Profile
                      </a>
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
} 