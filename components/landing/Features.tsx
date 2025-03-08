import { motion } from "framer-motion";
import { 
  FaMagic, 
  FaMobile, 
  FaQrcode, 
  FaShareAlt, 
  FaPalette, 
  FaShieldAlt 
} from "react-icons/fa";

const features = [
  {
    icon: FaMagic,
    title: "AI-Powered Creation",
    description: "Let our AI assist you in creating professional digital cards with smart suggestions and automated formatting."
  },
  {
    icon: FaMobile,
    title: "Mobile Optimized",
    description: "Perfect viewing experience across all devices with responsive design and instant loading."
  },
  {
    icon: FaQrcode,
    title: "Quick Share",
    description: "Share your digital card instantly via QR code, making networking effortless and paperless."
  },
  {
    icon: FaShareAlt,
    title: "Multi-Platform",
    description: "Compatible with all major platforms and devices. Share across any digital channel."
  },
  {
    icon: FaPalette,
    title: "Customizable Design",
    description: "Choose from various templates and customize colors, fonts, and layouts to match your brand."
  },
  {
    icon: FaShieldAlt,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security and privacy controls."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Networking
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to create and share your professional digital presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow"
            >
              <feature.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 