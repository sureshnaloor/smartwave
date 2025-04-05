"use client"

import { useCountry } from "@/context/CountryContext"
import { currencyConfig } from "@/lib/currencyConfig"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export default function PricingCommunity() {
  const { selectedCountry } = useCountry()
  const rates = currencyConfig[selectedCountry.currency]?.rates || currencyConfig.USD.rates
  const currency = currencyConfig[selectedCountry.currency] || currencyConfig.USD

  const formatPrice = (price: number) => {
    return currency.position === 'before' 
      ? `${currency.symbol}${price}`
      : `${price} ${currency.symbol}`
  }

  const editPlans = [
    {
      name: "Single Edit",
      price: rates.singleEdit,
      description: "Perfect for one-time updates",
      features: [
        "One design revision",
        "48-hour turnaround",
        "Professional design team",
        "Keep your existing card"
      ]
    },
    {
      name: "Five Edits Pack",
      price: rates.fiveEdits,
      description: "Ideal for growing professionals",
      popular: true,
      features: [
        "Five design revisions",
        "Priority support",
        "Unlimited design options",
        "Valid for 12 months"
      ]
    },
    {
      name: "Annual Unlimited",
      price: rates.annual,
      description: "For dynamic professionals",
      features: [
        "Unlimited revisions",
        "24-hour turnaround",
        "Dedicated designer",
        "Premium templates"
      ]
    }
  ]

  return (
    <div className="py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Stay Current in the Gig Economy</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Your career is dynamic. Your business card should be too. Join our community of freelancers, 
            entrepreneurs, and professionals who keep their digital presence fresh and relevant.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-semibold">Join Our Thriving Community</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <span>Network with like-minded professionals</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">💼</span>
                <span>Share opportunities and insights</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🚀</span>
                <span>Showcase your evolving skillset</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span>Stay relevant in your industry</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/swcommunity.jpg"
              alt="Smartwave Community"
              width={500}
              height={300}
              className="rounded-lg shadow-xl"
            />
          </motion.div>
        </div>

        <h3 className="text-2xl font-semibold text-center mb-12">Flexible Edit Plans</h3>
        <div className="grid md:grid-cols-3 gap-8">
          {editPlans.map((plan) => (
            <Card key={plan.name} className={`p-8 ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
              {plan.popular && (
                <div className="text-primary text-sm font-medium mb-4">Most Popular</div>
              )}
              <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
              <p className="text-muted-foreground mb-4">{plan.description}</p>
              <div className="mb-6">
                <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-primary">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/store">
                <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                  Choose Plan
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}