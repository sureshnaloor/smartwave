import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Home, MapPin } from "lucide-react"
import { ThemeType } from "./types"

interface LocationsProps {
  // Work address
  workStreet: string
  workDistrict: string
  workCity: string
  workState: string
  workZipcode: string
  workCountry: string
  // Home address
  homeStreet: string
  homeDistrict: string
  homeCity: string
  homeState: string
  homeZipcode: string
  homeCountry: string
  theme: ThemeType
}

export function Locations({
  workStreet,
  workDistrict,
  workCity,
  workState,
  workZipcode,
  workCountry,
  homeStreet,
  homeDistrict,
  homeCity,
  homeState,
  homeZipcode,
  homeCountry,
  theme
}: LocationsProps) {
  const formatAddress = (
    street: string,
    district: string,
    city: string,
    state: string,
    zipcode: string,
    country: string
  ) => {
    const parts = [street, district, city, state, country, zipcode].filter(Boolean)
    return parts.join(", ")
  }

  if (theme === "minimal") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-xl font-semibold">Locations</h2>
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="work" className="flex-1">
                Work
              </TabsTrigger>
              <TabsTrigger value="home" className="flex-1">
                Home
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatAddress(
                  workStreet,
                  workDistrict,
                  workCity,
                  workState,
                  workZipcode,
                  workCountry
                )}</p>
              </div>
            </TabsContent>
            <TabsContent value="home" className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatAddress(
                  homeStreet,
                  homeDistrict,
                  homeCity,
                  homeState,
                  homeZipcode,
                  homeCountry
                )}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  if (theme === "modern" || theme === "bold")
    return (
      <Card className={theme === "bold" ? "border-2 border-indigo-200" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="work">
                <Building className="mr-2 h-4 w-4" />
                Work
              </TabsTrigger>
              <TabsTrigger value="home">
                <Home className="mr-2 h-4 w-4" />
                Home
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <p>{formatAddress(
                    workStreet,
                    workDistrict,
                    workCity,
                    workState,
                    workZipcode,
                    workCountry
                  )}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="home" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <p>{formatAddress(
                    homeStreet,
                    homeDistrict,
                    homeCity,
                    homeState,
                    homeZipcode,
                    homeCountry
                  )}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )

  // Default "classic" theme
  return (
    <Card>
      <CardHeader>
        <CardTitle>Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 flex items-center font-medium">
              <Building className="mr-2 h-4 w-4" />
              Work
            </h3>
            <div className="space-y-2 pl-6">
              <p className="text-sm text-muted-foreground">{formatAddress(
                workStreet,
                workDistrict,
                workCity,
                workState,
                workZipcode,
                workCountry
              )}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center font-medium">
              <Home className="mr-2 h-4 w-4" />
              Home
            </h3>
            <div className="space-y-2 pl-6">
              <p className="text-sm text-muted-foreground">{formatAddress(
                homeStreet,
                homeDistrict,
                homeCity,
                homeState,
                homeZipcode,
                homeCountry
              )}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 