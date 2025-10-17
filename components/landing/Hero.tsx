"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-200 to-indigo-200  dark:from-gray-900 dark:to-gray-950 pt-32 pb-24">
        <div className="absolute inset-0">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path
            fill="rgba(255,255,255,0.3)"
            fillOpacity="1"
            d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,117.3C672,117,768,171,864,197.3C960,224,1056,224,1152,192C1248,160,1344,96,1392,64L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
       
       <motion.div 
        className="container relative mx-auto px-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1 
          className="mb-4 text-4xl font-extrabold tracking-tight text-sky-400 dark:text-white md:text-6xl"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          SmartWave
          <motion.div 
            className="flex items-center justify-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Sparkles className="h-5 w-5 text-teal-800 dark:text-yellow-200" />
            <span className="block text-stone-800 dark:text-stone-100 text-xl font-medium mt-2 md:text-2xl">Digital Business Cards for the Modern Professional</span>
            <Sparkles className="h-5 w-5 text-teal-800 dark:text-yellow-200" />
          </motion.div>
        </motion.h1>
        <motion.p 
          className="mx-auto mb-8 max-w-3xl text-lg text-blue-900  dark:text-blue-100 md:text-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          Share your professional profile with a tap, link, or scan. Connect instantly and leave a lasting impression.
        </motion.p>
        </motion.div>
      
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Transform Your Digital Identity with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              SmartWave
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Create stunning digital business cards and vCards powered by AI. Share your professional profile instantly and make lasting impressions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link href="/about-smartwave">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full sm:w-auto"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute w-96 h-96 -top-10 -left-10 bg-blue-200 dark:bg-blue-900/20 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute w-96 h-96 -bottom-10 -right-10 bg-purple-200 dark:bg-purple-900/20 rounded-full filter blur-3xl opacity-30"></div>
      </div>
    </section>
  );
} 