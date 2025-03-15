import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Facebook, Github, Instagram, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { SocialInfo, BaseComponentProps } from "./types"

interface SocialLinksProps extends BaseComponentProps {
  social: SocialInfo
}

type SocialPlatform = keyof SocialInfo

export function SocialLinks({ social, theme }: SocialLinksProps) {
  const getSocialIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      case "github":
        return <Github className="h-5 w-5" />
      default:
        return null
    }
  }

  const getSocialName = (platform: SocialPlatform) => {
    switch (platform) {
      case "linkedin":
        return "LinkedIn"
      case "twitter":
        return "Twitter"
      case "facebook":
        return "Facebook"
      case "instagram":
        return "Instagram"
      case "github":
        return "GitHub"
      default:
        return String(platform).charAt(0).toUpperCase() + String(platform).slice(1)
    }
  }

  const socialEntries = Object.entries(social).filter(([_, url]) => url) as [SocialPlatform, string][]

  if (socialEntries.length === 0) {
    return null
  }

  if (theme === "minimal") {
    return (
      <div>
        <h2 className="mb-3 text-xl font-semibold">Connect With Me</h2>
        <div className="flex flex-wrap gap-3">
          {socialEntries.map(([platform, url]) => (
            <Link
              key={platform}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/80"
            >
              {getSocialIcon(platform as SocialPlatform)}
              {getSocialName(platform as SocialPlatform)}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  if (theme === "modern") {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 pb-2">
          <CardTitle className="text-xl">Connect With Me</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {socialEntries.map(([platform, url]) => (
              <Link
                key={platform}
                href={url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm font-medium transition-colors hover:bg-muted/80"
              >
                {getSocialIcon(platform as SocialPlatform)}
                {getSocialName(platform as SocialPlatform)}
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (theme === "bold") {
    return (
      <Card className="border-2 border-indigo-200">
        <CardHeader>
          <CardTitle>Connect With Me</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {socialEntries.map(([platform, url]) => {
              const bgColor =
                platform === "linkedin"
                  ? "bg-blue-50 hover:bg-blue-100"
                  : platform === "twitter"
                    ? "bg-sky-50 hover:bg-sky-100"
                    : platform === "facebook"
                      ? "bg-indigo-50 hover:bg-indigo-100"
                      : platform === "instagram"
                        ? "bg-pink-50 hover:bg-pink-100"
                        : platform === "github"
                          ? "bg-slate-50 hover:bg-slate-100"
                          : "bg-gray-50 hover:bg-gray-100"

              const textColor =
                platform === "linkedin"
                  ? "text-blue-600"
                  : platform === "twitter"
                    ? "text-sky-600"
                    : platform === "facebook"
                      ? "text-indigo-600"
                      : platform === "instagram"
                        ? "text-pink-600"
                        : platform === "github"
                          ? "text-slate-600"
                          : "text-gray-600"

              return (
                <Link
                  key={platform}
                  href={url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 rounded-lg p-3 font-medium transition-colors ${bgColor} ${textColor}`}
                >
                  {getSocialIcon(platform as SocialPlatform)}
                  {getSocialName(platform as SocialPlatform)}
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect With Me</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {socialEntries.map(([platform, url]) => (
            <Link
              key={platform}
              href={url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted/80"
            >
              {getSocialIcon(platform as SocialPlatform)}
              {getSocialName(platform as SocialPlatform)}
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

