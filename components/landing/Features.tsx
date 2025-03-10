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
    description: "Let our AI assist you in creating professional digital cards with smart suggestions and automated formatting.",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
    gradientFrom: "from-purple-400/20",
    gradientTo: "to-pink-300/20",
    darkGradientFrom: "dark:from-purple-500/10",
    darkGradientTo: "dark:to-pink-400/10",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
    hoverText: "group-hover:text-purple-600 dark:group-hover:text-purple-400"
  },
  {
    icon: FaMobile,
    title: "Mobile Optimized",
    description: "Perfect viewing experience across all devices with responsive design and instant loading.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    gradientFrom: "from-blue-400/20",
    gradientTo: "to-indigo-300/20",
    darkGradientFrom: "dark:from-blue-500/10",
    darkGradientTo: "dark:to-indigo-400/10",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400"
  },
  {
    icon: FaQrcode,
    title: "Quick Share",
    description: "Share your digital card instantly via QR code, making networking effortless and paperless.",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    gradientFrom: "from-teal-400/20",
    gradientTo: "to-cyan-300/20",
    darkGradientFrom: "dark:from-teal-500/10",
    darkGradientTo: "dark:to-cyan-400/10",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    hoverText: "group-hover:text-teal-600 dark:group-hover:text-teal-400"
  },
  {
    icon: FaShareAlt,
    title: "Multi-Platform",
    description: "Compatible with all major platforms and devices. Share across any digital channel.",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    gradientFrom: "from-orange-400/20",
    gradientTo: "to-amber-300/20",
    darkGradientFrom: "dark:from-orange-500/10",
    darkGradientTo: "dark:to-amber-400/10",
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    hoverText: "group-hover:text-orange-600 dark:group-hover:text-orange-400"
  },
  {
    icon: FaPalette,
    title: "Customizable Design",
    description: "Choose from various templates and customize colors, fonts, and layouts to match your brand.",
    bgColor: "bg-rose-50 dark:bg-rose-900/20",
    gradientFrom: "from-rose-400/20",
    gradientTo: "to-pink-300/20",
    darkGradientFrom: "dark:from-rose-500/10",
    darkGradientTo: "dark:to-pink-400/10",
    iconBg: "bg-rose-100 dark:bg-rose-900/30",
    iconColor: "text-rose-600 dark:text-rose-400",
    hoverText: "group-hover:text-rose-600 dark:group-hover:text-rose-400"
  },
  {
    icon: FaShieldAlt,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security and privacy controls.",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    gradientFrom: "from-emerald-400/20",
    gradientTo: "to-green-300/20",
    darkGradientFrom: "dark:from-emerald-500/10",
    darkGradientTo: "dark:to-green-400/10",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    hoverText: "group-hover:text-emerald-600 dark:group-hover:text-emerald-400"
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Networking
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Everything you need to create and share your professional digital presence
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`group relative ${feature.bgColor} p-8 rounded-xl 
                shadow-lg dark:shadow-gray-900/50
                hover:scale-105 hover:shadow-xl
                dark:hover:shadow-gray-900/70
                transform transition-all duration-300 ease-out
                hover:rotate-1`}
            >
              {/* Gradient background effect */}
              <div className={`absolute inset-0 bg-gradient-to-r 
                ${feature.gradientFrom} ${feature.gradientTo} 
                ${feature.darkGradientFrom} ${feature.darkGradientTo}
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} 
              />

              <div className="relative z-10">
                <div className={`inline-block p-4 rounded-full 
                  ${feature.iconBg} mb-6
                  transform group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300`}
                >
                  <feature.icon className={`w-8 h-8 ${feature.iconColor}
                    transition-colors duration-300`} 
                  />
                </div>
                
                <h3 className={`text-xl font-semibold text-gray-900 dark:text-white mb-3
                  ${feature.hoverText}
                  transition-colors duration-300`}
                >
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300
                  group-hover:text-gray-700 dark:group-hover:text-gray-200
                  transition-colors duration-300"
                >
                  {feature.description}
                </p>
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
                transition-opacity duration-300"
              >
                <div className={`${feature.iconColor} opacity-20`}>
                  ●●●
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 