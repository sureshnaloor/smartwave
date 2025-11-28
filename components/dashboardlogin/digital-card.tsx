"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Globe, RotateCw, MapPin, Palette, Download, Share2, Edit2, Linkedin, Twitter, Facebook, Instagram, Youtube } from "lucide-react"
import { ProfileData } from "@/app/_actions/profile"
import QRCode from "qrcode"
import * as htmlToImage from 'html-to-image'

// Standard business card dimensions (3.5 x 2 inches) at 4x scale
const CARD_WIDTH = 1344 // 3.5 inches * 96px/inch * 4
const CARD_HEIGHT = 768 // 2 inches * 96px/inch * 4

type Theme = 'smartwave' | 'minimal' | 'dark'

const themeStyles = {
  smartwave: {
    front: 'bg-gradient-to-r from-blue-600 to-red-600',
    back: 'bg-gradient-to-r from-red-600 to-blue-600',
    text: {
      primary: 'text-white',
      address: 'text-blue-100',
      contact: 'text-orange-100',
      icon: 'text-white/60',
      backLeft: 'text-gray-900' // Contrasting color for back left content
    },
    buttonText: 'text-white/70 hover:text-white',
    backButtonText: 'bg-white/90 text-gray-800 hover:bg-white',
  },
  minimal: {
    front: 'bg-[#f7f3eb]', // Matte cream color
    back: 'bg-[#f0ece4]', // Slightly darker cream for back
    text: {
      primary: 'text-gray-800',
      address: 'text-blue-800',
      contact: 'text-gray-700',
      icon: 'text-gray-500',
      backLeft: 'text-gray-900'
    },
    buttonText: 'text-gray-500 hover:text-gray-700',
    backButtonText: 'bg-gray-800 text-white hover:bg-gray-900',
  },
  dark: {
    front: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black',
    back: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black',
    text: {
      primary: 'text-gray-100',
      address: 'text-emerald-300',
      contact: 'text-purple-300',
      icon: 'text-gray-500',
      backLeft: 'text-gray-200'
    },
    buttonText: 'text-gray-300 hover:text-white',
    backButtonText: 'bg-gray-700 text-gray-200 hover:bg-gray-600',
  },
}

interface DigitalCardProps {
  user: ProfileData
}

// Add a new CardContainer component
function CardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[1344px] mx-auto">
      <div
        className="relative w-full"
        style={{
          paddingBottom: `${(CARD_HEIGHT / CARD_WIDTH) * 100}%`,
          maxWidth: `${CARD_WIDTH}px`,
          maxHeight: `${CARD_HEIGHT}px`
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function DigitalCard({ user }: DigitalCardProps) {
  const [showFront, setShowFront] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<Theme>('smartwave')
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [isDownloading, setIsDownloading] = useState(false)

  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  const homeAddress = [
    user.homeStreet,
    user.homeCity,
    user.homeState,
    user.homeZipcode,
    user.homeCountry
  ].filter(Boolean).join(", ")

  const workAddress = [
    user.workStreet,
    user.workCity,
    user.workState,
    user.workZipcode,
    user.workCountry
  ].filter(Boolean).join(", ")

  const flipCard = () => setShowFront(!showFront)

  const cycleTheme = () => {
    const themes: Theme[] = ['smartwave', 'minimal', 'dark']
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setCurrentTheme(themes[nextIndex])
  }

  const theme = themeStyles[currentTheme]

  // Function to create vCard format string (simplified for better QR readability)
  const generateVCardData = () => {
    // Split the full name into parts (assuming the name is in "First Last" format)
    const nameParts = user.name.split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    const vCardData = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${user.name}`,
      `N:${lastName};${firstName};;;`, // Last;First;Middle;Prefix;Suffix
      `TITLE:${user.title || ''}`,
      `ORG:${user.company || ''}`,
      `EMAIL:${user.workEmail || ''}`,
      `TEL:${user.workPhone || ''}`,
      `TEL:${user.mobile || ''}`,
      user.website ? `URL:${user.website}` : '',
      'END:VCARD'
    ].filter(Boolean).join('\n')

    // console.log('Generated vCard data:', vCardData) // For debugging
    return vCardData
  }

  // Generate QR code when component mounts or theme changes
  useEffect(() => {
    const generateQR = async () => {
      const vCardData = generateVCardData()
      // console.log('Generating QR code with vCard data:', vCardData)

      try {
        const qrOptions = {
          type: 'image/png' as const,
          width: 300, // Increased size
          margin: 1,
          color: {
            dark: '#000000', // Always black for better scanning
            light: '#ffffff', // Always white background
          },
          errorCorrectionLevel: 'Q' as const, // Changed to Q for better balance
        }

        const url = await QRCode.toDataURL(vCardData, qrOptions)
        // console.log('QR code generated successfully')
        setQrDataUrl(url)
      } catch (err) {
        // console.error("Error generating QR code:", err)
      }
    }

    generateQR()
  }, [currentTheme, user])

  // Update the print dimensions constants (300 DPI for high quality)
  const PRINT_CARD_WIDTH = 1050  // 3.5 inches * 300dpi
  const PRINT_CARD_HEIGHT = 600  // 2 inches * 300dpi

  // Update the downloadBusinessCard function
  const downloadBusinessCard = async () => {
    if (!frontRef.current || !backRef.current || isDownloading) return;

    setIsDownloading(true);
    try {
      // Store original states
      const originalShowFront = showFront;
      const originalFrontVisibility = frontRef.current.style.visibility;
      const originalBackVisibility = backRef.current.style.visibility;
      const originalFrontDisplay = frontRef.current.style.display;
      const originalBackDisplay = backRef.current.style.display;

      // Configure options for exact dimensions
      const options = {
        width: PRINT_CARD_WIDTH,
        height: PRINT_CARD_HEIGHT,
        quality: 1,
        pixelRatio: 1,
        skipAutoScale: true,
        canvasWidth: PRINT_CARD_WIDTH,
        canvasHeight: PRINT_CARD_HEIGHT,
      };

      // Capture style for both sides
      const captureStyle = `
        width: ${PRINT_CARD_WIDTH}px !important;
        height: ${PRINT_CARD_HEIGHT}px !important;
        transform: none !important;
        transition: none !important;
        position: absolute !important;
        visibility: visible !important;
        display: block !important;
        opacity: 1 !important;
      `;

      // Prepare front side for capture
      frontRef.current.style.cssText += captureStyle;
      frontRef.current.style.transform = 'none';
      frontRef.current.classList.remove('hidden');

      // Capture front
      const frontImage = await htmlToImage.toJpeg(frontRef.current, {
        ...options,
        style: {
          // Remove spread of options.style since it doesn't exist in the options type
          background: currentTheme === 'minimal' ? '#f7f3eb' :
            currentTheme === 'dark' ? 'radial-gradient(ellipse at top right, rgb(17, 24, 39), rgb(31, 41, 55), rgb(0, 0, 0))' :
              'linear-gradient(to right, rgb(37, 99, 235), rgb(220, 38, 38))'
        }
      });

      // Prepare back side for capture
      backRef.current.style.cssText += captureStyle;
      backRef.current.style.transform = 'none';
      backRef.current.classList.remove('hidden');

      // Capture back
      const backImage = await htmlToImage.toJpeg(backRef.current, {
        ...options,
        style: {
          // Remove spread of options.style since it's not defined in the options type
          background: currentTheme === 'minimal' ? '#f0ece4' :
            currentTheme === 'dark' ? 'radial-gradient(ellipse at top left, rgb(17, 24, 39), rgb(31, 41, 55), rgb(0, 0, 0))' :
              'linear-gradient(to right, rgb(220, 38, 38), rgb(37, 99, 235))'
        }
      });

      // Download front
      const frontLink = document.createElement('a');
      frontLink.download = `${user.name.replace(/\s+/g, '_')}_business_card_front.jpg`;
      frontLink.href = frontImage;
      frontLink.click();

      // Small delay between downloads
      await new Promise(resolve => setTimeout(resolve, 500));

      // Download back
      const backLink = document.createElement('a');
      backLink.download = `${user.name.replace(/\s+/g, '_')}_business_card_back.jpg`;
      backLink.href = backImage;
      backLink.click();

      // Restore original states
      frontRef.current.style.visibility = originalFrontVisibility;
      backRef.current.style.visibility = originalBackVisibility;
      frontRef.current.style.display = originalFrontDisplay;
      backRef.current.style.display = originalBackDisplay;
      setShowFront(originalShowFront);

    } catch (error) {
      // console.error('Error generating business card images:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      <CardContainer>
        <div className="perspective-1000 w-full h-full">
          <div
            className={`relative transition-transform duration-500 transform-style-3d w-full h-full ${showFront ? "" : "rotate-y-180"
              }`}
          >
            {/* Front of card */}
            <div
              ref={frontRef}
              className={`absolute w-full h-full backface-hidden ${theme.front} rounded-xl p-6 shadow-lg ${theme.text.primary} ${showFront ? "" : "hidden"
                }`}
            >
              <div className="flex justify-between h-full pt-5">
                {/* Left column: identity + contact */}
                <div className="max-w-[62%] flex flex-col justify-between">
                  <div>
                    {/* Identity block */}
                    <div className="space-y-0.5">
                      <h3 className="text-lg font-bold tracking-wide font-sans">{user.name}</h3>
                      {user.title && <p className="text-xs italic opacity-90 font-sans">{user.title}</p>}
                      {user.company && <p className="text-sm font-semibold font-sans">{user.company}</p>}
                    </div>
                    {/* Address */}
                    {workAddress && (
                      <div className="relative mt-2">
                        <MapPin className={`h-4 w-4 absolute -left-6 top-1 ${theme.text.icon}`} />
                        <div className={`text-xs font-serif ${theme.text.address} pl-2`}>
                          <p className="break-words italic leading-relaxed">{workAddress}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact block */}
                  <div className={`space-y-1 text-xs font-mono ${theme.text.contact} mt-2`}>
                    {user.website && (
                      <p className="flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="tracking-tight">{user.website}</span>
                      </p>
                    )}
                    {user.workEmail && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="tracking-tight">{user.workEmail}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right column: photo top, notes bottom */}
                <div className="relative flex-1 ml-4">
                  <div className="absolute top-0 right-0">
                    {user.photo ? (
                      <Image
                        src={user.photo || "/placeholder.svg"}
                        alt={user.name}
                        width={96}
                        height={96}
                        className="rounded-full border-2 border-current"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="h-14 w-14" />
                      </div>
                    )}
                  </div>
                  {user.notes && (
                    <div className="absolute bottom-0 right-0 max-w-[70%] text-[11px] opacity-90 leading-snug text-right">
                      {user.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Back of card */}
            <div
              ref={backRef}
              className={`absolute w-full h-full backface-hidden ${theme.back} rounded-xl p-4 shadow-lg rotate-y-180 ${theme.text.primary} ${showFront ? "hidden" : ""
                }`}
            >
              <div className="relative w-full h-full">
                {/* Left content column - contrasting color */}
                <div className="absolute left-3 top-3 bottom-3 pr-2 w-[56%]">
                  <h3 className={`text-sm font-semibold font-sans leading-tight mb-1.5 ${theme.text.backLeft}`}>{user.name}</h3>
                  {homeAddress && (
                    <div className="relative mb-2">
                      <MapPin className={`h-3 w-3 absolute -left-4 top-0.5 ${theme.text.backLeft} opacity-60`} />
                      <div className={`text-xs font-serif pl-2 ${theme.text.backLeft} opacity-80`}>
                        <p className="break-words italic leading-snug">{homeAddress}</p>
                      </div>
                    </div>
                  )}

                  <div className={`space-y-1.5 text-[11px] font-mono ${theme.text.backLeft}`}>
                    {user.personalEmail && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3 flex-shrink-0 opacity-70" />
                        <span className="tracking-tight opacity-90">{user.personalEmail}</span>
                      </p>
                    )}
                    {user.homePhone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3 flex-shrink-0 opacity-70" />
                        <span className="tracking-tight opacity-90">{user.homePhone}</span>
                      </p>
                    )}
                    {/* Social handles */}
                    {(user.linkedin || user.twitter || user.facebook || user.instagram || user.youtube) && (
                      <div className="pt-1 space-y-0.5">
                        {user.linkedin && (
                          <p className="flex items-center gap-2">
                            <Linkedin className="h-3 w-3 flex-shrink-0 opacity-70" />
                            <span className="tracking-tight break-all opacity-90">{user.linkedin}</span>
                          </p>
                        )}
                        {user.twitter && (
                          <p className="flex items-center gap-2">
                            <Twitter className="h-3 w-3 flex-shrink-0 opacity-70" />
                            <span className="tracking-tight break-all opacity-90">{user.twitter}</span>
                          </p>
                        )}
                        {user.facebook && (
                          <p className="flex items-center gap-2">
                            <Facebook className="h-3 w-3 flex-shrink-0 opacity-70" />
                            <span className="tracking-tight break-all opacity-90">{user.facebook}</span>
                          </p>
                        )}
                        {user.instagram && (
                          <p className="flex items-center gap-2">
                            <Instagram className="h-3 w-3 flex-shrink-0 opacity-70" />
                            <span className="tracking-tight break-all opacity-90">{user.instagram}</span>
                          </p>
                        )}
                        {user.youtube && (
                          <p className="flex items-center gap-2">
                            <Youtube className="h-3 w-3 flex-shrink-0 opacity-70" />
                            <span className="tracking-tight break-all opacity-90">{user.youtube}</span>
                          </p>
                        )}
                      </div>
                    )}
                    {/* Notes removed on back side per spec */}
                  </div>
                </div>
                {/* Right column: logo top-right near edge, QR bottom-right smaller */}
                <div className="absolute right-0 top-0 bottom-0 w-[42%]">
                  {user.companyLogo && (
                    <div className="absolute top-1 right-1">
                      <Image
                        src={user.companyLogo || "/placeholder.svg"}
                        alt="Company Logo"
                        width={48}
                        height={48}
                        className="rounded-sm border border-white/30"
                      />
                    </div>
                  )}
                  {/* QR code - smaller, positioned at bottom right */}
                  <div className="absolute right-2 bottom-2">
                    <div className="w-28 h-28 bg-white rounded-lg shadow-lg flex items-center justify-center p-1">
                      {qrDataUrl ? (
                        <img
                          src={qrDataUrl}
                          alt="QR Code"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center rounded">
                          <div className="animate-pulse bg-white/20 w-20 h-20 rounded" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContainer>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9"
          onClick={downloadBusinessCard}
          disabled={isDownloading}
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9"
          onClick={() => {
            // Share functionality
            if (navigator.share) {
              navigator.share({
                title: `${user.name}'s Digital Business Card`,
                text: `Check out ${user.name}'s digital business card`,
                url: window.location.href
              })
            }
          }}
        >
          <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9"
          onClick={cycleTheme}
        >
          <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9"
          onClick={flipCard}
        >
          <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Flip</span>
        </Button>
      </div>
    </div>
  )
}

