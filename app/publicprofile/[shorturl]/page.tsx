import { getProfileByShortUrl } from "@/app/actions/profile"
import { notFound } from "next/navigation"

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
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Public Profile</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  )
} 