"use client"

import { useCountry } from "@/context/CountryContext"
import { useSession } from "next-auth/react"
import { Globe } from "lucide-react"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getUserPreferences } from "@/app/_actions/user-preferences"

export default function CountrySelector() {
  const { data: session } = useSession()
  const { selectedCountry, setCountry, countries } = useCountry()

  const handleCountryChange = async (value: string) => {
    const country = countries.find(c => c.code === value)
    if (!country) return

    try {
      // First check user's existing data
      const userPrefs = await getUserPreferences()
      
      if (userPrefs.orders?.some(order => order.status === "pending" || order.status === "processing")) {
        toast.error("Cannot change country while you have orders being processed")
        return
      }

      if (userPrefs.wishlist?.length > 0) {
        toast.error("Please clear your wishlist before changing country")
        return
      }

      if (userPrefs.cart?.length > 0) {
        toast.error("Please clear your cart before changing country")
        return
      }

      // If all checks pass, update the country
      await setCountry(country)
    } catch (error) {
      toast.error("Failed to update country")
    }
  }

  if (!session) return null

  return (
    <div className="relative">
      <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[180px] bg-transparent border-none">
          <SelectValue>
            <span className="flex items-center gap-2">
              <span>{selectedCountry.flag}</span>
              <span>{selectedCountry.name}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <span className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Globe className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
    </div>
  )
}