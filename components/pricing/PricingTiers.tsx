"use client"

import { useCountry } from "@/context/CountryContext"
import { currencyConfig } from "@/lib/currencyConfig"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"
import Link from "next/link"

export default function PricingTiers() {
  const { selectedCountry } = useCountry()
  const rates = currencyConfig[selectedCountry.currency]?.rates || currencyConfig.USD.rates
  const currency = currencyConfig[selectedCountry.currency] || currencyConfig.USD

  const formatPrice = (price: number) => {
    return currency.position === 'before' 
      ? `${currency.symbol}${price}`
      : `${price} ${currency.symbol}`
  }

  const tiers = [
    {
      name: "Standard PVC",
      price: rates.pvc,
      features: [
        "Durable PVC material",
        "Full color printing",
        "QR code integration",
        "Digital business card",
        "Basic contact sharing"
      ],
      type: "pvc"
    },
    {
      name: "Smart NFC",
      price: rates.nfc,
      features: [
        "Everything in Standard",
        "NFC tap sharing",
        "Digital profile",
        "Contact analytics",
        "Unlimited updates"
      ],
      popular: true,
      type: "nfc"
    },
    {
      name: "Premium",
      price: rates.premium,
      features: [
        "Everything in Smart NFC",
        "Premium materials",
        "Custom finishes",
        "Priority support",
        "Advanced analytics"
      ],
      type: "premium"
    }
  ]

  return (
    <div className="py-9 mt-9 container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-6">Choose Your Card</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`p-8 ${tier.popular ? 'border-primary shadow-lg' : ''}`}>
            {tier.popular && (
              <div className="text-primary text-sm font-medium mb-4">Most Popular</div>
            )}
            <h3 className="text-2xl font-bold">{tier.name}</h3>
            <div className="mt-4 mb-8">
              <span className="text-4xl font-bold">{formatPrice(tier.price)}</span>
            </div>
            <ul className="space-y-4 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/store">
              <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                Get Started
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}