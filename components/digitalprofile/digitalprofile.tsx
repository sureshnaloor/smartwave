"use client"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { ProfileHeader } from "./profile-header"
import { ContactInfo } from "./contact-info"
import { ImportantDates } from "./important-dates"
import { Locations } from "./locations"
import { AboutMe } from "./about-me"
import { SocialLinks } from "./social-links"
import { ActionButtons } from "./action-buttons"
import { ThemeSwitcher } from "./theme-switcher"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"
import { 
  ThemeType, 
  BackgroundType, 
  ProfileData 
} from "./types"

interface DigitalProfileProps {
  profileData: ProfileData
}

export function DigitalProfile({ profileData }: DigitalProfileProps) {
  // Use "classic" as default for layout theme
  const [layoutTheme, setLayoutTheme] = useState<ThemeType>("classic")
  // Use light/dark theme with system preference as default
  const [colorTheme, setColorTheme] = useState<"light" | "dark">("light")
  const [background, setBackground] = useState<BackgroundType>("gradient")

  // Check system preference on mount
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setColorTheme(prefersDark ? "dark" : "light")
  }, [])

  // Get background class based on selected background type and color theme
  const getBackgroundClass = () => {
    switch (background) {
      case "gradient":
        return colorTheme === "dark"
          ? "bg-gradient-to-br from-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-100 to-indigo-300"
      case "pattern":
        return colorTheme === "dark"
          ? "bg-gray-900 bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px]"
          : "bg-white bg-[radial-gradient(#62cff4_1px,transparent_1px)] [background-size:16px_16px]"
      case "solid":
        return colorTheme === "dark" ? "bg-gray-900" : "bg-slate-200"
      case "image":
        return colorTheme === "dark" 
          ? "bg-[url('/bgdark.jpg?height=1080&width=1920')] bg-cover bg-center" 
          : "bg-[url('/bgwhite.jpg?height=1080&width=1920')] bg-cover bg-center"
      default:
        return colorTheme === "dark" ? "bg-gray-900" : "bg-white"
    }
  }

  // Get layout class based on selected theme
  const getLayoutClass = () => {
    switch (layoutTheme) {
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

  // Toggle between light and dark theme
  const toggleColorTheme = () => {
    setColorTheme(prevTheme => (prevTheme === "dark" ? "light" : "dark"))
  }

  // Get text color based on theme
  const getTextColorClass = () => {
    return colorTheme === "dark" ? "text-white" : "text-gray-900"
  }

  return (
    <div className={cn("min-h-screen w-full pb-10", getBackgroundClass(), getTextColorClass())}>
      <div className={cn("mx-auto px-4 py-8", getLayoutClass())}>
        <div className="fixed top-4 right-4 z-10 flex gap-2">
          {/* Dark/Light mode toggle button */}
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleColorTheme}
            className={colorTheme === "dark" ? "bg-gray-800" : "bg-white"}
          >
            {colorTheme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle dark mode</span>
          </Button>
          
          {/* Layout theme and background switcher */}
          <ThemeSwitcher
            currentTheme={layoutTheme}
            setTheme={setLayoutTheme}
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
            logo={profileData.companyLogo}
            theme={layoutTheme}
          />
        </div>

    
        <div
          className={cn(
            "grid gap-6",
            layoutTheme === "classic"
              ? "grid-cols-1 md:grid-cols-2"
              : layoutTheme === "modern"
                ? "grid-cols-1 lg:grid-cols-3"
                : layoutTheme === "minimal"
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2",
          )}
        >
          <ContactInfo 
            workPhone={profileData.workPhone}
            workEmail={profileData.workEmail}
            fax={profileData.fax}
            homePhone={profileData.homePhone}
            personalEmail={profileData.personalEmail}
            mobile={profileData.mobile}
            title={profileData.title}
            theme={layoutTheme}
          />

          {/* <ImportantDates dates={profileData.dates} theme={layoutTheme} /> */}

          <Locations 
            workStreet={profileData.workStreet}
            workDistrict={profileData.workDistrict}
            workCity={profileData.workCity}
            workState={profileData.workState}
            workZipcode={profileData.workZipcode}
            workCountry={profileData.workCountry}
            homeStreet={profileData.homeStreet}
            homeDistrict={profileData.homeDistrict}
            homeCity={profileData.homeCity}
            homeState={profileData.homeState}
            homeZipcode={profileData.homeZipcode}
            homeCountry={profileData.homeCountry}
            theme={layoutTheme}
          />

          <AboutMe about={profileData.notes} theme={layoutTheme} />

          <SocialLinks 
            linkedin={profileData.linkedin}
            twitter={profileData.twitter}
            facebook={profileData.facebook}
            instagram={profileData.instagram}
            github={profileData.github}
            theme={layoutTheme}
          />
        </div>

        <div className="mt-8">
          <ActionButtons profileData={profileData} theme={layoutTheme} />
        </div>
        
      </div>
    </div>
  )
}

