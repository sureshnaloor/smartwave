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
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">{fullName}</h1>
            {title && (
              <p className="text-xl text-gray-600">{title}</p>
            )}
            <div className="flex items-center space-x-4">
              {logo && (
                <div className="flex-shrink-0">
                  <Image
                    src={logo}
                    alt={company}
                    width={100}
                    height={40}
                    className="h-10 w-auto object-contain"
                  />
                </div>
              )}
              <span className="text-lg text-gray-600">{company}</span>
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="h-24 w-24 overflow-hidden rounded-lg bg-gray-100">
              <Image 
                src={photo || "/placeholder.svg"} 
                alt={fullName} 
                width={96}
                height={96}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (theme === "modern") {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          <Image
            src={logo || "/placeholder.svg"}
            alt={company}
            width={150}
            height={60}
            className="h-auto"
          />
        </div>
        <div className="relative mb-4 h-40 w-40 overflow-hidden rounded-full border-4 border-white shadow-lg">
          <Image src={photo || "/placeholder.svg"} alt={fullName} fill className="object-cover" />
        </div>
        <h1 className="mb-1 text-3xl font-bold">{fullName}</h1>
        {title && <p className="text-lg text-muted-foreground mb-1">{title}</p>}
        <p className="text-muted-foreground">{company}</p>
      </div>
    )
  }

  if (theme === "bold") {
    return (
      <Card className="overflow-hidden border-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-xl">
        <CardContent className="flex flex-col items-center p-6 md:flex-row md:items-start md:gap-8">
          <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-white/20 md:mb-0 md:h-40 md:w-40">
            <Image src={photo || "/placeholder.svg"} alt={fullName} fill className="object-cover" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="mb-2 text-3xl font-bold md:text-4xl">{fullName}</h1>
            {title && <p className="text-xl text-white/90 mb-4">{title}</p>}
            <div className="mb-2">
              <Image
                src={logo || "/placeholder.svg"}
                alt={company}
                width={140}
                height={56}
                className="h-auto invert"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6 md:flex-row md:items-start md:gap-8">
        <div className="relative mb-4 h-32 w-32 overflow-hidden rounded-full md:mb-0 md:h-40 md:w-40">
          <Image src={photo || "/placeholder.svg"} alt={fullName} fill className="object-cover" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="mb-2 text-3xl font-bold">{fullName}</h1>
          {title && <p className="text-xl text-muted-foreground mb-4">{title}</p>}
          <div className="mb-2">
            <Image
              src={logo || "/placeholder.svg"}
              alt={company}
              width={140}
              height={56}
              className="h-auto"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
