"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Link } from "lucide-react"

export default function CalendarIntegration({ user }: { user: { name: string } }) {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="google">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="google">Google Calendar</TabsTrigger>
          <TabsTrigger value="calendly">Calendly</TabsTrigger>
        </TabsList>

        <TabsContent value="google" className="space-y-4 pt-4">
          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">Connected to Google Calendar</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsConnected(false)}>
                  Disconnect
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Your Availability</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 2:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Not Available</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h4 className="font-medium mb-2">Booking Link</h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={`https://smartwave.app/${user.name.toLowerCase().replace(/\s/g, "")}/calendar`}
                    readOnly
                    className="flex-1 p-2 border rounded-md text-sm"
                  />
                  <Button size="sm" variant="outline">
                    <Link className="h-4 w-4 mr-1" /> Copy
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Connect Google Calendar</h3>
              <p className="text-gray-600 mb-4">Allow others to book meetings with you based on your availability.</p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsConnected(true)}>
                Connect Calendar
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendly" className="space-y-4 pt-4">
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Connect Calendly</h3>
            <p className="text-gray-600 mb-4">Integrate your Calendly account to manage bookings and appointments.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">Connect Calendly</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

