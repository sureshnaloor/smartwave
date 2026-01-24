"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function PricingHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background pt-12 pb-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4"
      >
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-6">
            Smart Business Cards for the Digital Age
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your networking with NFC-enabled cards that blend traditional elegance with digital innovation
          </p>
          <div className="flex justify-center gap-4">
            <Image
              src="/images/nfc-tap.gif"
              alt="NFC Tap Animation"
              width={300}
              height={300}
              className="rounded-lg shadow-2xl"
              unoptimized
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}