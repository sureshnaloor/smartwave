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
// First, add the Download icon import at the top
import { Sun, Moon, Download } from "lucide-react"
import {
  ThemeType,
  ProfileData
} from "./types"
import QRCode from 'qrcode'
import Image from 'next/image'

interface DigitalProfileProps {
  profileData: ProfileData
}

export function DigitalProfile({ profileData }: DigitalProfileProps) {
  // Use "classic" as default for layout theme
  const [layoutTheme, setLayoutTheme] = useState<ThemeType>("classic")
  // Use light/dark theme with system preference as default
  const [colorTheme, setColorTheme] = useState<"light" | "dark">("light")

  // Check system preference on mount
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setColorTheme(prefersDark ? "dark" : "light")
  }, [])

  // Get clean adaptive background based on color theme
  const getBackgroundClass = () => {
    return colorTheme === "dark"
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-slate-50 via-white to-slate-100"
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

  const [qrDataUrl, setQrDataUrl] = useState("")

  // Add generateVCardData function
  const generateVCardData = () => {
    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profileData.name}`,
      `N:${profileData.lastName || ''};${profileData.firstName || ''};${profileData.middleName || ''};;`,
      `TITLE:${profileData.title || ''}`,
      `ORG:${profileData.company || ''}`,
      `EMAIL;type=WORK:${profileData.workEmail || ''}`,
      `TEL;type=WORK:${profileData.workPhone || ''}`,
      `TEL;type=CELL:${profileData.mobile || ''}`,
      `ADR;type=WORK:;;${profileData.workStreet || ''};${profileData.workCity || ''};${profileData.workState || ''};${profileData.workZipcode || ''};${profileData.workCountry || ''}`,
      profileData.website ? `URL:${profileData.website}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n')
    return vCardData
  }

  // Add QR code generation effect
  useEffect(() => {
    const generateQR = async () => {
      const vCardData = generateVCardData()
      try {
        // First fetch and convert logo to base64
        let logoBase64 = '';
        if (profileData.companyLogo) {
          const response = await fetch(profileData.companyLogo);
          const blob = await response.blob();
          logoBase64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        }

        const qrOptions = {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H',
          quality: 0.92,
          ...(logoBase64 && {
            logo: logoBase64,
            logoWidth: 50,
            logoHeight: 50,
            logoBackgroundTransparent: false,
            logoMargin: 2,
            logoPaddingStyle: 'circle',
          })
        }

        const url = await QRCode.toDataURL(vCardData, qrOptions)
        setQrDataUrl(url)
      } catch (err) {
        // console.error("Error generating QR code:", err)
      }
    }

    generateQR()
  }, [profileData])

  // Move handleDownloadVCard inside the component
  const handleDownloadVCard = async () => {
    try {
      let photoData = '';

      if (profileData.photo) {
        const photoResponse = await fetch(profileData.photo);
        const photoBlob = await photoResponse.blob();
        const base64String = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(photoBlob);
        });

        photoData = base64String.toString().split(',')[1];
      }

      const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${profileData.name}`,
        `N:${profileData.lastName || ''};${profileData.firstName || ''};${profileData.middleName || ''};;`,
        `TITLE:${profileData.title || ''}`,
        `ORG:${profileData.company || ''}`,
        `EMAIL;type=WORK:${profileData.workEmail || ''}`,
        `TEL;type=WORK:${profileData.workPhone || ''}`,
        `TEL;type=CELL:${profileData.mobile || ''}`,
        `ADR;type=WORK:;;${profileData.workStreet || ''};${profileData.workCity || ''};${profileData.workState || ''};${profileData.workZipcode || ''};${profileData.workCountry || ''}`,
        profileData.website ? `URL:${profileData.website}` : '',
        photoData ? `PHOTO;ENCODING=b;TYPE=JPEG:${photoData}` : '',
        'END:VCARD'
      ].filter(Boolean).join('\n');

      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${profileData.name.replace(/\s+/g, '-')}.vcf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      // console.error('Error generating vCard:', error);
    }
  }

  return (
    <div className={cn("min-h-screen w-full pb-10", getBackgroundClass(), getTextColorClass())}>
      <div className={cn("mx-auto px-4 py-8", getLayoutClass())}>
        {/* Theme controls */}
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

          {/* Layout theme switcher */}
          <ThemeSwitcher
            currentTheme={layoutTheme}
            setTheme={setLayoutTheme}
          />
        </div>

        {/* Profile Header - Fixed syntax */}
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

        {/* Main Grid */}
        <div className={cn(
          "grid gap-6",
          layoutTheme === "classic"
            ? "grid-cols-1 md:grid-cols-2"
            : layoutTheme === "modern"
              ? "grid-cols-1 lg:grid-cols-3"
              : layoutTheme === "minimal"
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2",
        )}>
          <ContactInfo {...profileData} theme={layoutTheme} />
          <Locations {...profileData} theme={layoutTheme} />
          <AboutMe about={profileData.notes} theme={layoutTheme} />
          <SocialLinks {...profileData} theme={layoutTheme} />
        </div>

        {/* Contact Actions Section */}
        <div className="mt-16 grid gap-10 md:grid-cols-2 md:gap-12">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2">
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  QR Code
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6 font-medium">
                  Scan to add {profileData.firstName} {profileData.lastName} to your contacts
                </p>
                <div className="flex justify-center">
                  {qrDataUrl ? (
                    <div className="relative p-4 bg-white rounded-xl shadow-lg transition-transform duration-500 hover:scale-105">
                      <Image
                        src={qrDataUrl}
                        alt="QR Code"
                        width={300}
                        height={300}
                        className="rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-[300px] h-[300px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* vCard Download */}
          <div className="flex justify-center">
            <div className="relative group max-w-sm w-full">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2">
                <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Add to Contacts
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 font-medium">
                  Download {profileData.firstName} {profileData.lastName}&apos;s contact information as a vCard file
                </p>
                <Button
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/btn"
                  onClick={handleDownloadVCard}
                >
                  <Download className="mr-3 h-5 w-5 transition-transform duration-300 group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5" />
                  Add to Contacts
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

