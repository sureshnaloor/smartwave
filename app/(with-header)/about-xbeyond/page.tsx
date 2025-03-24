import Link from "next/link";
import { ArrowRight, Lightbulb, Users, Globe, Code, Cpu, Rocket } from "lucide-react";
import Footer from "@/components/Footer";

export default function AboutXBeyond() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                About <span className="text-purple-600 dark:text-purple-400">ExBeyond</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Innovating Beyond Expectations
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 
                  bg-purple-600 hover:bg-purple-700 
                  dark:bg-purple-700 dark:hover:bg-purple-800 
                  text-white rounded-lg transition-all duration-300 
                  transform hover:scale-105 hover:shadow-lg"
              >
                Connect With Us
                <ArrowRight className="animate-bounce-x" />
              </Link>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "Our Mission",
                  description: "To revolutionize digital solutions through innovative technology and exceptional service.",
                  icon: <Lightbulb className="w-8 h-8" />,
                  gradient: "from-amber-400/20 to-orange-400/20",
                  darkGradient: "dark:from-amber-500/10 dark:to-orange-500/10",
                  hover: "hover:from-amber-50 hover:to-white",
                  darkHover: "dark:hover:from-amber-900/20 dark:hover:to-gray-800"
                },
                {
                  title: "Our Vision",
                  description: "To be the leading force in digital transformation, setting new standards in technological innovation.",
                  icon: <Globe className="w-8 h-8" />,
                  gradient: "from-blue-400/20 to-cyan-400/20",
                  darkGradient: "dark:from-blue-500/10 dark:to-cyan-500/10",
                  hover: "hover:from-blue-50 hover:to-white",
                  darkHover: "dark:hover:from-blue-900/20 dark:hover:to-gray-800"
                }
              ].map((item, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white dark:bg-gray-800 p-8 rounded-xl
                    shadow-lg dark:shadow-gray-900/50
                    hover:scale-105 hover:shadow-xl
                    dark:hover:shadow-gray-900/70
                    transform transition-all duration-300 ease-out
                    ${index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'}
                    hover:bg-gradient-to-br ${item.hover} ${item.darkHover}
                  `}
                >
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${item.gradient} ${item.darkGradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                  `} />
                  <div className="relative z-10">
                    <div className="text-purple-600 dark:text-purple-400 mb-4 
                      transform group-hover:scale-110 transition-transform duration-300"
                    >
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12">
              Our Core Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Innovation",
                  description: "Pushing boundaries and embracing new technologies",
                  icon: <Cpu />,
                  gradient: "from-purple-400/20 to-pink-400/20",
                  darkGradient: "dark:from-purple-500/10 dark:to-pink-500/10",
                  hover: "hover:from-purple-50 hover:to-white",
                  darkHover: "dark:hover:from-purple-900/20 dark:hover:to-gray-800"
                },
                {
                  title: "Excellence",
                  description: "Delivering exceptional quality in everything we do",
                  icon: <Rocket />,
                  gradient: "from-emerald-400/20 to-teal-400/20",
                  darkGradient: "dark:from-emerald-500/10 dark:to-teal-500/10",
                  hover: "hover:from-emerald-50 hover:to-white",
                  darkHover: "dark:hover:from-emerald-900/20 dark:hover:to-gray-800"
                },
                {
                  title: "Collaboration",
                  description: "Working together to achieve greater results",
                  icon: <Users />,
                  gradient: "from-blue-400/20 to-indigo-400/20",
                  darkGradient: "dark:from-blue-500/10 dark:to-indigo-500/10",
                  hover: "hover:from-blue-50 hover:to-white",
                  darkHover: "dark:hover:from-blue-900/20 dark:hover:to-gray-800"
                }
              ].map((value, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white dark:bg-gray-800 p-6 rounded-xl
                    shadow-lg dark:shadow-gray-900/50
                    hover:scale-105 hover:shadow-xl
                    dark:hover:shadow-gray-900/70
                    transform transition-all duration-300 ease-out
                    ${index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'}
                    hover:bg-gradient-to-br ${value.hover} ${value.darkHover}
                  `}
                >
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${value.gradient} ${value.darkGradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                  `} />
                  <div className="relative z-10">
                    <div className="text-purple-600 dark:text-purple-400 mb-4 
                      transform group-hover:scale-110 transition-transform duration-300"
                    >
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-900 dark:to-indigo-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to Transform Your Digital Presence?
            </h2>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 
                bg-white text-purple-600 hover:bg-gray-100
                dark:bg-gray-800 dark:text-purple-400 dark:hover:bg-gray-700
                rounded-lg transition-all duration-300 
                transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="animate-bounce-x" />
            </Link>
          </div>
        </section>

        {/* About ExBeyond Inc Section */}
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden
              shadow-lg dark:shadow-gray-900/50 
              hover:shadow-2xl dark:hover:shadow-gray-900/70
              transform transition-all duration-700 ease-out
              hover:-translate-y-2 hover:scale-[1.02]"
            >
              {/* Animated Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-blue-400/20 
                dark:from-purple-500/10 dark:via-indigo-500/10 dark:to-blue-500/10
                opacity-0 group-hover:opacity-100 transition-opacity duration-700
                animate-gradient-xy"
              />
              
              {/* Animated Border Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500
                opacity-0 group-hover:opacity-20 dark:group-hover:opacity-10
                transition-opacity duration-700 blur-2xl"
              />
              
              {/* Content Container */}
              <div className="relative p-8 md:p-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6
                  transform group-hover:translate-x-1 transition-all duration-700"
                >
                  About <span className="text-purple-600 dark:text-purple-400">ExBeyond Inc</span>
                </h2>

                {/* Founder Info */}
                <div className="flex flex-col md:flex-row gap-8 mb-8
                  transform group-hover:translate-x-2 transition-all duration-700 delay-100"
                >
                  <div className="flex-1">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      ExBeyond Inc is a technology company founded by{' '}
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        Suresh Menon
                      </span>
                      , Engineer with 40 years of experience managing supply chain and projects management of mega-projects, 
                      with the vision of bridging traditional business practices in Supply Chain and 
                      Projects with digital innovations, to make business processes easier and more efficient.
                    </p>
                  </div>
                </div>

                {/* Products Info */}
                <div className="mb-4 transform group-hover:translate-x-2 transition-all duration-700 delay-200">
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    Our flagship products,{' '}
                    <span className="font-semibold text-purple-600 dark:text-purple-400">
                      SmartWave, SmartLink, SmartFlow, SmartClass,
                      SmartTag & SmartProject  . 
                    </span>
                     represent our commitment to combine cutting-edge 
                    technology with user-friendly design patterns and pleasant user experience to create solutions that make business 
                    more efficient and environmentally conscious.
                  </p>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/30 
                  rounded-full transform -translate-x-1/2 -translate-y-1/2 
                  group-hover:scale-150 group-hover:rotate-180
                  transition-all duration-1000 ease-out blur-3xl
                  group-hover:bg-indigo-200/30 dark:group-hover:bg-indigo-900/30"
                />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 dark:bg-indigo-900/30 
                  rounded-full transform translate-x-1/2 translate-y-1/2 
                  group-hover:scale-150 group-hover:-rotate-180
                  transition-all duration-1000 ease-out blur-3xl
                  group-hover:bg-purple-200/30 dark:group-hover:bg-purple-900/30"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}