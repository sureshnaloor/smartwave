import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    quote: "SmartWave has completely transformed how I network. The digital cards are professional and impressive!",
    author: "Sarah Johnson",
    title: "Marketing Director",
    company: "Tech Innovations",
    image: "/testimonials/sarah.jpg" // Add your image path
  },
  {
    quote: "The AI-powered features make creating and updating my business card effortless. Highly recommended!",
    author: "Michael Chen",
    title: "Software Engineer",
    company: "Digital Solutions Inc",
    image: "/testimonials/michael.jpg" // Add your image path
  },
  {
    quote: "As a sustainability advocate, I love how SmartWave helps reduce paper waste while maintaining professionalism.",
    author: "Emma Rodriguez",
    title: "Environmental Consultant",
    company: "Green Future",
    image: "/testimonials/emma.jpg" // Add your image path
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Users Say
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join thousands of satisfied professionals using SmartWave
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="flex items-center mb-6">
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                    {/* Uncomment when you have actual images */}
                    {/* <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    /> */}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.title} at {testimonial.company}
                  </p>
                </div>
              </div>
              <blockquote className="text-gray-600 dark:text-gray-300 italic">
                "{testimonial.quote}"
              </blockquote>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 