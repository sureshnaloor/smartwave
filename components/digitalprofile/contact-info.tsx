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
  if (theme === "glassmorphism") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {workEmail && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <Mail className="text-2xl text-blue-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Work Email</p>
                <p className="text-gray-700">{workEmail}</p>
              </div>
            </div>
          </div>
        )}

        {workPhone && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <Phone className="text-2xl text-green-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Work Phone</p>
                <p className="text-gray-700">{workPhone}</p>
              </div>
            </div>
          </div>
        )}

        {personalEmail && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <Mail className="text-2xl text-purple-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Personal Email</p>
                <p className="text-gray-700">{personalEmail}</p>
              </div>
            </div>
          </div>
        )}

        {mobile && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <Phone className="text-2xl text-indigo-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Mobile</p>
                <p className="text-gray-700">{mobile}</p>
              </div>
            </div>
          </div>
        )}

        {homePhone && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <Phone className="text-2xl text-teal-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Home Phone</p>
                <p className="text-gray-700">{homePhone}</p>
              </div>
            </div>
          </div>
        )}

        {fax && (
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <Phone className="text-2xl text-orange-600" />
              <div>
                <p className="text-xs text-gray-500 font-medium">Fax</p>
                <p className="text-gray-700">{fax}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (theme === "minimal") {
    return (
      <div className="space-y-6 group">
        <div className="p-6 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border border-slate-200 dark:border-slate-700 transition-all duration-500 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:shadow-xl hover:-translate-y-1">
          <h2 className="mb-4 text-2xl font-semibold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            Contact Information
          </h2>
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-4 w-full bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="work" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                Work
              </TabsTrigger>
              <TabsTrigger value="home" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                Personal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-3">
              {title && <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</p>}
              <div className="flex items-center gap-3 group/item transition-all duration-300 hover:translate-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 transition-transform duration-300 group-hover/item:scale-110">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium">{workPhone}</p>
              </div>
              <div className="flex items-center gap-3 group/item transition-all duration-300 hover:translate-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 transition-transform duration-300 group-hover/item:scale-110">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium">{workEmail}</p>
              </div>
              {fax && (
                <div className="flex items-center gap-3 group/item transition-all duration-300 hover:translate-x-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 transition-transform duration-300 group-hover/item:scale-110">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-sm font-medium">Fax: {fax}</p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="home" className="space-y-3">
              <div className="flex items-center gap-3 group/item transition-all duration-300 hover:translate-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 transition-transform duration-300 group-hover/item:scale-110">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium">{homePhone}</p>
              </div>
              <div className="flex items-center gap-3 group/item transition-all duration-300 hover:translate-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 transition-transform duration-300 group-hover/item:scale-110">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium">{personalEmail}</p>
              </div>
              <div className="flex items-center gap-3 group/item transition-all duration-300 hover:translate-x-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 transition-transform duration-300 group-hover/item:scale-110">
                  <Phone className="h-4 w-4 text-white" />
                </div>
                <p className="text-sm font-medium">Mobile: {mobile}</p>
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
          ? "bg-gradient-to-br from-white to-indigo-50 dark:from-slate-900 dark:to-indigo-950 border-2 border-indigo-200 dark:border-indigo-800"
          : "bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        }
      `}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-purple-500/5 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10">
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2 bg-slate-100 dark:bg-slate-800">
              <TabsTrigger value="work" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">
                <Building className="mr-2 h-4 w-4" />
                Work
              </TabsTrigger>
              <TabsTrigger value="home" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                <Home className="mr-2 h-4 w-4" />
                Personal
              </TabsTrigger>
            </TabsList>
            <TabsContent value="work" className="space-y-4">
              {title && (
                <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 p-4 border border-blue-200 dark:border-blue-800">
                  <p className="font-semibold text-slate-900 dark:text-white">{title}</p>
                </div>
              )}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium">{workPhone}</p>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium">{workEmail}</p>
                </div>
                {fax && (
                  <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl">
                      <Phone className="h-5 w-5 text-white" />
                    </div>
                    <p className="font-medium">Fax: {fax}</p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="home" className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium">{homePhone}</p>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium">{personalEmail}</p>
                </div>
                <div className="flex items-center gap-4 p-3 rounded-lg transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800 group/item">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg transition-all duration-300 group-hover/item:scale-110 group-hover/item:shadow-xl">
                    <Phone className="h-5 w-5 text-white" />
                  </div>
                  <p className="font-medium">Mobile: {mobile}</p>
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
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
          Contact Information
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 flex items-center font-semibold text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 mr-3">
                <Building className="h-4 w-4 text-white" />
              </div>
              Work
            </h3>
            <div className="space-y-2 pl-14">
              {title && <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</p>}
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{workPhone}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{workEmail}</p>
              {fax && <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Fax: {fax}</p>}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-700 to-transparent"></div>

          <div>
            <h3 className="mb-3 flex items-center font-semibold text-lg">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 mr-3">
                <Home className="h-4 w-4 text-white" />
              </div>
              Personal
            </h3>
            <div className="space-y-2 pl-14">
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{homePhone}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{personalEmail}</p>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Mobile: {mobile}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
