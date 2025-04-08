"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Globe, RotateCw, MapPin, Palette, Download, Share2, Edit2 } from "lucide-react"
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
      icon: 'text-white/60'
    },
    buttonText: 'text-white/70 hover:text-white',
  },
  minimal: {
    front: 'bg-[#f7f3eb]', // Matte cream color
    back: 'bg-[#f0ece4]', // Slightly darker cream for back
    text: {
      primary: 'text-gray-800',
      address: 'text-blue-800',
      contact: 'text-gray-700',
      icon: 'text-gray-500'
    },
    buttonText: 'text-gray-500 hover:text-gray-700',
  },
  dark: {
    front: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black',
    back: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black',
    text: {
      primary: 'text-gray-100',
      address: 'text-emerald-300',
      contact: 'text-purple-300',
      icon: 'text-gray-500'
    },
    buttonText: 'text-gray-300 hover:text-white',
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
            className={`relative transition-transform duration-500 transform-style-3d w-full h-full ${
              showFront ? "" : "rotate-y-180"
            }`}
          >
            {/* Front of card */}
            <div
              ref={frontRef}
              className={`absolute w-full h-full backface-hidden ${theme.front} rounded-xl p-6 shadow-lg ${theme.text.primary} ${
                showFront ? "" : "hidden"
              }`}
            >
              <div className="flex justify-between h-full">
                <div className="max-w-[65%] flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold font-sans mb-2">{user.name}</h3>
                    <p className="text-lg opacity-90 font-sans">{user.title}</p>
                    <p className="text-xl font-semibold mt-2 font-sans mb-3">{user.company}</p>
                    <div className="relative mt-2">
                      <MapPin className={`h-4 w-4 absolute -left-6 top-1 ${theme.text.icon}`} />
                      <div className={`text-base font-serif ${theme.text.address} pl-2`}>
                        <p className="break-words italic leading-relaxed">{workAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className={`space-y-1.5 text-sm font-mono ${theme.text.contact} mt-3`}>
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <span className="tracking-tight">{user.workEmail}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 flex-shrink-0" />
                      <span className="tracking-tight">{user.workPhone}</span>
                    </p>
                    {user.mobile && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="tracking-tight">{user.mobile}</span>
                      </p>
                    )}
                    {user.website && (
                      <p className="flex items-center gap-2">
                        <Globe className="h-4 w-4 flex-shrink-0" />
                        <span className="tracking-tight">{user.website}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end justify-start">
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
              </div>

              <div className="absolute bottom-3 right-3 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={theme.buttonText}
                  onClick={cycleTheme}
                >
                  <Palette className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={theme.buttonText}
                  onClick={flipCard}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Back of card */}
            <div
              ref={backRef}
              className={`absolute w-full h-full backface-hidden ${theme.back} rounded-xl p-6 shadow-lg rotate-y-180 ${theme.text.primary} ${
                showFront ? "hidden" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-bold font-sans">{user.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold font-sans">{user.company}</p>
                  <p className="text-sm opacity-90 font-sans mt-1">{user.title}</p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-start">
                <div className="max-w-[45%]">
                  {homeAddress && (
                    <div className="relative mb-3">
                      <MapPin className={`h-3 w-3 absolute -left-5 top-1 ${theme.text.icon}`} />
                      <div className={`text-sm font-serif ${theme.text.address} pl-2`}>
                        <p className="break-words italic leading-relaxed">{homeAddress}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className={`space-y-2 text-xs font-mono ${theme.text.contact}`}>
                    {user.personalEmail && (
                      <p className="flex items-center gap-2">
                        <Mail className="h-3 w-3 flex-shrink-0" />
                        <span className="tracking-tight">{user.personalEmail}</span>
                      </p>
                    )}
                    {user.homePhone && (
                      <p className="flex items-center gap-2">
                        <Phone className="h-3 w-3 flex-shrink-0" />
                        <span className="tracking-tight">{user.homePhone}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="w-32 h-32 relative mt-1">
                  {qrDataUrl ? (
                    <div className="w-full h-full bg-white rounded-lg shadow-lg flex items-center justify-center p-1">
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="w-full h-full"
                        onError={(e) => {
                          // console.error('QR code image failed to load')
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center rounded">
                      <div className="animate-pulse bg-white/20 w-24 h-24 rounded" />
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute bottom-2 right-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={theme.buttonText}
                  onClick={cycleTheme}
                >
                  <Palette className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={theme.buttonText}
                  onClick={flipCard}
                >
                  <RotateCw className="h-3 w-3" />
                </Button>
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

