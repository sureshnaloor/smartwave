import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building, Home, Mail, Phone } from "lucide-react"
import { ThemeType } from "./types"

interface ContactInfoProps {
  // Work contact info
  workPhone: string
  workEmail: string
  fax?: string
  // Personal contact info
  homePhone: string
  personalEmail: string
  mobile: string
  title?: string
  theme: ThemeType
}

export function ContactInfo({ 
  workPhone,
  workEmail,
  fax,
  homePhone,
  personalEmail,
  mobile,
  title,
  theme 
}: ContactInfoProps) {
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
              {title && <p className="text-sm font-medium">{title}</p>}
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{workPhone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{workEmail}</p>
              </div>
              {fax && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm">Fax: {fax}</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="home" className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{homePhone}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{personalEmail}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">Mobile: {mobile}</p>
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
              {title && (
                <div className="rounded-md bg-muted p-3">
                  <p className="font-medium">{title}</p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p>{workPhone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <p>{workEmail}</p>
                </div>
                {fax && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <p>Fax: {fax}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="home" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p>{homePhone}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <p>{personalEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p>Mobile: {mobile}</p>
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
              {title && <p className="text-sm font-medium">{title}</p>}
              <p className="text-sm">{workPhone}</p>
              <p className="text-sm">{workEmail}</p>
              {fax && <p className="text-sm">Fax: {fax}</p>}
            </div>
          </div>

          <div>
            <h3 className="mb-2 flex items-center font-medium">
              <Home className="mr-2 h-4 w-4" />
              Personal
            </h3>
            <div className="space-y-2 pl-6">
              <p className="text-sm">{homePhone}</p>
              <p className="text-sm">{personalEmail}</p>
              <p className="text-sm">Mobile: {mobile}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

