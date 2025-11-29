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

const SocialIcon = ({ platform, url, theme }: { platform: string; url: string; theme: ThemeType }) => {
  const getIconColor = () => {
    switch (platform) {
      case "linkedin":
        return "from-blue-600 to-blue-700"
      case "twitter":
        return "from-sky-500 to-blue-600"
      case "facebook":
        return "from-blue-700 to-indigo-700"
      case "instagram":
        return "from-pink-600 via-purple-600 to-indigo-600"
      case "github":
        return "from-slate-700 to-slate-900"
      default:
        return "from-gray-600 to-gray-700"
    }
  }

  const getIcon = () => {
    const iconProps = {
      className: "h-5 w-5 text-white",
    }

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
      className="group/social flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:scale-105"
    >
      <div className={`p-3 rounded-xl bg-gradient-to-br ${getIconColor()} shadow-lg transition-all duration-300 group-hover/social:scale-110 group-hover/social:shadow-2xl group-hover/social:rotate-6`}>
        {getIcon()}
      </div>
      <span className="capitalize font-medium text-slate-700 dark:text-slate-300 group-hover/social:text-slate-900 dark:group-hover/social:text-white transition-colors">
        {platform}
      </span>
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

  if (theme === "glassmorphism") {
    return (
      <div className="grid grid-cols-2 gap-4">
        {socialLinks.map((link) => {
          const getIconColor = () => {
            switch (link.platform) {
              case "linkedin":
                return "text-[#0077b5]"
              case "twitter":
                return "text-sky-500"
              case "facebook":
                return "text-blue-700"
              case "instagram":
                return "text-pink-600"
              case "github":
                return "text-slate-900"
              default:
                return "text-gray-600"
            }
          }

          const getIcon = () => {
            const iconProps = { className: `text-3xl ${getIconColor()}` }
            switch (link.platform) {
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
              key={link.platform}
              href={link.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              {getIcon()}
              <span className="text-sm font-medium text-gray-700 capitalize">{link.platform}</span>
            </a>
          )
        })}
      </div>
    )
  }

  if (theme === "minimal") {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl hover:-translate-y-1">
          <h2 className="mb-4 text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Social Links
          </h2>
          <div className="grid gap-2">
            {socialLinks.map((link) => (
              <SocialIcon
                key={link.platform}
                platform={link.platform}
                url={link.url!}
                theme={theme}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (theme === "modern" || theme === "bold")
    return (
      <Card className={`
        overflow-hidden border-0 shadow-xl transition-all duration-500 
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] group
        ${theme === "bold"
          ? "bg-gradient-to-br from-white to-purple-50 dark:from-slate-900 dark:to-purple-950 border-2 border-purple-200 dark:border-purple-800"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        }
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-pink-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="grid gap-2">
            {socialLinks.map((link) => (
              <SocialIcon
                key={link.platform}
                platform={link.platform}
                url={link.url!}
                theme={theme}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    )

  // Default "classic" theme
  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Social Links
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="grid gap-2">
          {socialLinks.map((link) => (
            <SocialIcon
              key={link.platform}
              platform={link.platform}
              url={link.url!}
              theme={theme}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
