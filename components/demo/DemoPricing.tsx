'use client';

import { useRouter } from 'next/navigation';

export default function DemoPricing() {
  const router = useRouter();

  const contactSales = () => {
    router.push('/contact-us');
  };

  const startTrial = () => {
    router.push('/pricing');
  };

  return (
    <section className="py-20 bg-smart-charcoal">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6">Choose Your SmartWave Plan</h2>
          <p className="text-xl text-smart-silver/80">Flexible pricing for professionals and enterprises</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Starter */}
          <div className="price-card p-8 rounded-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Starter</h3>
              <p className="text-smart-silver/60">Perfect for individuals</p>
              <div className="text-4xl font-bold mt-4">
                $29<span className="text-lg text-smart-silver/60">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>5 NFC cards</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>10 premium themes</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>QR code generation</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>Basic analytics</span>
              </li>
            </ul>

            <button
              onClick={startTrial}
              className="w-full border border-smart-silver/30 hover:border-smart-teal text-smart-silver hover:text-smart-teal py-3 rounded-lg font-semibold transition-colors"
            >
              Start Free Trial
            </button>
          </div>

          {/* Professional (Featured) */}
          <div className="price-card featured p-8 rounded-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-3 py-1 bg-smart-teal text-smart-charcoal rounded-full text-sm font-medium mb-4">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Professional</h3>
              <p className="text-smart-silver/60">For growing businesses</p>
              <div className="text-4xl font-bold mt-4">
                $79<span className="text-lg text-smart-silver/60">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>25 NFC cards</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>All premium themes</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>iOS Wallet integration</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>Advanced analytics</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>Team management</span>
              </li>
            </ul>

            <button
              onClick={startTrial}
              className="w-full bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal py-3 rounded-lg font-semibold transition-colors"
            >
              Start Free Trial
            </button>
          </div>

          {/* Enterprise */}
          <div className="price-card p-8 rounded-2xl">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <p className="text-smart-silver/60">For large organizations</p>
              <div className="text-4xl font-bold mt-4">Custom</div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>Unlimited cards</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>Custom branding</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>API access</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>Advanced security</span>
              </li>
              <li className="flex items-center">
                <span className="text-smart-teal mr-3">✓</span>
                <span>Dedicated support</span>
              </li>
            </ul>

            <button
              onClick={contactSales}
              className="w-full border border-smart-silver/30 hover:border-smart-teal text-smart-silver hover:text-smart-teal py-3 rounded-lg font-semibold transition-colors"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

