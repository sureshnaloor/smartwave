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
  BackgroundType, 
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
          
          {/* Layout theme and background switcher */}
          <ThemeSwitcher
            currentTheme={layoutTheme}
            setTheme={setLayoutTheme}
            currentBackground={background}
            setBackground={setBackground}
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
        <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-12">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm w-full">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">QR Code</h3>
              <p className="text-gray-600 mb-6">
                Scan this QR code to add {profileData.name} to your contacts
              </p>
              <div className="flex justify-center">
                {qrDataUrl ? (
                  <Image
                    src={qrDataUrl}
                    alt="QR Code"
                    width={300}
                    height={300}
                    className="rounded-lg"
                  />
                ) : (
                  <div className="w-[300px] h-[300px] bg-gray-100 rounded-lg animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* vCard Download */}
          <div className="flex justify-center">
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-sm w-full">
              <h3 className="text-xl font-semibold mb-4 text-teal-600">Add to Contacts</h3>
              <p className="text-gray-600 mb-6">
                Download {profileData.name}&apos;s contact information as a vCard file
              </p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleDownloadVCard}
              >
                <Download className="mr-2 h-4 w-4" />
                Add to Contacts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

