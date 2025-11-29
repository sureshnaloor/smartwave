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

  if (theme === "glassmorphism") {
    const workAddress = formatAddress(workStreet, workDistrict, workCity, workState, workZipcode, workCountry)
    const homeAddress = formatAddress(homeStreet, homeDistrict, homeCity, homeState, homeZipcode, homeCountry)

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workAddress && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <MapPin className="text-2xl text-red-500" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Work Address</p>
                <p className="text-gray-700">{workAddress}</p>
              </div>
            </div>
          </div>
        )}

        {homeAddress && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <MapPin className="text-2xl text-green-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Home Address</p>
                <p className="text-gray-700">{homeAddress}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (theme === "minimal") {
    return (
      <div className="space-y-6">
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl hover:-translate-y-1">
          <h2 className="mb-4 text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Locations
          </h2>
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-4 w-full bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="work" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                Work
              </TabsTrigger>
              <TabsTrigger value="home" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                Home
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-3">
              <div className="flex items-start gap-3 group/item transition-all duration-300 hover:translate-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 transition-transform duration-300 group-hover/item:scale-110 mt-0.5">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium">{formatAddress(
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
              <div className="flex items-start gap-3 group/item transition-all duration-300 hover:translate-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 transition-transform duration-300 group-hover/item:scale-110 mt-0.5">
                  <MapPin className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium">{formatAddress(
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
      <Card className={`
        overflow-hidden border-0 shadow-xl transition-all duration-500 
        hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] group
        ${theme === "bold"
          ? "bg-gradient-to-br from-white to-orange-50 dark:from-slate-900 dark:to-orange-950 border-2 border-orange-200 dark:border-orange-800"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        }
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-red-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-2xl bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Locations
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="work" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white">
                <Building className="mr-2 h-4 w-4" />
                Work
              </TabsTrigger>
              <TabsTrigger value="home" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white">
                <Home className="mr-2 h-4 w-4" />
                Home
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl mt-0.5">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium">{formatAddress(
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
                <div className="flex items-start gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl mt-0.5">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium">{formatAddress(
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
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 group overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Locations
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center font-semibold text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 mr-3">
                <Building className="h-4 w-4 text-white" />
              </div>
              Work
            </h3>
            <div className="space-y-2 pl-14">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{formatAddress(
                workStreet,
                workDistrict,
                workCity,
                workState,
                workZipcode,
                workCountry
              )}</p>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

          <div>
            <h3 className="mb-3 flex items-center font-semibold text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 mr-3">
                <Home className="h-4 w-4 text-white" />
              </div>
              Home
            </h3>
            <div className="space-y-2 pl-14">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{formatAddress(
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