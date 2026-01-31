"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Globe, RotateCw, MapPin, Palette, Download, Share2, Edit2, Linkedin, Twitter, Facebook, Instagram, Youtube, QrCode, Wallet } from "lucide-react"
import { ProfileData } from "@/app/_actions/profile"
import QRCode from "qrcode"
import * as htmlToImage from 'html-to-image'
import { useTheme } from '@/context/ThemeContext'

// Standard business card dimensions (3.5 x 2 inches) at 300 DPI for print quality
const CARD_WIDTH = 1050 // 3.5 inches * 300 DPI
const CARD_HEIGHT = 600 // 2 inches * 300 DPI

type Theme = 'smartwave' | 'minimal' | 'onyx' | 'modern' | 'professional' | 'creative'

const themeStyles = {
  smartwave: {
    front: 'bg-gradient-to-b from-red-200 to-blue-600 dark:from-slate-800 dark:to-blue-900',
    back: 'bg-gradient-to-b from-red-200 to-blue-600 dark:from-slate-800 dark:to-blue-900',
    text: {
      primary: '!text-white',
      address: '!text-blue-100',
      contact: '!text-orange-100',
      icon: '!text-white/60',
      backLeft: '!text-gray-900 dark:!text-white' // Contrasting color for back left content
    },
    buttonText: '!text-white/70 hover:!text-white',
    backButtonText: 'bg-white/90 !text-gray-800 hover:bg-white dark:bg-slate-700 dark:!text-white',
  },
  minimal: {
    front: 'bg-[#f5f1e8] dark:bg-slate-600',
    back: 'bg-[#ede9e0] dark:bg-slate-600',
    text: {
      primary: '!text-gray-900 dark:!text-white',
      address: '!text-blue-900 dark:!text-blue-200',
      contact: '!text-gray-900 dark:!text-gray-300',
      icon: '!text-gray-700 dark:!text-gray-400',
      backLeft: '!text-gray-900 dark:!text-white'
    },
    buttonText: '!text-gray-700 hover:!text-gray-900 dark:!text-gray-300 dark:hover:!text-white',
    backButtonText: 'bg-gray-900 !text-white hover:bg-black dark:bg-slate-700 dark:hover:bg-slate-600',
  },
  onyx: {
    front: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black',
    back: 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-800 to-black',
    text: {
      primary: '!text-white',
      address: '!text-emerald-300',
      contact: '!text-purple-300',
      icon: '!text-gray-300',
      backLeft: '!text-white'
    },
    buttonText: '!text-gray-300 hover:!text-white',
    backButtonText: 'bg-gray-700 !text-gray-200 hover:bg-gray-600',
  },
  modern: {
    front: 'bg-white dark:bg-slate-900',
    back: 'bg-slate-900 dark:bg-black',
    text: {
      primary: '!text-slate-900 dark:!text-white',
      address: '!text-slate-700 dark:!text-slate-300',
      contact: '!text-slate-700 dark:!text-slate-300',
      icon: '!text-slate-600 dark:!text-slate-400',
      backLeft: '!text-slate-100'
    },
    buttonText: '!text-slate-600 hover:!text-slate-900 dark:!text-slate-400 dark:hover:!text-white',
    backButtonText: 'bg-slate-800 !text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600',
  },
  professional: {
    front: 'bg-white border-[12px] border-blue-950 dark:bg-slate-900 dark:border-slate-800',
    back: 'bg-blue-950 border-[12px] border-blue-900 dark:bg-black dark:border-slate-900',
    text: {
      primary: '!text-blue-950 dark:!text-white',
      address: '!text-blue-800 dark:!text-blue-300',
      contact: '!text-blue-800 dark:!text-blue-300',
      icon: '!text-blue-600 dark:!text-blue-400',
      backLeft: '!text-blue-100'
    },
    buttonText: '!text-blue-900 hover:!text-blue-700 dark:!text-blue-300 dark:hover:!text-white',
    backButtonText: 'bg-blue-900 !text-white hover:bg-blue-800 dark:bg-slate-800 dark:hover:bg-slate-700',
  },
  creative: {
    front: 'bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500',
    back: 'bg-gray-900',
    text: {
      primary: '!text-white',
      address: '!text-white/90',
      contact: '!text-white/90',
      icon: '!text-white/70',
      backLeft: '!text-white'
    },
    buttonText: '!text-white/80 hover:!text-white',
    backButtonText: 'bg-white/20 !text-white hover:bg-white/30',
  },
}

interface DigitalCardProps {
  user: ProfileData
}

// Add a new CardContainer component
function CardContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[1344px] mx-auto px-4 sm:px-0">
      <div
        className="relative w-full max-w-[600px] sm:max-w-full mx-auto"
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
  const { theme: globalTheme } = useTheme()
  const [showFront, setShowFront] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<Theme>('smartwave')
  const [qrDataUrl, setQrDataUrl] = useState<string>("")
  const [isDownloading, setIsDownloading] = useState(false)
  const [os, setOs] = useState<"ios" | "android" | "other">("other")

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase()
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setOs("ios")
    } else if (/android/.test(userAgent)) {
      setOs("android")
    }
  }, [])

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
    const themes: Theme[] = ['smartwave', 'minimal', 'onyx', 'modern', 'professional', 'creative']
    const currentIndex = themes.indexOf(currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    setCurrentTheme(themes[nextIndex])
  }

  const cardStyles = themeStyles[currentTheme]

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
      `EMAIL;type=WORK:${user.workEmail || ''}`,
      `EMAIL;type=HOME:${user.personalEmail || ''}`,
      `TEL;type=WORK:${user.workPhone || ''}`,
      `TEL;type=CELL:${user.mobile || ''}`,
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
        quality: 1.0,
        pixelRatio: 2, // Higher pixel ratio for better quality
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        fontEmbedCSS: '', // Allow font embedding
      }

      // Wait for fonts to load
      await document.fonts.ready;

      // Capture front
      const frontImage = await htmlToImage.toJpeg(frontRef.current, {
        ...options,
        // Remove manual background override to let CSS handle it
      });

      // Capture back
      const backImage = await htmlToImage.toJpeg(backRef.current, {
        ...options,
        // Remove manual background override to let CSS handle it
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
        <div className="perspective-1000 w-full h-full bg-white dark:bg-gray-900 rounded-xl">
          <div
            className={`relative transition-transform duration-500 transform-style-3d w-full h-full ${showFront ? "" : "rotate-y-180"
              }`}
          >
            {/* Front of card */}
            <div
              ref={frontRef}
              className={`absolute w-full h-full backface-hidden ${cardStyles.front} rounded-xl shadow-lg ${cardStyles.text.primary} ${showFront ? "" : "hidden"
                } ${['smartwave', 'minimal', 'onyx'].includes(currentTheme) ? 'p-8' : 'overflow-hidden'}`}
            >
              {['smartwave', 'minimal', 'onyx'].includes(currentTheme) && (
                <div className="flex justify-between h-full items-center py-2">
                  {/* Left column: identity + contact */}
                  <div className="max-w-[62%] flex flex-col justify-center">
                    <div>
                      {/* Identity block */}
                      <div className="space-y-0.5">
                        <h3 className="font-bold tracking-wide font-sans leading-tight">{user.name}</h3>
                        {user.title && <p className="text-[11px] italic opacity-90 font-sans">{user.title}</p>}
                        {user.company && <p className="text-xs font-semibold font-sans">{user.company}</p>}
                      </div>
                      {/* Address */}
                      {workAddress && (
                        <div className="relative mt-1.5">
                          <MapPin className={`h-3.5 w-3.5 absolute -left-6 top-0.5 ${cardStyles.text.icon}`} />
                          <div className={`text-[11px] font-serif ${cardStyles.text.address} pl-2`}>
                            <p className="break-words italic leading-tight line-clamp-2">{workAddress}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact block */}
                    <div className={`space-y-0.5 text-[11px] font-mono ${cardStyles.text.contact} mt-1.5`}>
                      {user.website && (
                        <p className="flex items-center gap-1.5">
                          <Globe className="h-3 w-3 flex-shrink-0" />
                          <span className="tracking-tight truncate">{user.website}</span>
                        </p>
                      )}
                      {user.workEmail && (
                        <p className="flex items-center gap-1.5">
                          <Mail className="h-3 w-3 flex-shrink-0" />
                          <span className="tracking-tight truncate">{user.workEmail}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right column: photo top, notes bottom */}
                  <div className="relative flex-1 ml-4 flex items-center justify-end">
                    <div>
                      {user.photo ? (
                        <Image
                          src={user.photo || "/placeholder.svg"}
                          alt={user.name}
                          width={85}
                          height={85}
                          className="rounded-full border-2 border-current"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                          <User className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentTheme === 'modern' && (
                <div className="flex h-full w-full">
                  {/* Left Sidebar */}
                  <div className="w-[38%] h-full bg-slate-100 dark:bg-slate-900 p-5 flex flex-col justify-between text-white relative">
                    <div className="relative z-10">
                      {user.photo ? (
                        <Image
                          src={user.photo}
                          alt={user.name}
                          width={85}
                          height={85}
                          className="rounded-full border-3 border-slate-700 mb-3 shadow-xl"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-3">
                          <User className="h-10 w-10 text-slate-400" />
                        </div>
                      )}
                      <div className="space-y-2 mt-3">
                        {user.workEmail && (
                          <div className="flex items-center gap-1.5 text-[8px] text-slate-200 font-medium">
                            <Mail className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                            <span className="truncate break-all">{user.workEmail}</span>
                          </div>
                        )}
                        {user.mobile && (
                          <div className="flex items-center gap-1.5 text-[8px] text-slate-200 font-medium">
                            <Phone className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                            <span className="break-all">{user.mobile}</span>
                          </div>
                        )}
                        {user.website && (
                          <div className="flex items-center gap-1.5 text-[8px] text-slate-200 font-medium">
                            <Globe className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                            <span className="truncate break-all">{user.website}</span>
                          </div>
                        )}
                        {workAddress && (
                          <div className="flex items-start gap-1.5 text-[8px] text-slate-200 font-medium">
                            <MapPin className="h-2.5 w-2.5 shrink-0 mt-0.5 text-slate-400" />
                            <span className="leading-tight line-clamp-2">{workAddress}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black/40 to-transparent"></div>
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 p-6 py-8 flex flex-col justify-center bg-white dark:bg-slate-900 text-slate-950 dark:text-white">
                    <div className="mb-auto pt-1">
                      {user.companyLogo && (
                        <Image src={user.companyLogo} alt="Logo" width={35} height={35} className="mb-3" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-950 dark:text-white tracking-tight mb-0.5">{user.name}</h3>
                      <p className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest mb-2">{user.title}</p>
                      <div className="w-10 h-0.5 bg-blue-700 mb-2"></div>
                      {user.company && <p className="text-sm font-serif text-slate-800 dark:text-slate-300 font-semibold line-clamp-1">{user.company}</p>}
                    </div>
                    <div className="mt-auto">
                      {/* Additional info if needed */}
                    </div>
                  </div>
                </div>
              )}

              {currentTheme === 'professional' && (
                <div className="h-full w-full flex flex-col relative p-6 py-6 bg-white dark:bg-slate-900 text-blue-950 dark:text-white">
                  {/* Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-2.5 bg-blue-950"></div>

                  <div className="flex-1 flex flex-col items-center justify-center text-center z-10 -mt-2">
                    {user.companyLogo ? (
                      <Image src={user.companyLogo} alt="Logo" width={38} height={38} className="mb-2" />
                    ) : (
                      <div className="mb-2 p-1.5 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-900" />
                      </div>
                    )}

                    <h3 className="text-xl font-serif font-bold text-blue-950 dark:text-white mb-0.5 leading-tight">{user.name}</h3>
                    <p className="text-[10px] font-sans font-bold text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-3">{user.title}</p>

                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-left w-full max-w-[90%] mx-auto">
                      {user.workEmail && (
                        <div className="flex items-center gap-1.5">
                          <div className="p-0.5 bg-blue-100 rounded-full shrink-0">
                            <Mail className="h-2.5 w-2.5 text-blue-800" />
                          </div>
                          <span className="text-[9px] font-semibold text-blue-950 dark:text-white/90 truncate">{user.workEmail}</span>
                        </div>
                      )}
                      {user.mobile && (
                        <div className="flex items-center gap-1.5">
                          <div className="p-0.5 bg-blue-100 rounded-full shrink-0">
                            <Phone className="h-2.5 w-2.5 text-blue-800" />
                          </div>
                          <span className="text-[9px] font-semibold text-blue-950 dark:text-white/90">{user.mobile}</span>
                        </div>
                      )}
                      {user.website && (
                        <div className="flex items-center gap-1.5">
                          <div className="p-0.5 bg-blue-100 rounded-full shrink-0">
                            <Globe className="h-2.5 w-2.5 text-blue-800" />
                          </div>
                          <span className="text-[9px] font-semibold text-blue-950 dark:text-white/90 truncate">{user.website}</span>
                        </div>
                      )}
                      {user.company && (
                        <div className="flex items-center gap-1.5">
                          <div className="p-0.5 bg-blue-100 rounded-full shrink-0">
                            <MapPin className="h-2.5 w-2.5 text-blue-800" />
                          </div>
                          <span className="text-[9px] font-semibold text-blue-950 dark:text-white/90 truncate">{user.company}</span>
                        </div>
                      )}
                      {workAddress && (
                        <div className="flex items-start gap-1.5 col-span-2">
                          <div className="p-0.5 bg-blue-100 rounded-full shrink-0 mt-0.5">
                            <MapPin className="h-2.5 w-2.5 text-blue-800" />
                          </div>
                          <span className="text-[9px] font-semibold text-blue-950 dark:text-white/90 leading-tight line-clamp-1">{workAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-2.5 bg-blue-950"></div>
                </div>
              )}

              {currentTheme === 'creative' && (
                <div className="h-full w-full relative flex items-center justify-center p-8 py-10 overflow-hidden !text-white">
                  {/* Abstract Background Shapes */}
                  <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-[-20%] left-[-10%] w-96 h-96 bg-black/20 rounded-full blur-3xl"></div>

                  {/* Glass Card Content - Darkened background for better contrast */}
                  <div className="w-full max-h-full bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/20 shadow-2xl flex items-center gap-5 relative z-10">
                    <div className="shrink-0 relative flex flex-col items-center gap-3">
                      {user.photo ? (
                        <Image
                          src={user.photo}
                          alt={user.name}
                          width={85}
                          height={85}
                          className="rounded-xl shadow-lg rotate-2 border-2 border-white/50"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center rotate-2 border-2 border-white/50">
                          <User className="h-9 w-9 text-white" />
                        </div>
                      )}
                      <div className="bg-white/90 p-1.5 rounded-lg backdrop-blur-sm shadow-lg">
                        <QrCode className="h-6 w-6 text-black" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-center h-full text-white drop-shadow-sm">
                      <h3 className="text-xl font-bold mb-0.5 tracking-tight leading-tight">{user.name}</h3>
                      <p className="text-xs font-semibold text-white/90 mb-3 uppercase tracking-wide">{user.title}</p>

                      <div className="space-y-2">
                        {user.workEmail && (
                          <p className="text-[9px] font-medium flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-orange-400 rounded-full shrink-0 shadow-sm"></span>
                            <span className="truncate">{user.workEmail}</span>
                          </p>
                        )}
                        {user.mobile && (
                          <p className="text-[9px] font-medium flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-orange-400 rounded-full shrink-0 shadow-sm"></span>
                            <span>{user.mobile}</span>
                          </p>
                        )}
                        {user.website && (
                          <p className="text-[9px] font-medium flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-orange-400 rounded-full shrink-0 shadow-sm"></span>
                            <span className="truncate">{user.website}</span>
                          </p>
                        )}
                        {workAddress && (
                          <p className="text-[9px] font-medium flex items-start gap-1.5">
                            <span className="w-1 h-1 bg-orange-400 rounded-full shrink-0 mt-1 shadow-sm"></span>
                            <span className="leading-tight line-clamp-1">{workAddress}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Back of card */}
            <div
              ref={backRef}
              className={`absolute w-full h-full backface-hidden ${cardStyles.back} rounded-xl shadow-lg rotate-y-180 ${cardStyles.text.primary} ${showFront ? "hidden" : ""
                } ${['smartwave', 'minimal', 'onyx'].includes(currentTheme) ? 'p-6' : 'overflow-hidden'}`}
            >
              {['smartwave', 'minimal', 'onyx'].includes(currentTheme) && (
                <div className="relative w-full h-full">
                  {/* Left content column - contrasting color */}
                  <div className="absolute left-3 top-3 bottom-3 pr-2 w-[56%]">
                    <h3 className={`text-sm font-semibold font-sans leading-tight mb-1.5 ${cardStyles.text.backLeft}`}>{user.name}</h3>
                    {homeAddress && (
                      <div className="relative mb-2">
                        <MapPin className={`h-3 w-3 absolute -left-4 top-0.5 ${cardStyles.text.backLeft} opacity-60`} />
                        <div className={`text-xs font-serif pl-2 ${cardStyles.text.backLeft} opacity-80`}>
                          <p className="break-words italic leading-snug">{homeAddress}</p>
                        </div>
                      </div>
                    )}

                    <div className={`space-y-1.5 text-[11px] font-mono ${cardStyles.text.backLeft}`}>
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
                  <div className="absolute right-0 top-0 bottom-0 w-[42%] flex flex-col items-end justify-between gap-4 p-3">
                    {user.companyLogo && (
                      <div>
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
                    <div>
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
              )}

              {currentTheme === 'modern' && (
                <div className="flex h-full w-full">
                  {/* Left Sidebar (Dark) */}
                  <div className="w-[35%] h-full bg-slate-900 p-6 flex flex-col justify-end text-white relative">
                    <div className="absolute top-6 left-6">
                      <div className="w-12 h-1 bg-blue-500"></div>
                    </div>
                    <div className="space-y-4 text-xs opacity-80">
                      <p className="font-light tracking-wide">SCAN TO SAVE CONTACT</p>
                    </div>
                  </div>

                  {/* Right Content (White) */}
                  <div className="flex-1 p-8 flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 relative">
                    <div className="w-48 h-48 bg-white dark:bg-slate-800 p-2 shadow-xl rounded-xl">
                      {qrDataUrl && (
                        <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                      )}
                    </div>
                    <p className="mt-4 text-slate-500 text-sm font-medium tracking-widest">SMARTWAVE</p>
                  </div>
                </div>
              )}

              {currentTheme === 'professional' && (
                <div className="h-full w-full flex flex-col items-center justify-center p-8 relative bg-blue-950 text-white">
                  <div className="absolute inset-4 border border-blue-800/30"></div>

                  <div className="flex flex-row items-center gap-12 z-10">
                    <div className="text-left space-y-2">
                      <h4 className="text-xl font-serif text-white/90">Connect with me</h4>
                      <p className="text-blue-200 text-sm max-w-[200px]">Scan the QR code to instantly save my contact details to your phone.</p>
                    </div>

                    <div className="w-40 h-40 bg-white p-2 rounded-lg shadow-2xl">
                      {qrDataUrl && (
                        <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain" />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {currentTheme === 'creative' && (
                <div className="h-full w-full flex items-center justify-center p-8 relative bg-gray-900 text-white">
                  {/* Background Elements */}
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                  <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 flex items-center justify-between gap-8">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-orange-400 to-fuchsia-500 flex items-center justify-center">
                        <Share2 className="text-white h-6 w-6" />
                      </div>
                      <h4 className="text-2xl font-bold text-white">Let's<br />Connect</h4>
                    </div>

                    <div className="w-40 h-40 bg-white rounded-2xl p-2 shadow-inner">
                      {qrDataUrl && (
                        <img src={qrDataUrl} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContainer>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={downloadBusinessCard}
          disabled={isDownloading}
        >
          <Download className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Download</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={async () => {
            if (!navigator.share) return;
            try {
              await navigator.share({
                title: `${user.name}'s Digital Business Card`,
                text: `Check out ${user.name}'s digital business card`,
                url: window.location.href
              });
            } catch (err) {
              if (err instanceof Error && err.name === "AbortError") return;
              console.warn("Share failed:", err);
            }
          }}
        >
          <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={cycleTheme}
        >
          <Palette className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Theme</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs sm:text-sm flex items-center justify-center gap-1 h-8 sm:h-9 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={flipCard}
        >
          <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Flip</span>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {(os === "ios" || os === "other") && (
          <a
            href={user.shorturl ? `/api/wallet/apple?shorturl=${user.shorturl}` : "/api/wallet/apple"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-12 bg-black hover:bg-zinc-900 text-white rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 no-underline decoration-0"
          >
            <Wallet className="h-5 w-5 text-white" />
            <div className="flex flex-col items-start leading-none text-white">
              <span className="text-[10px] opacity-70 uppercase font-bold tracking-wider">Add to</span>
              <span className="text-base font-semibold">Apple Wallet</span>
            </div>
          </a>
        )}

        {(os === "android" || os === "other") && (
          <Button
            className="flex-1 h-12 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95"
            onClick={() => window.open(user.shorturl ? `/api/wallet/google?shorturl=${user.shorturl}` : "/api/wallet/google", "_blank")}
          >
            <Wallet className="h-5 w-5" />
            <div className="flex flex-col items-start leading-none">
              <span className="text-[10px] opacity-70">Save to</span>
              <span className="text-base font-semibold">Google Wallet</span>
            </div>
          </Button>
        )}
      </div>
    </div>
  )
}

