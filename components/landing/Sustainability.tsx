import { motion } from "framer-motion";
import { FaLeaf, FaRecycle, FaGlobe } from "react-icons/fa";

const sustainabilityPoints = [
  {
    icon: FaLeaf,
    title: "Eco-Friendly Solution",
    description: "Replace paper cards with digital alternatives, reducing paper waste and environmental impact."
  },
  {
    icon: FaRecycle,
    title: "Sustainable Networking",
    description: "Update your information instantly without reprinting, promoting sustainable business practices."
  },
  {
    icon: FaGlobe,
    title: "Global Impact",
    description: "Join our community in reducing carbon footprint through digital transformation."
  }
];

export default function Sustainability() {
  return (
    <section className="py-24 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
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
              className="text-center p-6"
            >
              <div className="inline-block p-4 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <point.icon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {point.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 