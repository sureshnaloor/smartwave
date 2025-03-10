import { motion } from "framer-motion";
import { CldImage } from 'next-cloudinary';

const steps = [
  {
    number: "1",
    title: "Smart Content Generation",
    description: "Our AI analyzes your professional profile to suggest optimal content and layout.",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    textColor: "text-blue-600 dark:text-blue-400",
    hoverColor: "group-hover:text-blue-700 dark:group-hover:text-blue-300"
  },
  {
    number: "2",
    title: "Automated Design",
    description: "Get instant design suggestions based on your industry and brand preferences.",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    textColor: "text-purple-600 dark:text-purple-400",
    hoverColor: "group-hover:text-purple-700 dark:group-hover:text-purple-300"
  },
  {
    number: "3",
    title: "Smart Analytics",
    description: "Track engagement and optimize your digital card's performance with AI insights.",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    textColor: "text-indigo-600 dark:text-indigo-400",
    hoverColor: "group-hover:text-indigo-700 dark:group-hover:text-indigo-300"
  }
];

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
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl
                    hover:scale-105 transform transition-all duration-300
                    hover:shadow-lg dark:hover:shadow-gray-900/50"
                  whileHover={{
                    rotate: [0, 1, -1, 1, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {/* Gradient background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 
                    dark:from-blue-900/20 dark:to-purple-900/20
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" 
                  />

                  <div className="flex items-start gap-4 relative z-10">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${step.bgColor} 
                      flex items-center justify-center transform group-hover:scale-110 
                      group-hover:rotate-12 transition-transform duration-300`}
                    >
                      <span className={`${step.textColor} ${step.hoverColor}`}>
                        {step.number}
                      </span>
                    </div>
                    <div>
                      <h3 className={`text-xl font-semibold text-gray-900 dark:text-white mb-2 
                        ${step.hoverColor} transition-colors duration-300`}
                      >
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 
                        dark:group-hover:text-gray-200 transition-colors duration-300"
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="group relative h-[400px] lg:h-[500px]"
          >
            {/* Background with gradient and hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 
              rounded-2xl overflow-hidden transform group-hover:scale-105 
              transition-transform duration-500 ease-out"
            >
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 
                transition-colors duration-300"
              />
              
              {/* AI Image with hover animation */}
              <motion.div
                className="relative w-full h-full"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.5 }
                }}
              >
                <CldImage
                  src="smartwave/aishowcase_qznqqa"
                  alt="AI Showcase"
                  fill
                  className="object-cover transform transition-transform duration-500
                    group-hover:scale-110"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJiEwSzIrLisxKys4P1AzODM4NyguRktQS0c/TUFQTERMYUxPUVFR/2wBDAVVFRceGh4oHB4oUTEsM1FRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVFRUVH/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                />
              </motion.div>
            </div>

            {/* Floating AI elements */}
            <motion.div
              className="absolute -right-4 -top-4 w-12 h-12 bg-blue-500 rounded-full 
                flex items-center justify-center text-white text-2xl
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🤖
            </motion.div>

            <motion.div
              className="absolute -left-4 -bottom-4 w-12 h-12 bg-purple-500 rounded-full 
                flex items-center justify-center text-white text-2xl
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                y: [0, 10, 0],
                rotate: [0, -360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            >
              ⚡
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 