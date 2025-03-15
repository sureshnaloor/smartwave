import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeType } from "./types"
import {
  Github,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ExternalLink,
} from "lucide-react"

interface SocialLinksProps {
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  github?: string
  theme: ThemeType
}

const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
  const iconProps = {
    className: "h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors",
  }

  const getIcon = () => {
    switch (platform) {
      case "linkedin":
        return <Linkedin {...iconProps} />
      case "twitter":
        return <Twitter {...iconProps} />
      case "facebook":
        return <Facebook {...iconProps} />
      case "instagram":
        return <Instagram {...iconProps} />
      case "github":
        return <Github {...iconProps} />
      default:
        return <ExternalLink {...iconProps} />
    }
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      {getIcon()}
      <span className="capitalize">{platform}</span>
    </a>
  )
}

export function SocialLinks({
  linkedin,
  twitter,
  facebook,
  instagram,
  github,
  theme,
}: SocialLinksProps) {
  const socialLinks = [
    { platform: "linkedin", url: linkedin },
    { platform: "twitter", url: twitter },
    { platform: "facebook", url: facebook },
    { platform: "instagram", url: instagram },
    { platform: "github", url: github },
  ].filter((link) => link.url)

  if (socialLinks.length === 0) return null

  if (theme === "minimal") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-xl font-semibold">Social Links</h2>
          <div className="grid gap-3">
            {socialLinks.map((link) => (
              <SocialIcon
                key={link.platform}
                platform={link.platform}
                url={link.url!}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (theme === "modern" || theme === "bold")
    return (
      <Card className={theme === "bold" ? "border-2 border-indigo-200" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {socialLinks.map((link) => (
              <SocialIcon
                key={link.platform}
                platform={link.platform}
                url={link.url!}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )

  // Default "classic" theme
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {socialLinks.map((link) => (
            <SocialIcon
              key={link.platform}
              platform={link.platform}
              url={link.url!}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

