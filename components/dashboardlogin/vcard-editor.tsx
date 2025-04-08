"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Save, X, Upload } from "lucide-react"
import { ProfileData } from "@/app/_actions/profile"
import { updateVCardInfo } from "@/app/_actions/user"
import { useFormStatus } from "react-dom"

interface VCardEditorProps {
  user: ProfileData
  onUpdate: (updatedData: ProfileData) => void
}

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
    >
      <Save className="h-4 w-4 mr-2" />
      {pending ? 'Saving...' : 'Save'}
    </Button>
  )
}

export default function VCardEditor({ user, onUpdate }: VCardEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [photoUrl, setPhotoUrl] = useState(user.photo || '')
  const [companyLogoUrl, setCompanyLogoUrl] = useState(user.companyLogo || '')

  const handleImageUpload = async (file: File, type: 'photo' | 'companyLogo') => {
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', type === 'photo' ? 'profile_photos' : 'company_logos')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      if (type === 'photo') {
        setPhotoUrl(data.secure_url)
      } else {
        setCompanyLogoUrl(data.secure_url)
      }
    } catch (error) {
      // console.error('Error uploading image:', error)
      setError(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleAction = async (formData: FormData) => {
    try {
      // Add photo and company logo URLs to form data
      formData.append('photo', photoUrl)
      formData.append('companyLogo', companyLogoUrl)

      // Log the user object and form data
      // console.log('Current user data:', user)
      // console.log('Form data userEmail:', formData.get('userEmail'))
      // console.log('Photo URL:', photoUrl)
      // console.log('Company Logo URL:', companyLogoUrl)

      const result = await updateVCardInfo(formData)
      if (result.success) {
        setIsEditing(false)
        // Get the updated profile data
        const updatedUser = {
          ...user,
          firstName: formData.get('firstName') as string,
          middleName: formData.get('middleName') as string,
          lastName: formData.get('lastName') as string,
          title: formData.get('title') as string,
          company: formData.get('company') as string,
          workEmail: formData.get('workEmail') as string,
          workPhone: formData.get('workPhone') as string,
          mobile: formData.get('mobile') as string,
          workStreet: formData.get('workStreet') as string,
          workCity: formData.get('workCity') as string,
          workState: formData.get('workState') as string,
          workZipcode: formData.get('workZipcode') as string,
          workCountry: formData.get('workCountry') as string,
          website: formData.get('website') as string,
          photo: photoUrl,
          companyLogo: companyLogoUrl,
          // Update the name field with the new full name
          name: [
            formData.get('firstName'),
            formData.get('middleName'),
            formData.get('lastName')
          ].filter(Boolean).join(" ").trim(),
          // Update workAddress field
          workAddress: [
            formData.get('workStreet'),
            formData.get('workCity'),
            formData.get('workState'),
            formData.get('workZipcode'),
            formData.get('workCountry')
          ].filter(Boolean).join(", ")
        }
        onUpdate(updatedUser)
      } else {
        setError(result.error || "Failed to update contact information")
      }
    } catch (error) {
      // console.error("Error updating vCard info:", error)
      setError(error instanceof Error ? error.message : "Failed to update contact information")
    }
  }

  if (!isEditing) {
    return (
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-white rounded-lg border-2 border-blue-200">
        <div className="flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-semibold">Contact Information</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Edit
          </Button>
        </div>

        {/* Add Image Display Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 border-b pb-4 sm:pb-6">
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Profile Photo</Label>
            {user.photo ? (
              <div className="mt-2">
                <img 
                  src={user.photo} 
                  alt="Profile" 
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No profile photo</p>
            )}
          </div>
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Company Logo</Label>
            {user.companyLogo ? (
              <div className="mt-2">
                <img 
                  src={user.companyLogo} 
                  alt="Company Logo" 
                  className="w-24 h-24 rounded-lg object-contain bg-white p-2 border-2 border-gray-200"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-500 mt-2">No company logo</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Name</Label>
            <p className="text-base sm:text-lg font-medium">{`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.trim()}</p>
          </div>
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Title</Label>
            <p className="text-base sm:text-lg">{user.title}</p>
          </div>
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Company</Label>
            <p className="text-base sm:text-lg">{user.company}</p>
          </div>
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Work Email</Label>
            <p className="text-base sm:text-lg break-all">{user.workEmail}</p>
          </div>
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Work Phone</Label>
            <p className="text-base sm:text-lg">{user.workPhone}</p>
          </div>
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Mobile</Label>
            <p className="text-base sm:text-lg">{user.mobile}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-xs sm:text-sm text-gray-500">Work Address</Label>
            <p className="text-base sm:text-lg">
              {[
                user.workStreet,
                user.workCity,
                user.workState,
                user.workZipcode,
                user.workCountry
              ].filter(Boolean).join(", ")}
            </p>
          </div>
          <div>
            <Label className="text-xs sm:text-sm text-gray-500">Website</Label>
            <p className="text-base sm:text-lg break-all">{user.website}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form action={handleAction} className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-white rounded-lg border-2 border-blue-200">
      <div className="flex justify-between items-center">
        <h2 className="text-lg sm:text-xl font-semibold">Edit Contact Information</h2>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setIsEditing(false)
              setError(null)
            }}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Cancel
          </Button>
          <SubmitButton />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 sm:px-4 sm:py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <input 
        type="hidden" 
        name="userEmail" 
        value={user.userEmail || ''} 
      />

      {/* Image Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 border-b pb-4 sm:pb-6">
        <div>
          <Label className="text-xs sm:text-sm">Profile Photo</Label>
          <div className="mt-2 flex items-center gap-3 sm:gap-4">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover" />
            ) : null}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'photo')
                }}
                disabled={uploading}
                className="hidden"
                id="photo-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('photo-upload')?.click()}
                disabled={uploading}
                className="text-xs sm:text-sm h-8 sm:h-9"
              >
                <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                {uploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <Label>Company Logo</Label>
          <div className="mt-2 flex items-center gap-4">
            {companyLogoUrl ? (
              <img src={companyLogoUrl} alt="Company Logo" className="w-24 h-24 rounded-lg object-contain bg-white p-2 border" />
            ) : null}
            <div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file, 'companyLogo')
                }}
                disabled={uploading}
                className="hidden"
                id="logo-upload"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('logo-upload')?.click()}
                disabled={uploading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Upload Logo'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={user.firstName || ""}
          />
        </div>
        <div>
          <Label htmlFor="middleName">Middle Name</Label>
          <Input
            id="middleName"
            name="middleName"
            defaultValue={user.middleName || ""}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={user.lastName || ""}
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={user.title || ""}
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            defaultValue={user.company || ""}
          />
        </div>
        <div>
          <Label htmlFor="workEmail">Work Email</Label>
          <Input
            id="workEmail"
            name="workEmail"
            type="email"
            defaultValue={user.workEmail || ""}
          />
        </div>
        <div>
          <Label htmlFor="workPhone">Work Phone</Label>
          <Input
            id="workPhone"
            name="workPhone"
            defaultValue={user.workPhone || ""}
          />
        </div>
        <div>
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            name="mobile"
            defaultValue={user.mobile || ""}
          />
        </div>
        <div>
          <Label htmlFor="workStreet">Street Address</Label>
          <Input
            id="workStreet"
            name="workStreet"
            defaultValue={user.workStreet || ""}
          />
        </div>
        <div>
          <Label htmlFor="workCity">City</Label>
          <Input
            id="workCity"
            name="workCity"
            defaultValue={user.workCity || ""}
          />
        </div>
        <div>
          <Label htmlFor="workState">State</Label>
          <Input
            id="workState"
            name="workState"
            defaultValue={user.workState || ""}
          />
        </div>
        <div>
          <Label htmlFor="workZipcode">Zipcode</Label>
          <Input
            id="workZipcode"
            name="workZipcode"
            defaultValue={user.workZipcode || ""}
          />
        </div>
        <div>
          <Label htmlFor="workCountry">Country</Label>
          <Input
            id="workCountry"
            name="workCountry"
            defaultValue={user.workCountry || ""}
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            defaultValue={user.website || ""}
          />
        </div>
      </div>
    </form>
  )
}