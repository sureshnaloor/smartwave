import { getProfileByShortUrl } from "@/app/_actions/profile"
import { notFound } from "next/navigation"
import { DigitalProfile } from "@/components/digitalprofile/digitalprofile"

export default async function PublicProfilePage({
  params,
}: {
  params: { shorturl: string }
}) {
  const profile = await getProfileByShortUrl(params.shorturl)

  if (!profile) {
    notFound()
  }

  // Add the missing required properties
  const enrichedProfile = {
    ...profile,
    dates: {
      birthday: profile.birthday || undefined,
      workAnniversary: undefined,
      weddingAnniversary: undefined
    },
    locations: {
      work: {
        lat: 0,  // Default to 0 instead of undefined
        lng: 0,  // Default to 0 instead of undefined
        label: `${profile.workStreet || ''}, ${profile.workCity || ''}`
      },
      home: undefined
    }
} // Remove type assertion since ProfileData interface is not defined

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <DigitalProfile 
          profileData={enrichedProfile}
        />
      </div>
    </div>
  )
}