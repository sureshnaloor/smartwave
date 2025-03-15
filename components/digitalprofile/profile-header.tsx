import Image from "next/image"
import { User, Building2 } from "lucide-react"
import { ThemeType } from "./types"

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

  return (
    <div className="flex items-center gap-6 bg-white rounded-xl p-6 shadow-sm">
      <div className="shrink-0">
        {photo ? (
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Image
              src={photo}
              alt={fullName}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      <div className="flex-grow">
        <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
        {title && <p className="text-gray-600 mt-1">{title}</p>}
        <div className="flex items-center mt-2 text-gray-600">
          <Building2 className="h-5 w-5 mr-2" />
          <span>{company}</span>
        </div>
      </div>

      {logo && (
        <div className="shrink-0 w-16 h-16">
          <Image
            src={logo}
            alt={company}
            width={64}
            height={64}
            className="object-contain"
          />
        </div>
      )}
    </div>
  )
}
