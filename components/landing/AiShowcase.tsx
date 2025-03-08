import { motion } from "framer-motion";
import Image from "next/image";

export default function AiShowcase() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              AI-Powered Digital Card Creation
            </h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Smart Content Generation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our AI analyzes your professional profile to suggest optimal content and layout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Automated Design
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Get instant design suggestions based on your industry and brand preferences.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Smart Analytics
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track engagement and optimize your digital card's performance with AI insights.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="relative h-[400px] lg:h-[500px]"
          >
            {/* Replace with your actual AI showcase image */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              {/* Add your AI showcase image here */}
              {/* <Image
                src="/ai-showcase.png"
                alt="AI Showcase"
                fill
                className="object-cover"
              /> */}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 