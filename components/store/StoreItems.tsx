"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoreItemCard from "@/components/store/StoreItemCard"
import { useCountry } from '@/context/CountryContext'
import { CheckCircle, Wifi } from "lucide-react"

// Define data locally to match pricing sections exactly
const digitalPlans = [
  {
    id: "plan_individual",
    name: "Individual Plan",
    price: 0,
    type: "plan",
    description: "Perfect for individuals. Premium themes, QR generation, vCard download.",
    features: ["Digital profile", "Wallet integration", "3 card content"],
    priceKeys: {
      annual: 'plan_individual_annual',
      fiveYear: 'plan_individual_perpetual'
    }
  },
  {
    id: "plan_starter",
    name: "Enterprise - Starter",
    price: 0,
    type: "plan",
    description: "For small teams (up to 10 employees). Analytics & Team management.",
    features: ["Up to 10 employees", "Analytics", "Team management"],
    priceKeys: {
      annual: 'plan_starter_annual',
      fiveYear: 'plan_starter_5y'
    }
  },
  {
    id: "plan_growth",
    name: "Enterprise - Growth",
    price: 0,
    type: "plan",
    description: "For growing organizations (up to 25 employees).",
    features: ["Up to 25 employees", "All Starter features", "Priority support"],
    priceKeys: {
      annual: 'plan_growth_annual',
      fiveYear: 'plan_growth_5y'
    }
  },
  // Corporate is custom, maybe not in store? or link to contact.
  // User asked for "same plans", so I include it? But a store item needs a price.
  // I will skip Corporate for "purchase" or make it Contact.
];

const nfcCards = [
  {
    id: "card_basic",
    name: "Basic White",
    price: 9.99,
    type: "card",
    description: "Simple and elegant NFC business cards. White PVC material.",
    color: ["white"],
    features: ["White PVC", "Printed QR"],
  },
  {
    id: "card_color",
    name: "Color PVC",
    price: 19.99,
    type: "card",
    description: "Vibrant full-color business cards.",
    color: ["blue", "red", "black", "orange"], // Example colors
    features: ["Full Color", "Custom design"],
  },
  {
    id: "card_premium",
    name: "Premium NFC",
    price: 29.99,
    type: "card",
    description: "Premium-finish high-quality cards with advanced design.",
    color: ["silver", "matte_black"],
    features: ["Thick material", "Advanced finish"],
  },
  {
    id: "card_plus",
    name: "Premium Plus",
    price: 49.99,
    type: "card",
    description: "Luxury metal business cards.",
    color: ["gold", "metal_black"],
    features: ["Metal construction", "Lifetime profile"],
  }
];

export default function StoreItems() {
  const { selectedCountry } = useCountry();

  return (
    <Tabs defaultValue="cards" className="w-full">
      <div className="flex justify-center mb-8">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="cards">NFC Cards</TabsTrigger>
          <TabsTrigger value="plans">Digital Plans</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="cards" className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfcCards.map((item) => (
            <StoreItemCard
              key={item.id}
              {...item}
              category="card"
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="plans" className="space-y-8">
        {/* India Advisory Banner */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-800 p-4 rounded-lg flex items-start gap-3">
          <div className="text-2xl">🇮🇳</div>
          <div>
            <h4 className="font-bold text-orange-800 dark:text-orange-200">Exclusive Offer for India!</h4>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Select <strong>India</strong> as your country to get a flat <strong className="text-red-600 dark:text-red-400">50% Early Bird Discount</strong> on all Digital Plans! (First 1000 users only)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {digitalPlans.map((item) => (
            <StoreItemCard
              key={item.id}
              {...item}
              category="plan"
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}