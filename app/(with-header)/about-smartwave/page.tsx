import Link from "next/link";
import { ArrowRight, HelpCircle } from "lucide-react";
import Footer from "@/components/Footer";
import Carousal from "@/components/about-smartwave/carousal";
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}

      <main className="flex-grow">
        <Carousal />
        {/* /* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
                Create Your Digital Business Card
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Generate professional vCards in seconds. Share your contact information seamlessly.
              </p>
              <Link
                href="/admin/vcard-generator"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 
                  dark:bg-blue-700 dark:hover:bg-blue-800 
                  text-white rounded-lg transition-all duration-300 
                  transform hover:scale-105 hover:shadow-lg"
              >
                Create Now
                <ArrowRight className="animate-bounce-x" />
              </Link>
            </div>
          </div>
        </section>

        {/* /* Features Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50 via-blue-50/50 to-white dark:bg-none dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-12">
              Key Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Easy to Use",
                  description: "Simple form-based interface to create vCards quickly",
                  gradient: "from-blue-400/20 to-cyan-400/20",
                  darkGradient: "dark:from-blue-500/10 dark:to-cyan-500/10",
                  hover: "hover:from-blue-50 hover:to-white",
                  darkHover: "dark:hover:from-blue-900/20 dark:hover:to-gray-800"
                },
                {
                  title: "Professional Format",
                  description: "Generate standard VCF files compatible with all devices",
                  gradient: "from-purple-400/20 to-pink-400/20",
                  darkGradient: "dark:from-purple-500/10 dark:to-pink-500/10",
                  hover: "hover:from-purple-50 hover:to-white",
                  darkHover: "dark:hover:from-purple-900/20 dark:hover:to-gray-800"
                },
                {
                  title: "Custom Fields",
                  description: "Add additional information with custom fields support",
                  gradient: "from-emerald-400/20 to-teal-400/20",
                  darkGradient: "dark:from-emerald-500/10 dark:to-teal-500/10",
                  hover: "hover:from-emerald-50 hover:to-white",
                  darkHover: "dark:hover:from-emerald-900/20 dark:hover:to-gray-800"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white dark:bg-gray-800 p-6 rounded-xl 
                    shadow-lg dark:shadow-gray-900/50
                    hover:scale-105 hover:shadow-xl
                    dark:hover:shadow-gray-900/70
                    transform transition-all duration-300 ease-out
                    ${index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'}
                    hover:bg-gradient-to-br ${feature.hover} ${feature.darkHover}
                  `}
                >
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${feature.gradient} ${feature.darkGradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                  `} />
                  <h4 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 relative z-10">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 relative z-10 group-hover:text-gray-700 
                    dark:group-hover:text-gray-200"
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-12">
              Frequently Asked Questions
            </h3>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  q: "What is a vCard?",
                  a: "A vCard is a digital business card that can be shared electronically and imported into contact management systems.",
                  gradient: "from-amber-400/20 to-orange-400/20",
                  darkGradient: "dark:from-amber-500/10 dark:to-orange-500/10"
                },
                {
                  q: "How do I use the generated vCard?",
                  a: "Simply download the .vcf file and share it via email or messaging. Recipients can click to add it to their contacts.",
                  gradient: "from-rose-400/20 to-red-400/20",
                  darkGradient: "dark:from-rose-500/10 dark:to-red-500/10"
                },
                {
                  q: "Can I include my photo?",
                  a: "Yes, you can upload a profile photo and company logo to be included in your vCard.",
                  gradient: "from-indigo-400/20 to-violet-400/20",
                  darkGradient: "dark:from-indigo-500/10 dark:to-violet-500/10"
                }
              ].map((faq, index) => (
                <div
                  key={index}
                  className={`
                    group relative bg-white dark:bg-gray-800 p-6 rounded-xl 
                    shadow-lg dark:shadow-gray-900/50
                    hover:scale-105 hover:shadow-xl
                    dark:hover:shadow-gray-900/70
                    transform transition-all duration-300 ease-out
                    ${index % 2 === 0 ? 'hover:rotate-1' : 'hover:-rotate-1'}
                  `}
                >
                  <div className={`
                    absolute inset-0 bg-gradient-to-r ${faq.gradient} ${faq.darkGradient}
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl
                  `} />
                  <div className="flex items-start gap-3 relative z-10">
                    <HelpCircle className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-1 
                      group-hover:scale-110 transition-transform duration-300" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                        {faq.q}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 
                        dark:group-hover:text-gray-200"
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
