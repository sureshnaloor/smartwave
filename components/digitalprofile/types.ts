export type ThemeType = "classic" | "modern" | "minimal" | "bold"
export type BackgroundType = "gradient" | "pattern" | "solid" | "image"

export interface AddressInfo {
  address: string
  city: string
  state: string
  country: string
  zip: string
  phone: string
  email: string
}

export interface WorkInfo extends AddressInfo {
  position?: string
}

export interface HomeInfo extends AddressInfo {}

export interface DatesInfo {
  birthday?: string
  workAnniversary?: string
  weddingAnniversary?: string
}

export interface LocationInfo {
  lat: number
  lng: number
  label: string
}

export interface LocationsInfo {
  home?: LocationInfo
  work?: LocationInfo
}

export interface SocialInfo {
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  github?: string
  [key: string]: string | undefined
}

export interface ProfileData {
  firstName: string
  middleName?: string
  lastName: string
  title?: string
  photo: string
  company: string
  companyLogo?: string
  work: WorkInfo
  home: HomeInfo
  dates: DatesInfo
  locations: LocationsInfo
  about: string
  social: SocialInfo
}

export interface BaseComponentProps {
  theme: ThemeType
} 