export type ThemeType = "classic" | "modern" | "minimal" | "bold" | "light" | "dark"
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
  // Contact information
  workPhone: string
  workEmail: string
  fax?: string
  homePhone: string
  personalEmail: string
  mobile: string
  // Address information
  workStreet: string
  workDistrict: string
  workCity: string
  workState: string
  workZipcode: string
  workCountry: string
  homeStreet: string
  homeDistrict: string
  homeCity: string
  homeState: string
  homeZipcode: string
  homeCountry: string
  // Social media links
  linkedin?: string
  twitter?: string
  facebook?: string
  instagram?: string
  github?: string
  // Other information
  dates: DatesInfo
  locations: LocationsInfo
  notes: string
}

export interface BaseComponentProps {
  theme: ThemeType
} 