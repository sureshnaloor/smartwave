"use client"

import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PricingCards from "@/components/pricing/plans";
import NfcCards from "@/components/pricing/cards";

export default function DemoPricing() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-black/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]" />

      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
            Flexible <span className="text-gradient">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-smart-silver/80 max-w-3xl mx-auto">
            Choose the perfect solution for your digital networking needs.
          </p>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="digital" className="w-full">
            <div className="flex justify-center mb-12">
              <TabsList className="grid w-full max-w-md grid-cols-2 h-auto p-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full">
                <TabsTrigger
                  value="digital"
                  className="text-lg py-3 rounded-full data-[state=active]:bg-smart-teal data-[state=active]:text-white transition-all duration-300"
                >
                  Digital Plans
                </TabsTrigger>
                <TabsTrigger
                  value="physical"
                  className="text-lg py-3 rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white transition-all duration-300"
                >
                  NFC Cards
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="digital" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <PricingCards />
            </TabsContent>

            <TabsContent value="physical" className="mt-0 focus-visible:outline-none focus-visible:ring-0">
              <NfcCards />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </section>
  );
}
