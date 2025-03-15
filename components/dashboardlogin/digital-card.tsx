"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Globe, RotateCw, QrCode, MapPin, Palette } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ProfileData } from "@/app/actions/profile"

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
    front: 'bg-white',
    back: 'bg-gray-50',
    text: {
      primary: 'text-gray-900',
      address: 'text-blue-700',
      contact: 'text-gray-600',
      icon: 'text-gray-400'
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

export default function DigitalCard({ user }: DigitalCardProps) {
  const [showFront, setShowFront] = useState(true)
  const [currentTheme, setCurrentTheme] = useState<Theme>('smartwave')

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

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <div
        className={`relative transition-transform duration-500 transform-style-3d w-full h-64 ${
          showFront ? "" : "rotate-y-180"
        }`}
      >
        {/* Front of card */}
        <div
          className={`absolute w-full h-full backface-hidden ${theme.front} rounded-xl p-8 shadow-lg ${theme.text.primary} ${
            showFront ? "" : "hidden"
          }`}
        >
          <div className="flex justify-between">
            <div className="max-w-[60%]">
              <h3 className="text-xl font-bold font-sans">{user.name}</h3>
              <p className="text-sm opacity-90 font-sans">{user.title}</p>
              <p className="text-lg font-semibold mt-1 font-sans mb-2">{user.company}</p>
              <div className="relative">
                <MapPin className={`h-3 w-3 absolute -left-4 top-0.5 ${theme.text.icon}`} />
                <div className={`text-xs font-serif ${theme.text.address} pl-1`}>
                  <p className="break-words italic leading-relaxed">{workAddress}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-4">
              {user.photo ? (
                <Image
                  src={user.photo || "/placeholder.svg"}
                  alt={user.name}
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-current"
                />
              ) : (
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8" />
                </div>
              )}

              <div className={`space-y-1.5 text-xs font-mono ${theme.text.contact}`}>
                <p className="flex items-center justify-end gap-2">
                  <span className="tracking-tight">{user.workEmail}</span>
                  <Mail className="h-4 w-4 flex-shrink-0" />
                </p>
                <p className="flex items-center justify-end gap-2">
                  <span className="tracking-tight">{user.workPhone}</span>
                  <Phone className="h-4 w-4 flex-shrink-0" />
                </p>
                <p className="flex items-center justify-end gap-2">
                  <span className="tracking-tight">{user.mobile}</span>
                  <Phone className="h-4 w-4 flex-shrink-0" />
                </p>
                {user.website && (
                  <p className="flex items-center justify-end gap-2">
                    <span className="tracking-tight">{user.website}</span>
                    <Globe className="h-4 w-4 flex-shrink-0" />
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 flex gap-2">
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
          className={`absolute w-full h-full backface-hidden ${theme.back} rounded-xl p-8 shadow-lg rotate-y-180 ${theme.text.primary} ${
            showFront ? "hidden" : ""
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold font-sans">{user.name}</h3>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold font-sans">{user.company}</p>
              <p className="text-sm opacity-90 font-sans">{user.title}</p>
            </div>
          </div>

          <div className="mt-8 flex justify-between items-start">
            <div className="max-w-[50%]">
              {homeAddress && (
                <div className="relative mb-4">
                  <MapPin className={`h-3 w-3 absolute -left-4 top-0.5 ${theme.text.icon}`} />
                  <div className={`text-xs font-serif ${theme.text.address} pl-1`}>
                    <p className="break-words italic leading-relaxed">{homeAddress}</p>
                  </div>
                </div>
              )}
              
              <div className={`space-y-1.5 text-xs font-mono ${theme.text.contact}`}>
                {user.personalEmail && (
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 flex-shrink-0" />
                    <span className="tracking-tight">{user.personalEmail}</span>
                  </p>
                )}
                {user.homePhone && (
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 flex-shrink-0" />
                    <span className="tracking-tight">{user.homePhone}</span>
                  </p>
                )}
              </div>
            </div>

            <div className="w-32 h-32">
              <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center rounded">
                <QrCode className={`h-16 w-16 ${theme.text.icon}`} />
              </div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 flex gap-2">
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
      </div>
    </div>
  )
}

