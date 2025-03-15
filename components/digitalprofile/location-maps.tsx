"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LocationsInfo, LocationInfo, BaseComponentProps } from "./types"

interface LocationMapProps extends BaseComponentProps {
  locations: LocationsInfo
}

export function LocationMap({ locations, theme }: LocationMapProps) {
  const homeMapRef = useRef<HTMLDivElement>(null)
  const workMapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // This is a placeholder for map initialization
    // In a real implementation, you would use a mapping library like Google Maps, Mapbox, or Leaflet

    const initMap = (element: HTMLDivElement | null, location: LocationInfo) => {
      if (!element) return

      // Placeholder for map initialization
      element.innerHTML = `
        <div class="flex h-full w-full items-center justify-center bg-muted/50">
          <div class="text-center">
            <MapPin class="mx-auto h-8 w-8 text-primary" />
            <p class="mt-2 text-sm font-medium">${location.label}</p>
            <p class="text-xs text-muted-foreground">Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}</p>
          </div>
        </div>
      `
    }

    if (locations.home) {
      initMap(homeMapRef.current, locations.home)
    }

    if (locations.work) {
      initMap(workMapRef.current, locations.work)
    }
  }, [locations])

  if (!locations.home && !locations.work) {
    return null
  }

  if (theme === "minimal") {
    return (
      <div>
        <h2 className="mb-3 text-xl font-semibold">Locations</h2>
        <Tabs defaultValue={locations.work ? "work" : "home"} className="w-full">
          <TabsList className="mb-4 w-full">
            {locations.work && (
              <TabsTrigger value="work" className="flex-1">
                Work
              </TabsTrigger>
            )}
            {locations.home && (
              <TabsTrigger value="home" className="flex-1">
                Home
              </TabsTrigger>
            )}
          </TabsList>
          {locations.work && (
            <TabsContent value="work">
              <div ref={workMapRef} className="h-48 w-full overflow-hidden rounded-md" />
            </TabsContent>
          )}
          {locations.home && (
            <TabsContent value="home">
              <div ref={homeMapRef} className="h-48 w-full overflow-hidden rounded-md" />
            </TabsContent>
          )}
        </Tabs>
      </div>
    )
  }

  if (theme === "modern" || theme === "bold") {
    return (
      <Card className={theme === "bold" ? "border-2 border-indigo-200" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Locations</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={locations.work ? "work" : "home"} className="w-full">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              {locations.work && <TabsTrigger value="work">Work</TabsTrigger>}
              {locations.home && <TabsTrigger value="home">Home</TabsTrigger>}
            </TabsList>
            {locations.work && (
              <TabsContent value="work">
                <div ref={workMapRef} className="h-56 w-full overflow-hidden rounded-md" />
              </TabsContent>
            )}
            {locations.home && (
              <TabsContent value="home">
                <div ref={homeMapRef} className="h-56 w-full overflow-hidden rounded-md" />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>
    )
  }

  // Default "classic" theme
  return (
    <Card>
      <CardHeader>
        <CardTitle>Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={locations.work ? "work" : "home"} className="w-full">
          <TabsList className="mb-4 w-full">
            {locations.work && <TabsTrigger value="work">Work</TabsTrigger>}
            {locations.home && <TabsTrigger value="home">Home</TabsTrigger>}
          </TabsList>
          {locations.work && (
            <TabsContent value="work">
              <div ref={workMapRef} className="h-48 w-full overflow-hidden rounded-md" />
            </TabsContent>
          )}
          {locations.home && (
            <TabsContent value="home">
              <div ref={homeMapRef} className="h-48 w-full overflow-hidden rounded-md" />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}

