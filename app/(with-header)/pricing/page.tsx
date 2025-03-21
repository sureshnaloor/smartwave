import { Check, Info } from 'lucide-react'
import Link from 'next/link'
import Footer from '@/components/Footer'
import { headers } from 'next/headers';
import { detectUserLocation } from '@/lib/geoLocation';
import { getCurrencyForCountry } from '@/lib/currencyMapper';
import PriceDisplay from '@/components/PriceDisplay';

export default async function PricingPage() {
  const headersList = headers();
  const { countryCode } = await detectUserLocation(headersList);
  const currencyInfo = await getCurrencyForCountry(countryCode);

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
              <PriceDisplay amount={0} currencyInfo={currencyInfo} />
              <span className="text-base font-normal text-gray-600 dark:text-gray-400">/forever</span>
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">1 Week Unlimited Trial</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Unlimited Edits & Downloads (during trial)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Free Public Profile with QR Code</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">vCard Add to Contacts</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">Basic Template</span>
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">One-Time Plan with Free NFC Card</h2>
            <div className="space-y-4 mb-8">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">PVC Card with QR</h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  <span className="scale-66"><PriceDisplay amount={19} currencyInfo={currencyInfo} /></span>
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">NFC Card with QR</h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  <span className="scale-66"><PriceDisplay amount={49.99} currencyInfo={currencyInfo} /></span>
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Color NFC Card</h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  <span className="scale-66"><PriceDisplay amount={99.99} currencyInfo={currencyInfo} /></span>
                </p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Metallic/Bamboo NFC Card</h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  <span className="scale-66"><PriceDisplay amount={149.99} currencyInfo={currencyInfo} /></span>
                </p>
              </div>
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Profile Editing Plans</h2>
            <div className="space-y-4 mb-8">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Annual Unlimited</h3>
                <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  <span className="scale-66"><PriceDisplay amount={9.99} currencyInfo={currencyInfo} /></span>
                  <span className="text-sm font-normal">/year</span>
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">5 Edits Plan</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  <PriceDisplay amount={2.99} currencyInfo={currencyInfo} />
                  <span className="text-base font-normal">/year</span>
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="font-semibold text-gray-900 dark:text-white">Single Edit</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                  <PriceDisplay amount={0.99} currencyInfo={currencyInfo} />
                </p>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
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
            </ul>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-8">
              <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">Coming Soon!</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Join our community to enjoy all privileges and access to 6 SMART apps</p>
            </div>
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