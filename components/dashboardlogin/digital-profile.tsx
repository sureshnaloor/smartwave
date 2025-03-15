"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit2 } from "lucide-react"
import VCardEditor from "./vcard-editor"
import { ProfileData } from "@/app/actions/profile"

interface DigitalProfileProps {
  user: ProfileData
  onUpdate: (updatedData: ProfileData) => void
}

export default function DigitalProfile({ user, onUpdate }: DigitalProfileProps) {
  const [isEditing, setIsEditing] = useState(false)

  if (isEditing) {
    return <VCardEditor user={user} onUpdate={(data) => {
      onUpdate(data)
      setIsEditing(false)
    }} />
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">{user.name || `${user.firstName} ${user.lastName}`}</h1>
              <p className="text-blue-100">{user.title}</p>
            </div>
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

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Company Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          {(user.linkedin || user.twitter || user.facebook) && (
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
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
} 