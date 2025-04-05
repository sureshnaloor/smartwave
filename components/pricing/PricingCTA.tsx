import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PricingCTA() {
  return (
    <div className="bg-primary text-primary-foreground py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Networking?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of professionals who've already upgraded to smart business cards
        </p>
        <Link href="/store">
          <Button size="lg" variant="secondary">
            Get Your Smart Card Now
          </Button>
        </Link>
      </div>
    </div>
  )
}