import { motion } from "framer-motion";
import { CldImage } from 'next-cloudinary';

const testimonials = [
  {
    quote: "SmartWave has completely transformed how I network. The digital cards are professional and impressive!",
    author: "Aizel Johnson",
    title: "Marketing Director",
    company: "Tech Innovations",
    image: "smartwave/techlady_glxzl7"
  },
  {
    quote: "The AI-powered features make creating and updating my business card effortless. Highly recommended!",
    author: "Harish Aiyengar",
    title: "Software Engineer",
    company: "Digital Solutions Inc",
    image: "smartwave/techindian_bkhy5u"
  },
  {
    quote: "As a sustainability advocate, I love how SmartWave helps reduce paper waste while maintaining professionalism.",
    author: "Ahmed Al Aiman",
    title: "Environmental Consultant",
    company: "Green Future",
    image: "smartwave/techsaudi_uwvmnf"
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative bg-white dark:bg-gray-800 p-6 rounded-xl 
                shadow-lg dark:shadow-gray-900/50
                hover:scale-105 hover:shadow-xl
                dark:hover:shadow-gray-900/70
                transform transition-all duration-300 ease-out
                hover:rotate-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              {/* Gradient background effect */}
              <div className={`absolute inset-0 bg-gradient-to-r 
                ${index === 0 ? 'from-purple-400/20 to-pink-400/20 dark:from-purple-500/10 dark:to-pink-500/10' : 
                  index === 1 ? 'from-blue-400/20 to-indigo-400/20 dark:from-blue-500/10 dark:to-indigo-500/10' :
                  'from-teal-400/20 to-cyan-400/20 dark:from-teal-500/10 dark:to-cyan-500/10'}
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`} 
              />

              <div className="flex items-center mb-6">
                <div className="relative w-16 h-16 mr-4">
                  <CldImage
                    src={testimonial.image}
                    alt={testimonial.author}
                    width={100}
                    height={100}
                    crop="fill"
                    quality="auto"
                    gravity="auto"
                    className="rounded-full transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="relative z-10">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.author}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testimonial.title} at {testimonial.company}
                  </p>
                </div>
              </div>

              <blockquote className="text-gray-600 dark:text-gray-300 italic relative z-10 
                group-hover:text-gray-700 dark:group-hover:text-gray-200"
              >
                "{testimonial.quote}"
              </blockquote>

              <div className="mt-4 text-yellow-400 relative z-10 transform 
                group-hover:scale-105 transition-transform"
              >
                ★★★★★
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 