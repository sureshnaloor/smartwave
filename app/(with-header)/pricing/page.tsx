import { Metadata } from "next"
import PricingHero from "@/components/pricing/PricingHero"
import PricingTiers from "@/components/pricing/PricingTiers"
import PricingFeatures from "@/components/pricing/PricingFeatures"
import PricingCommunity from "@/components/pricing/PricingCommunity"
import PricingCTA from "@/components/pricing/PricingCTA"
import PricingNewStyle from "@/components/pricing/pricingnewstyle"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Pricing | Smartwave",
  description: "Explore our smart business card solutions and pricing plans",
}

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <PricingHero />
      {/* <PricingTiers /> */}
      <PricingNewStyle />
      <PricingFeatures />
      <PricingCommunity />
      <PricingCTA />
      <Footer />
    </div>
  )
}