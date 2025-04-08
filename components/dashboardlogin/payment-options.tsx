"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Smartphone, DollarSign } from "lucide-react"

export default function PaymentOptions({ user }: { user: { name: string; email: string } }) {
  const [activePaymentMethods, setActivePaymentMethods] = useState({
    upi: false,
    stripe: false,
  })

  const togglePaymentMethod = (method: 'upi' | 'stripe') => {
    setActivePaymentMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }))
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upi">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upi">UPI/BHIM</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
        </TabsList>

        <TabsContent value="upi" className="space-y-4 pt-4">
          {activePaymentMethods.upi ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <Smartphone className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">UPI Payment Enabled</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => togglePaymentMethod("upi")}>
                  Disable
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Your UPI Details</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input id="upi-id" value="example@upi" readOnly />
                    </div>
                    <div>
                      <Label htmlFor="upi-name">Display Name</Label>
                      <Input id="upi-name" value={user.name} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2 text-blue-700">How It Works</h4>
                <p className="text-sm text-blue-600">
                  When someone views your digital card, they'll see a "Pay" button that allows them to send money
                  directly to your UPI ID.
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Smartphone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Enable UPI Payments</h3>
              <p className="text-gray-600 mb-4">Allow others to pay you directly through UPI or BHIM apps.</p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => togglePaymentMethod("upi")}>
                Enable UPI
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="stripe" className="space-y-4 pt-4">
          {activePaymentMethods.stripe ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">Stripe Payments Enabled</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => togglePaymentMethod("stripe")}>
                  Disable
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">Your Stripe Account</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="stripe-email">Connected Account</Label>
                      <Input id="stripe-email" value={user.email} readOnly />
                    </div>
                    <div>
                      <Label htmlFor="stripe-status">Status</Label>
                      <Input id="stripe-status" value="Active" readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Connect Stripe</h3>
              <p className="text-gray-600 mb-4">Accept credit card payments directly through your digital card.</p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => togglePaymentMethod("stripe")}>
                Connect Stripe
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

