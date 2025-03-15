"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2, Save, X } from "lucide-react"
import { User } from "./types"
import { updateVCardInfo } from "@/app/_actions/user"
import { useFormStatus } from "react-dom"

interface VCardEditorProps {
  user: User
  onUpdate: (updatedData: User) => void
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

  const handleAction = async (formData: FormData) => {
    try {
      // Log the user object and form data
      console.log('Current user data:', user)
      console.log('Form data userEmail:', formData.get('userEmail'))

      const result = await updateVCardInfo(formData)
      if (result.success) {
        setIsEditing(false)
        // Create updated user object from form data
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
        }
        onUpdate(updatedUser)
      }
    } catch (error) {
      console.error("Error updating vCard info:", error)
      setError(error instanceof Error ? error.message : "Failed to update contact information")
    }
  }

  if (!isEditing) {
    return (
      <div className="space-y-6 p-6 bg-white rounded-lg border-2 border-blue-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-sm text-gray-500">Name</Label>
            <p className="text-lg">{`${user.firstName || ''} ${user.middleName || ''} ${user.lastName || ''}`.trim()}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Title</Label>
            <p className="text-lg">{user.title}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Company</Label>
            <p className="text-lg">{user.company}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Work Email</Label>
            <p className="text-lg">{user.workEmail}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Work Phone</Label>
            <p className="text-lg">{user.workPhone}</p>
          </div>
          <div>
            <Label className="text-sm text-gray-500">Mobile</Label>
            <p className="text-lg">{user.mobile}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="text-sm text-gray-500">Work Address</Label>
            <p className="text-lg">
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
            <Label className="text-sm text-gray-500">Website</Label>
            <p className="text-lg">{user.website}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form action={handleAction} className="space-y-6 p-6 bg-white rounded-lg border-2 border-blue-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Edit Contact Information</h2>
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
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <SubmitButton />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md">
          {error}
        </div>
      )}

      <input 
        type="hidden" 
        name="userEmail" 
        value={user.userEmail || ''} 
      />

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