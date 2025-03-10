import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaGlobe } from "react-icons/fa";

const sustainabilityPoints = [
  {
    icon: FaLeaf,
    title: "Eco-Friendly Solution",
    description: "Replace paper cards with digital alternatives, reducing paper waste and environmental impact.",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    gradientFrom: "from-blue-400/20",
    gradientTo: "to-blue-300/20",
    darkGradientFrom: "dark:from-blue-500/10",
    darkGradientTo: "dark:to-blue-400/10",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    hoverText: "group-hover:text-blue-600 dark:group-hover:text-blue-400"
  },
  {
    icon: FaRecycle,
    title: "Sustainable Networking",
    description: "Update your information instantly without reprinting, promoting sustainable business practices.",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
    gradientFrom: "from-teal-400/20",
    gradientTo: "to-teal-300/20",
    darkGradientFrom: "dark:from-teal-500/10",
    darkGradientTo: "dark:to-teal-400/10",
    iconBg: "bg-teal-100 dark:bg-teal-900/30",
    iconColor: "text-teal-600 dark:text-teal-400",
    hoverText: "group-hover:text-teal-600 dark:group-hover:text-teal-400"
  },
  {
    icon: FaGlobe,
    title: "Global Impact",
    description: "Join our community in reducing carbon footprint through digital transformation.",
    bgColor: "bg-green-50 dark:bg-green-900/20",
    gradientFrom: "from-green-400/20",
    gradientTo: "to-green-300/20",
    darkGradientFrom: "dark:from-green-500/10",
    darkGradientTo: "dark:to-green-400/10",
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    hoverText: "group-hover:text-green-600 dark:group-hover:text-green-400"
  }
];

export default function Sustainability() {
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
            Sustainable Digital Solutions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Join us in creating a more sustainable future through digital transformation
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sustainabilityPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className={`group relative ${point.bgColor} p-8 rounded-xl 
                shadow-lg dark:shadow-gray-900/50
                hover:scale-105 hover:shadow-xl
                dark:hover:shadow-gray-900/70
                transform transition-all duration-300 ease-out
                hover:rotate-1`}
            >
              {/* Gradient background effect */}
              <div className={`absolute inset-0 bg-gradient-to-r 
                ${point.gradientFrom} ${point.gradientTo} 
                ${point.darkGradientFrom} ${point.darkGradientTo}
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} 
              />

              <div className="relative z-10">
                <div className={`inline-block p-4 rounded-full 
                  ${point.iconBg} mb-6
                  transform group-hover:scale-110 group-hover:rotate-3
                  transition-all duration-300`}
                >
                  <point.icon className={`w-8 h-8 ${point.iconColor}
                    transition-colors duration-300`} 
                  />
                </div>
                
                <h3 className={`text-xl font-semibold text-gray-900 dark:text-white mb-3
                  ${point.hoverText}
                  transition-colors duration-300`}
                >
                  {point.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300
                  group-hover:text-gray-700 dark:group-hover:text-gray-200
                  transition-colors duration-300"
                >
                  {point.description}
                </p>
              </div>

              {/* Decorative element */}
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100
                transition-opacity duration-300"
              >
                <div className="text-4xl opacity-30">
                  {index === 0 ? '🌱' : index === 1 ? '♻️' : '🌍'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 