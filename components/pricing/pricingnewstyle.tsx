"use client"

import {motion} from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import PricingCards from "./plans";
import NfcCards from "./cards"; 

export default function PricingNewStyle() {
  return (
    <>
      <motion.div
        className="container mx-auto px-4 py-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Tabs defaultValue="digital" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="digital" className="text-lg py-3">
                  Digital Plans
                </TabsTrigger>
                <TabsTrigger value="physical" className="text-lg py-3">
                  NFC Cards
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="digital" className="mt-0">
              <PricingCards />
            </TabsContent>
            <TabsContent value="physical" className="mt-0">
              <NfcCards />
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>{" "}
     
    </>
  );
}