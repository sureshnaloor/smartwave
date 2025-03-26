import { getProfileByShortUrl } from "@/app/_actions/profile"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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

  const workAddress = [
    profile.workStreet,
    profile.workCity,
    profile.workState,
    profile.workZipcode,
    profile.workCountry
  ].filter(Boolean).join(", ")

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8">
            <div className="flex items-center gap-6">
              {/* Profile Photo */}
              <div className="shrink-0">
                {profile.photo ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                    <Image
                      src={profile.photo}
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-white/10 flex items-center justify-center border-4 border-white/20">
                    <User className="h-16 w-16 text-white/60" />
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                <p className="text-xl text-blue-100 mt-2">{profile.title}</p>
                <div className="flex items-center mt-3 text-blue-100">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{profile.company}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.workEmail && (
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Work Email</p>
                      <p className="text-gray-900">{profile.workEmail}</p>
                    </div>
                  </div>
                )}
                {profile.workPhone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Work Phone</p>
                      <p className="text-gray-900">{profile.workPhone}</p>
                    </div>
                  </div>
                )}
                {profile.mobile && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Mobile</p>
                      <p className="text-gray-900">{profile.mobile}</p>
                    </div>
                  </div>
                )}
                {profile.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a 
                        href={profile.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {profile.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Work Address */}
            {workAddress && (
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Work Address</h2>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <p className="text-gray-700">{workAddress}</p>
                </div>
              </section>
            )}

            {/* Social Media */}
            {(profile.linkedin || profile.twitter || profile.facebook || profile.instagram || profile.youtube) && (
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Connect</h2>
                <div className="flex flex-wrap gap-4">
                  {profile.linkedin && (
                    <a 
                      href={profile.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {profile.twitter && (
                    <a 
                      href={profile.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      <Twitter className="h-5 w-5" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {profile.facebook && (
                    <a 
                      href={profile.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      <Facebook className="h-5 w-5" />
                      <span>Facebook</span>
                    </a>
                  )}
                  {profile.instagram && (
                    <a 
                      href={profile.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      <Instagram className="h-5 w-5" />
                      <span>Instagram</span>
                    </a>
                  )}
                  {profile.youtube && (
                    <a 
                      href={profile.youtube} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700"
                    >
                      <Youtube className="h-5 w-5" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 