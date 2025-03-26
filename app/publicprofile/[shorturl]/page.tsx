import { getProfileByShortUrl } from "@/app/_actions/profile"
import { notFound } from "next/navigation"
import Image from "next/image"
import { DigitalProfile } from "@/components/digitalprofile/digitalprofile"
import { User, Mail, Phone, Globe, MapPin, Building2, Linkedin, Twitter, Facebook, Instagram, Youtube } from "lucide-react"

export default async function PublicProfilePage({
  params,
}: {
  params: { shorturl: string }
}) {
  const profile = await getProfileByShortUrl(params.shorturl)

  if (!profile) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
     <DigitalProfile profileData={{...profile, dates: [{}], locations: []}} />
    </div>
  )
} 