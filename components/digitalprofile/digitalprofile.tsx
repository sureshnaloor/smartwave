"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { ProfileHeader } from "./profile-header"
import { ContactInfo } from "./contact-info"
import { ImportantDates } from "./important-dates"
import { LocationMap } from "./location-maps"
import { AboutMe } from "./about-me"
import { SocialLinks } from "./social-links"
import { ActionButtons } from "./action-buttons"
import { ThemeSwitcher } from "./theme-switcher"
import { 
  ThemeType, 
  BackgroundType, 
  ProfileData 
} from "./types"

interface DigitalProfileProps {
  profileData: ProfileData
}

export function DigitalProfile({ profileData }: DigitalProfileProps) {
  const [theme, setTheme] = useState<ThemeType>("classic")
  const [background, setBackground] = useState<BackgroundType>("gradient")

  // Get background class based on selected background type
  const getBackgroundClass = () => {
    switch (background) {
      case "gradient":
        return "bg-gradient-to-br from-blue-50 to-indigo-100"
      case "pattern":
        return "bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
      case "solid":
        return "bg-slate-50"
      case "image":
        return "bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"
      default:
        return "bg-white"
    }
  }

  // Get layout class based on selected theme
  const getLayoutClass = () => {
    switch (theme) {
      case "classic":
        return "max-w-4xl"
      case "modern":
        return "max-w-5xl"
      case "minimal":
        return "max-w-3xl"
      case "bold":
        return "max-w-4xl"
      default:
        return "max-w-4xl"
    }
  }

  return (
    <div className={cn("min-h-screen w-full pb-10", getBackgroundClass())}>
      <div className={cn("mx-auto px-4 py-8", getLayoutClass())}>
        <div className="fixed top-4 right-4 z-10">
          <ThemeSwitcher
            currentTheme={theme}
            setTheme={setTheme}
            currentBackground={background}
            setBackground={setBackground}
          />
        </div>

        <div className="mb-8">
          <ProfileHeader 
            firstName={profileData.firstName}
            middleName={profileData.middleName}
            lastName={profileData.lastName}
            title={profileData.title}
            photo={profileData.photo}
            company={profileData.company}
            logo={profileData.logo}
            theme={theme}
          />
        </div>

        {/* Temporarily commenting out other components
        <div
          className={cn(
            "grid gap-6",
            theme === "classic"
              ? "grid-cols-1 md:grid-cols-2"
              : theme === "modern"
                ? "grid-cols-1 lg:grid-cols-3"
                : theme === "minimal"
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2",
          )}
        >
          <ContactInfo work={profileData.work} home={profileData.home} theme={theme} />

          <ImportantDates dates={profileData.dates} theme={theme} />

          {profileData.locations && <LocationMap locations={profileData.locations} theme={theme} />}

          <AboutMe about={profileData.about} theme={theme} />

          <SocialLinks social={profileData.social} theme={theme} />
        </div>

        <div className="mt-8">
          <ActionButtons profileData={profileData} theme={theme} />
        </div>
        */}
      </div>
    </div>
  )
}

