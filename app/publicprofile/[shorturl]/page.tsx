import { getProfileByShortUrl } from "@/app/_actions/profile"
import { notFound } from "next/navigation"
import { DigitalProfile } from "@/components/digitalprofile/digitalprofile"
import { ProfileActions } from "@/components/publicprofile/ProfileActions"
import { ProfileData } from "@/app/_actions/profile"

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
      <div className="container mx-auto px-4">
        {/* <ProfileActions profile={profile} /> */}
        <DigitalProfile 
          profileData={{
            ...profile,
           
          }}
        />
      </div>
    </div>
  )
}