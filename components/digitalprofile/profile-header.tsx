"use client"

import Image from "next/image"
import { User, Building2 } from "lucide-react"
import { ThemeType } from "./types"
import { Card, CardContent } from "@/components/ui/card"

interface ProfileHeaderProps {
  firstName: string
  middleName?: string
  lastName: string
  title?: string
  photo: string
  company: string
  logo?: string
  theme: ThemeType
}

export function ProfileHeader({
  firstName,
  middleName,
  lastName,
  title,
  photo,
  company,
  logo,
  theme
}: ProfileHeaderProps) {
  const fullName = [firstName, middleName, lastName].filter(Boolean).join(" ")

  if (theme === "minimal") {
    return (
      <div className="w-full group">
        <div className="flex items-center justify-between gap-8">
          <div className="space-y-3 flex-1">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {fullName}
            </h1>
            {title && (
              <p className="text-2xl text-slate-600 dark:text-slate-400 font-medium">{title}</p>
            )}
            <div className="flex items-center space-x-4 pt-2">
              {logo && (
                <div className="flex-shrink-0 transition-all duration-300 hover:scale-110">
                  <Image
                    src={logo}
                    alt={company}
                    width={120}
                    height={48}
                    className="h-12 w-auto object-contain filter drop-shadow-md"
                  />
                </div>
              )}
              <span className="text-xl text-slate-700 dark:text-slate-300 font-medium">{company}</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative h-40 w-40 overflow-hidden rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 p-1 shadow-xl transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-1">
              <div className="h-full w-full overflow-hidden rounded-xl">
                <Image
                  src={photo || "/placeholder.svg"}
                  alt={fullName}
                  width={160}
                  height={160}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (theme === "modern") {
    return (
      <div className="flex flex-col items-center text-center group">
        <div className="mb-6 transition-all duration-500 hover:scale-105">
          {logo && (
            <Image
              src={logo}
              alt={company}
              width={180}
              height={72}
              className="h-auto filter drop-shadow-lg transition-all duration-300 hover:drop-shadow-2xl"
            />
          )}
        </div>
        <div className="relative mb-6">
          {/* Animated gradient border */}
          <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative h-52 w-52 overflow-hidden rounded-full bg-white dark:bg-slate-900 p-2 shadow-2xl transition-all duration-500 hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]">
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-white/50 dark:border-slate-700/50">
              <Image
                src={photo || "/placeholder.svg"}
                alt={fullName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
              />
            </div>
          </div>
        </div>
        <h1 className="mb-2 text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {fullName}
        </h1>
        {title && <p className="text-xl text-slate-600 dark:text-slate-400 mb-2 font-medium">{title}</p>}
        <p className="text-lg text-slate-500 dark:text-slate-500 font-medium">{company}</p>
      </div>
    )
  }

  if (theme === "bold") {
    return (
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white shadow-2xl transition-all duration-500 hover:shadow-[0_25px_80px_-15px_rgba(99,102,241,0.5)] hover:scale-[1.02] group">
        <CardContent className="flex flex-col items-center p-8 md:flex-row md:items-center md:gap-10">
          <div className="relative mb-6 md:mb-0">
            {/* Glow effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 rounded-full blur-xl opacity-60 group-hover:opacity-100 transition duration-500"></div>
            <div className="relative h-56 w-56 overflow-hidden rounded-full border-4 border-white/30 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-500 group-hover:scale-110 group-hover:border-white/50 group-hover:shadow-[0_0_60px_rgba(255,255,255,0.5)]">
              <Image
                src={photo || "/placeholder.svg"}
                alt={fullName}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="mb-3 text-5xl font-extrabold md:text-6xl drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-2xl">
              {fullName}
            </h1>
            {title && <p className="text-2xl text-white/95 mb-6 font-medium drop-shadow-md">{title}</p>}
            <div className="mb-2 inline-block transition-all duration-300 hover:scale-110">
              {logo && (
                <Image
                  src={logo}
                  alt={company}
                  width={160}
                  height={64}
                  className="h-auto invert drop-shadow-lg"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:scale-[1.01] group">
      <CardContent className="flex flex-col items-center p-8 md:flex-row md:items-center md:gap-10">
        <div className="relative mb-6 md:mb-0">
          {/* Multi-layer shadow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
          <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-gradient-to-r from-blue-400 to-indigo-400 shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all duration-500 group-hover:scale-110 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)] group-hover:-translate-y-2">
            <div className="h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 p-1">
              <Image
                src={photo || "/placeholder.svg"}
                alt={fullName}
                fill
                className="object-cover rounded-full transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          </div>
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent transition-all duration-300">
            {fullName}
          </h1>
          {title && <p className="text-xl text-slate-600 dark:text-slate-400 mb-6 font-medium">{title}</p>}
          <div className="mb-2 inline-block transition-all duration-300 hover:scale-110">
            {logo && (
              <Image
                src={logo}
                alt={company}
                width={160}
                height={64}
                className="h-auto filter drop-shadow-md hover:drop-shadow-xl transition-all duration-300"
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
