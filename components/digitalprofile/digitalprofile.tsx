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
import { Sun, Moon, Download, Wallet } from "lucide-react"
import {
  ThemeType,
  ProfileData
} from "./types"
import QRCode from 'qrcode'
import Image from 'next/image'
import { hasRequiredProfileFields, REQUIRED_PROFILE_FIELDS_MESSAGE } from "@/lib/profile-completeness"
import DigitalCard from "@/components/dashboardlogin/digital-card"
import type { ProfileData as CardProfileData } from "@/app/_actions/profile"

interface DigitalProfileProps {
  profileData: ProfileData
}

export function DigitalProfile({ profileData }: DigitalProfileProps) {
  // Use "classic" as default for layout theme
  const [layoutTheme, setLayoutTheme] = useState<ThemeType>("classic")
  // Use light/dark theme with system preference as default
  const [colorTheme, setColorTheme] = useState<"light" | "dark">("light")
  const [os, setOs] = useState<"ios" | "android" | "other">("other")

  // Check system preference and OS on mount
  useEffect(() => {
    // Check if user prefers dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    setColorTheme(prefersDark ? "dark" : "light")

    // Simple OS detection
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs("ios")
    } else if (/android/.test(userAgent)) {
      setOs("android")
    }
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
      case "glassmorphism":
        return "max-w-2xl"
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
  const isProfileComplete = hasRequiredProfileFields(profileData)
  const actionTitle = isProfileComplete ? undefined : REQUIRED_PROFILE_FIELDS_MESSAGE

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

        const url = await (QRCode as any).toDataURL(vCardData, qrOptions)
        setQrDataUrl(url)
      } catch (err) {
        // console.error("Error generating QR code:", err)
      }
    }

    generateQR()
  }, [profileData])

  // Move handleDownloadVCard inside the component
  const handleDownloadVCard = async () => {
    if (!isProfileComplete) return

    try {
      let photoData = '';

      if (profileData.photo) {
        const photoResponse = await fetch(profileData.photo);
        const photoBlob = await photoResponse.blob();
        const base64String = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(photoBlob);
        });

        photoData = base64String.split(',')[1];
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
    <div
      className={cn("min-h-screen w-full pb-10", layoutTheme !== "glassmorphism" && getBackgroundClass(), layoutTheme !== "glassmorphism" && getTextColorClass())}
      style={layoutTheme === "glassmorphism" ? { backgroundColor: (profileData as any).backgroundColor || '#EBE9E1' } : {}}
    >
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
                : layoutTheme === "glassmorphism"
                  ? "grid-cols-1"
                  : "grid-cols-1 md:grid-cols-2",
        )}>
          <ContactInfo {...profileData} theme={layoutTheme} />
          <Locations {...profileData} theme={layoutTheme} />
          <AboutMe about={profileData.notes} theme={layoutTheme} />
          <SocialLinks {...profileData} theme={layoutTheme} />
        </div>

        {/* Digital Card + QR / Contacts — responsive two-column on large screens */}
        <section className="mt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start max-w-5xl mx-auto">
            {/* Column 1: Digital Card */}
            <div className="relative group w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 h-full">
                <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-violet-600 to-orange-500 bg-clip-text text-transparent">
                  Digital Card
                </h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-5 font-medium">
                  Browse themes, flip the card, and share or download {profileData.firstName}&apos;s business card
                </p>
                <DigitalCard
                  user={profileData as unknown as CardProfileData}
                  maxDisplayWidth={480}
                  showWalletButtons={false}
                />
              </div>
            </div>

            {/* Column 2: QR + Add to Contacts + Wallet */}
            <div className="flex flex-col gap-6 w-full">
              {/* QR Code */}
              <div className="relative group w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                    QR Code
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-5 font-medium">
                    Scan to add {profileData.firstName} {profileData.lastName} to your contacts
                  </p>
                  <div className="flex justify-center">
                    {qrDataUrl ? (
                      <div className="relative p-3 sm:p-4 bg-white rounded-xl shadow-lg">
                        <Image
                          src={qrDataUrl}
                          alt="QR Code"
                          width={240}
                          height={240}
                          className="rounded-lg w-[200px] h-[200px] sm:w-[240px] sm:h-[240px]"
                        />
                      </div>
                    ) : (
                      <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Add to Contacts + Wallet */}
              <div className="relative group w-full">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
                <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Add to Contacts
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-5 font-medium">
                    Download {profileData.firstName} {profileData.lastName}&apos;s contact information as a vCard file
                  </p>
                  <div title={actionTitle}>
                    <Button
                      className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      onClick={handleDownloadVCard}
                      disabled={!isProfileComplete}
                    >
                      <Download className="mr-2 sm:mr-3 h-5 w-5" />
                      Add to Contacts
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {(os === "ios" || os === "other") && (
                      <div title={actionTitle}>
                        <Button
                          variant="outline"
                          className="w-full h-11 sm:h-12 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 font-semibold transition-all"
                          onClick={() => window.open(`/api/wallet/apple?shorturl=${profileData.shorturl}`, "_blank")}
                          disabled={!isProfileComplete}
                        >
                          <Wallet className="mr-2 h-5 w-5 text-blue-600" />
                          Add to Apple Wallet
                        </Button>
                      </div>
                    )}
                    {(os === "android" || os === "other") && (
                      <div title={actionTitle}>
                        <Button
                          variant="outline"
                          className="w-full h-11 sm:h-12 border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-500 font-semibold transition-all"
                          onClick={() => window.open(`/api/wallet/google?shorturl=${profileData.shorturl}`, "_blank")}
                          disabled={!isProfileComplete}
                        >
                          <Wallet className="mr-2 h-5 w-5 text-green-600" />
                          Save to Google Wallet
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

