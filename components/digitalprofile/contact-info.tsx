import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Home, Mail, MapPin, Phone } from "lucide-react"
import { WorkInfo, HomeInfo, BaseComponentProps } from "./types"

interface ContactInfoProps extends BaseComponentProps {
  work: WorkInfo
  home: HomeInfo
}

interface AddressFormatProps {
  address: string
  city: string
  state: string
  country: string
  zip: string
}

export function ContactInfo({ work, home, theme }: ContactInfoProps) {
  const formatAddress = (address: AddressFormatProps) => {
    return `${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.zip}`
  }

  if (theme === "minimal") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="mb-3 text-xl font-semibold">Contact Information</h2>
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="work" className="flex-1">
                Work
              </TabsTrigger>
              <TabsTrigger value="home" className="flex-1">
                Personal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-3">
              {work.position && <p className="text-sm font-medium">{work.position}</p>}
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatAddress(work)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{work.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{work.email}</p>
              </div>
            </TabsContent>
            <TabsContent value="home" className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{formatAddress(home)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{home.phone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{home.email}</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  if (theme === "modern" || theme === "bold") {
    return (
      <Card className={theme === "bold" ? "border-2 border-indigo-200" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Contact Information</CardTitle>
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
                Personal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-4">
              {work.position && (
                <div className="rounded-md bg-muted p-3">
                  <p className="font-medium">{work.position}</p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <p>{formatAddress(work)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p>{work.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <p>{work.email}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="home" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <p>{formatAddress(home)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p>{home.phone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <p>{home.email}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 flex items-center font-medium">
              <Building className="mr-2 h-4 w-4" />
              Work
            </h3>
            <div className="space-y-2 pl-6">
              {work.position && <p className="text-sm font-medium">{work.position}</p>}
              <p className="text-sm text-muted-foreground">{formatAddress(work)}</p>
              <p className="text-sm">{work.phone}</p>
              <p className="text-sm">{work.email}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center font-medium">
              <Home className="mr-2 h-4 w-4" />
              Personal
            </h3>
            <div className="space-y-2 pl-6">
              <p className="text-sm text-muted-foreground">{formatAddress(home)}</p>
              <p className="text-sm">{home.phone}</p>
              <p className="text-sm">{home.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

