import { Check, Info } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section for Card Store */}
      <div className="border-b border-teal-500 pb-6 text-center mb-2 pt-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Our <span className="text-cyan-600">Card Store</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
          Explore our exclusive collection of digital SmartWave business cards tailored for your needs.
        </p>
        <Link 
          href="/store"
          className="inline-block px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
        >
          Visit the Card Store
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent <span className="text-cyan-600">Pricing</span>
          </h1>
          <h3 className="text-gray-800 dark:text-gray-300 text-xl italic mb-4"> For virtual business cards and enterprise solutions </h3>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Choose the plan that best fits your needs
          </p>
        </div>

        {/* Free Tier */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-t-4 border-gray-400">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Free Tier</h2>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              $0
              <span className="text-base font-normal text-gray-600 dark:text-gray-400">/forever</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">1 Virtual Business Card</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">1 vCard Download</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Basic Templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Standard Support</span>
              </li>
            </ul>
            <Link 
              href="/auth/signup"
              className="block w-full px-6 py-3 text-center bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* One-Time Payment Plans */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-t-4 border-cyan-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">One-Time Plans</h2>
            <div className="space-y-6 mb-8">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">1-10 Cards</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$20<span className="text-base font-normal">/card</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Example: 5 cards = $100</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">11-100 Cards</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$15<span className="text-base font-normal">/card</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Example: 50 cards = $750</p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">101-1000 Cards</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">$10<span className="text-base font-normal">/card</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Example: 500 cards = $5,000</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 text-cyan-600" />
                <p>All one-time plans include:</p>
              </div>
              <ul className="ml-6 mt-2 space-y-2">
                <li>• Premium templates</li>
                <li>• vCard downloads</li>
                <li>• One year of updates</li>
                <li>• Basic support</li>
              </ul>
            </div>
            <Link 
              href="/contact"
              className="block w-full px-6 py-3 text-center bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
            >
              Contact Sales
            </Link>
          </div>

          {/* Subscription Plan */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-t-4 border-purple-600">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Subscription</h2>
            <div className="mb-6">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                $29
                <span className="text-base font-normal text-gray-600 dark:text-gray-400">/month</span>
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                or $290/year (save 20%)
              </p>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Upto 100 Cards</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Premium Templates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Priority Support</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Continuous Updates</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Advanced Analytics</span>
              </li>
            </ul>
            <Link 
              href="/auth/signup"
              className="block w-full px-6 py-3 text-center bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Start the journey
            </Link>
          </div>
        </div>

        {/* Enterprise Section */}
        <div className="bg-gradient-to-r from-cyan-600 to-purple-600 p-8 rounded-lg text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Need More Than 1000 Cards?</h2>
          <p className="mb-6">Get in touch with our enterprise team for volume discounts and custom solutions</p>
          <Link 
            href="/contact"
            className="inline-block px-6 py-3 bg-white text-cyan-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Contact Enterprise Sales
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  )
} 