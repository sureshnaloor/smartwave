'use client';

import { useEffect } from 'react';
import { Smartphone, Palette, QrCode, ShieldCheck, BarChart, Leaf } from "lucide-react";
import DemoHero from '@/components/demo/DemoHero';
import CardCustomizer from '@/components/demo/CardCustomizer';
import MarketGrowth from '@/components/demo/MarketGrowth';
import SocialProof from '@/components/demo/SocialProof';
import DemoPricing from '@/components/demo/DemoPricing';
import WalletDemo from '@/components/demo/WalletDemo';
import IOSWalletDemo from '@/components/IOSWalletDemo';
import PhoneDemo from '@/components/PhoneDemo';
import IndustryUseCases from '@/components/IndustryUseCases';
import ROICalculator from '@/components/ROICalculator';
import Processflow from '@/components/landing/Processflow';
import Sustainability from '@/components/landing/Sustainability';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/Footer';
import AuroraBackground from '@/components/ui/AuroraBackground';

export default function HomePage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Scroll to customizer function
    (window as any).scrollToCustomizer = () => {
      const element = document.getElementById('customizer');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Play demo function
    (window as any).playDemo = () => {
      console.log('Play demo clicked');
    };

    // Contact sales function
    (window as any).contactSales = () => {
      window.location.href = '/contact-us';
    };

    return () => {
      delete (window as any).scrollToCustomizer;
      delete (window as any).playDemo;
      delete (window as any).contactSales;
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Using DemoHero for better visual impact */}
      <DemoHero />

      {/* Card Customizer */}
      <CardCustomizer />

      {/* Process Flow - How it works */}
      <Processflow />

      {/* Wallet Integration Section */}
      <section id="wallet" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-smart-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Seamless <span className="text-gradient">Wallet Integration</span>
              <br />
              iOS & Google Pay
            </h2>
            <p className="text-xl text-gray-600 dark:text-smart-silver/80 max-w-3xl mx-auto">
              Transform how professionals connect with SmartWave's native wallet integration. Add
              digital business cards to Apple Wallet and Google Pay with a single tap.
            </p>
          </div>

          {/* Two Column Layout: iOS Wallet Demo (Left) and Integration Steps (Right) */}
          <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
            {/* Left Column: iOS Wallet Demo */}
            <div className="flex justify-center lg:justify-start modern-left">
              <IOSWalletDemo />
            </div>

            {/* Right Column: Integration Steps */}
            <div className="space-y-6">
              <div className="integration-step p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-smart-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-smart-teal text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">One-Tap Addition</h3>
                    <p className="text-sw-text-secondary mb-4">
                      Users can add your SmartWave card to their wallet with a single tap. No complex
                      setup or additional apps required.
                    </p>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          if (typeof window !== 'undefined' && (window as any).addToWallet) {
                            (window as any).addToWallet();
                          }
                        }}
                        className="sw-btn-primary px-6 py-2 font-semibold"
                      >
                        Add to Wallet
                      </button>
                      <span className="text-sm text-gray-500 dark:text-smart-silver/60">📱 iOS & Android compatible</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="integration-step p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-smart-amber/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-smart-amber text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Automatic Updates</h3>
                    <p className="text-sw-text-secondary mb-4">
                      When you update your information, all wallet cards update automatically via push
                      notifications. Your contacts always have your latest details.
                    </p>
                    <button
                      onClick={() => {
                        if (typeof window !== 'undefined' && (window as any).simulatePushUpdate) {
                          (window as any).simulatePushUpdate();
                        }
                      }}
                      className="border border-smart-amber/30 hover:border-smart-amber text-smart-amber px-6 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Simulate Push Update
                    </button>
                  </div>
                </div>
              </div>

              <div className="integration-step p-6 rounded-2xl">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-blue-500 text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Multiple Card Management</h3>
                    <p className="text-sw-text-secondary mb-4">
                      Manage multiple SmartWave cards for different contexts - business, personal,
                      conference-specific, or role-based cards with instant switching.
                    </p>
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-smart-teal/20 text-smart-teal rounded-full text-sm">
                        Business
                      </span>
                      <span className="px-3 py-1 bg-smart-amber/20 text-smart-amber rounded-full text-sm">
                        Personal
                      </span>
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
                        Conference
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wallet Demo Component */}


      {/* Features Grid Section */}
      <section id="features" className="py-20 bg-white dark:bg-black relative overflow-hidden">
        <AuroraBackground />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
              Everything Your Paper Card
              <br />
              <span className="text-gradient">Wishes It Could Do</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-smart-silver/80 max-w-3xl mx-auto">
              Discover how SmartWave's comprehensive NFC technology stack transforms professional
              connections with seamless integration, advanced security, and unlimited customization.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            <div className="sw-card sw-gradient-border sw-glow p-8 rounded-2xl">
              <div className="w-12 h-12 bg-smart-teal/10 rounded-lg flex items-center justify-center mb-6 text-smart-teal">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white">iOS Wallet Integration</h3>
              <p className="text-sw-text-secondary mb-4">
                Add your digital card to Apple Wallet in one tap. Your contacts stay updated automatically via push notifications.
              </p>
              <ul className="text-sm text-sw-text-muted space-y-2">
                <li>• One-tap wallet addition</li>
                <li>• Automatic push updates</li>
                <li>• Multiple card management</li>
                <li>• Lock screen notifications</li>
              </ul>
            </div>

            <div className="sw-card sw-gradient-border sw-glow p-8 rounded-2xl">
              <div className="w-12 h-12 bg-smart-teal/10 rounded-lg flex items-center justify-center mb-6 text-smart-teal">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white">15+ Premium Themes</h3>
              <p className="text-sw-text-secondary mb-4">
                Select from professional themes tailored to your brand identity, ranging from minimalist designs to luxury aesthetics.
              </p>
              <ul className="text-sm text-sw-text-muted space-y-2">
                <li>• Industry-specific designs</li>
                <li>• Custom color palettes</li>
                <li>• Typography options</li>
                <li>• Brand consistency tools</li>
              </ul>
            </div>

            <div className="sw-card sw-gradient-border sw-glow p-8 rounded-2xl">
              <div className="w-12 h-12 bg-smart-teal/10 rounded-lg flex items-center justify-center mb-6 text-smart-teal">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white">QR Code Integration</h3>
              <p className="text-sw-text-secondary mb-4">
                Share via dynamic QR codes that never expire. Update your details anytime without ever reprinting your cards.
              </p>
              <ul className="text-sm text-sw-text-muted space-y-2">
                <li>• Dynamic QR generation</li>
                <li>• Real-time updates</li>
                <li>• Scan analytics</li>
                <li>• Custom QR designs</li>
              </ul>
            </div>

            <div className="sw-card sw-gradient-border sw-glow p-8 rounded-2xl">
              <div className="w-12 h-12 bg-smart-teal/10 rounded-lg flex items-center justify-center mb-6 text-smart-teal">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white">Enterprise Security</h3>
              <p className="text-sw-text-secondary mb-4">
                Bank-level security standards with SOC 2 Type II certification and end-to-end encryption for your data.
              </p>
              <ul className="text-sm text-sw-text-muted space-y-2">
                <li>• SOC 2 Type II certified</li>
                <li>• End-to-end encryption</li>
                <li>• GDPR compliant</li>
                <li>• Regular security audits</li>
              </ul>
            </div>

            <div className="sw-card sw-gradient-border sw-glow p-8 rounded-2xl">
              <div className="w-12 h-12 bg-smart-teal/10 rounded-lg flex items-center justify-center mb-6 text-smart-teal">
                <BarChart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white">Advanced Analytics</h3>
              <p className="text-sw-text-secondary mb-4">
                Track engagement, connection rates, and ROI to see exactly how your networking translates into real business results.
              </p>
              <ul className="text-sm text-sw-text-muted space-y-2">
                <li>• Real-time engagement tracking</li>
                <li>• Connection conversion rates</li>
                <li>• Geographic insights</li>
                <li>• ROI calculations</li>
              </ul>
            </div>

            <div className="sw-card sw-gradient-border sw-glow p-8 rounded-2xl">
              <div className="w-12 h-12 bg-smart-teal/10 rounded-lg flex items-center justify-center mb-6 text-smart-teal">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-4 text-white">Sustainability Impact</h3>
              <p className="text-sw-text-secondary mb-4">
                Eliminate paper waste and elevate your professional image. Join our movement to save 7 million trees every year.
              </p>
              <ul className="text-sm text-sw-text-muted space-y-2">
                <li>• Zero paper waste</li>
                <li>• Carbon footprint reduction</li>
                <li>• ESG compliance support</li>
                <li>• Environmental reporting</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Card Demo */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Your Card Lives in Their Wallet — <span className="text-gradient">Permanently</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-smart-silver/80 mb-8">
                Experience the seamless NFC interaction. Simply tap your SmartWave card to any
                smartphone to instantly share your professional information.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-smart-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-smart-teal text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Tap to Connect</h4>
                    <p className="text-gray-600 dark:text-smart-silver/80">
                      Simply tap your SmartWave card to the back of any smartphone. No app required
                      on the recipient's device.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-smart-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-smart-teal text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Instant Transfer</h4>
                    <p className="text-gray-600 dark:text-smart-silver/80">
                      Your contact information, portfolio, and social links are instantly shared in
                      a beautiful, mobile-optimized format.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-smart-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-smart-teal text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Save & Connect</h4>
                    <p className="text-gray-600 dark:text-smart-silver/80">
                      Recipients can save your information directly to their contacts or add your
                      card to their digital wallet.
                    </p>
                  </div>
                </div>
              </div>

              <button className="sw-btn-primary px-8 py-4 font-semibold">
                Try Interactive Demo
              </button>
            </div>

            {/* Phone Demo */}
            <PhoneDemo />
          </div>
        </div>
      </section>

      {/* Industry Use Cases */}
      <IndustryUseCases />

      {/* Market Growth / Enterprise Solutions */}
      <MarketGrowth />

      {/* ROI Calculator */}
      <section className="py-20 bg-gray-50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <ROICalculator />
        </div>
      </section>

      {/* Social Proof */}
      <SocialProof />

      {/* Sustainability */}
      <Sustainability />

      {/* Pricing */}
      <DemoPricing />

      {/* Testimonials */}
      <Testimonials />
    </div>
  );
}