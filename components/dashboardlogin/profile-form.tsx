"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Briefcase, Mail, Phone, Globe, MapPin, Upload } from "lucide-react"

export default function ProfileForm({ formData, setFormData, onSubmit }) {
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is filled
    if (value && errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate required fields
    const newErrors = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.phone) newErrors.phone = "Phone number is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit()
  }

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      // In a real app, you would upload this to a server
      // For this example, we'll use a data URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="flex items-center">
            <User className="h-4 w-4 mr-1" /> Name *
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">
            <Briefcase className="h-4 w-4 mr-1 inline" /> Job Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Software Engineer"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">
            <Briefcase className="h-4 w-4 mr-1 inline" /> Company
          </Label>
          <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Acme Inc." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center">
            <Mail className="h-4 w-4 mr-1" /> Email *
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="flex items-center">
            <Phone className="h-4 w-4 mr-1" /> Phone *
          </Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">
            <Globe className="h-4 w-4 mr-1 inline" /> Website
          </Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          <MapPin className="h-4 w-4 mr-1 inline" /> Address
        </Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="123 Main St, City, Country"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">
          <Upload className="h-4 w-4 mr-1 inline" /> Profile Photo
        </Label>
        <div className="flex items-center space-x-4">
          {formData.photo ? (
            <div className="relative h-20 w-20">
              <img
                src={formData.photo || "/placeholder.svg"}
                alt="Profile preview"
                className="h-20 w-20 rounded-full object-cover"
              />
              <button
                type="button"
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                onClick={() => setFormData((prev) => ({ ...prev, photo: "" }))}
              >
                ✕
              </button>
            </div>
          ) : (
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-gray-400" />
            </div>
          )}
          <Input
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="max-w-xs"
          />
        </div>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white">
          Complete Profile
        </Button>
      </div>
    </form>
  )
}

