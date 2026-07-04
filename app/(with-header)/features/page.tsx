import PhoneDemo from '@/components/PhoneDemo';
import IndustryUseCases from '@/components/IndustryUseCases';
import ROICalculator from '@/components/ROICalculator';
import Footer from '@/components/Footer';

export default function FeaturesPage() {
    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section id="features" className="pt-12 pb-20 sw-aurora-bg bg-gradient-to-b from-sw-deepest to-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                            Powerful <span className="text-gradient">Features</span>
                            <br />
                            for Modern Networking
                        </h1>
                        <p className="text-xl text-smart-silver/80 max-w-3xl mx-auto">
                            Discover how SmartWave's comprehensive NFC technology stack transforms professional
                            connections with seamless integration, advanced security, and unlimited customization.
                        </p>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        <div className="sw-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-smart-teal/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">📱</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">iOS Wallet Integration</h3>
                            <p className="text-sw-text-secondary mb-4">
                                Seamlessly add your digital business cards to Apple Wallet with one tap. Push
                                notifications keep your contacts updated automatically.
                            </p>
                            <ul className="text-sm text-sw-text-muted space-y-2">
                                <li>• One-tap wallet addition</li>
                                <li>• Automatic push updates</li>
                                <li>• Multiple card management</li>
                                <li>• Lock screen notifications</li>
                            </ul>
                        </div>

                        <div className="sw-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-smart-amber/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">🎨</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">15+ Premium Themes</h3>
                            <p className="text-sw-text-secondary mb-4">
                                Choose from professionally designed themes that match your brand identity. From
                                minimalist to luxury, we have your style.
                            </p>
                            <ul className="text-sm text-sw-text-muted space-y-2">
                                <li>• Industry-specific designs</li>
                                <li>• Custom color palettes</li>
                                <li>• Typography options</li>
                                <li>• Brand consistency tools</li>
                            </ul>
                        </div>

                        <div className="sw-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">QR Code Integration</h3>
                            <p className="text-sw-text-secondary mb-4">
                                Dynamic QR codes that never expire. Update your information anytime without
                                reprinting cards or changing codes.
                            </p>
                            <ul className="text-sm text-sw-text-muted space-y-2">
                                <li>• Dynamic QR generation</li>
                                <li>• Real-time updates</li>
                                <li>• Scan analytics</li>
                                <li>• Custom QR designs</li>
                            </ul>
                        </div>

                        <div className="sw-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Enterprise Security</h3>
                            <p className="text-sw-text-secondary mb-4">
                                SOC 2 Type II certified with end-to-end encryption. Your data is protected with
                                bank-level security standards.
                            </p>
                            <ul className="text-sm text-sw-text-muted space-y-2">
                                <li>• SOC 2 Type II certified</li>
                                <li>• End-to-end encryption</li>
                                <li>• GDPR compliant</li>
                                <li>• Regular security audits</li>
                            </ul>
                        </div>

                        <div className="sw-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-pink-500/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Advanced Analytics</h3>
                            <p className="text-sw-text-secondary mb-4">
                                Track engagement metrics, connection rates, and ROI. Understand how your networking
                                efforts translate to business results.
                            </p>
                            <ul className="text-sm text-sw-text-muted space-y-2">
                                <li>• Real-time engagement tracking</li>
                                <li>• Connection conversion rates</li>
                                <li>• Geographic insights</li>
                                <li>• ROI calculations</li>
                            </ul>
                        </div>

                        <div className="sw-card p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">🌱</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-white">Sustainability Impact</h3>
                            <p className="text-sw-text-secondary mb-4">
                                Join the movement to save 7 million trees annually. Digital cards eliminate paper
                                waste while enhancing your professional image.
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
                                See SmartWave in <span className="text-gradient">Action</span>
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

            {/* ROI Calculator */}
            <section className="py-20 bg-gray-50 dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <ROICalculator />
                </div>
            </section>

            {/* Comparison Table */}
            <section className="py-20 bg-white dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                            Why SmartWave <span className="text-gradient">Wins</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-smart-silver/80">
                            Compare SmartWave against traditional business cards and other digital solutions
                        </p>
                    </div>

                    <div className="comparison-table rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-smart-teal/10">
                                    <tr>
                                        <th className="text-left p-6 font-semibold text-gray-900 dark:text-white">Feature</th>
                                        <th className="text-center p-6 font-semibold text-smart-teal">SmartWave</th>
                                        <th className="text-center p-6 font-semibold text-gray-900 dark:text-white">Traditional Cards</th>
                                        <th className="text-center p-6 font-semibold text-gray-900 dark:text-white">Other Digital</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t border-gray-200 dark:border-white/10">
                                        <td className="p-6 font-medium text-gray-900 dark:text-white">Instant Information Update</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                        <td className="text-center p-6 text-yellow-400">~</td>
                                    </tr>
                                    <tr className="border-t border-gray-200 dark:border-white/10">
                                        <td className="p-6 font-medium text-gray-900 dark:text-white">iOS Wallet Integration</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                    </tr>
                                    <tr className="border-t border-gray-200 dark:border-white/10">
                                        <td className="p-6 font-medium text-gray-900 dark:text-white">Advanced Analytics</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                        <td className="text-center p-6 text-yellow-400">~</td>
                                    </tr>
                                    <tr className="border-t border-gray-200 dark:border-white/10">
                                        <td className="p-6 font-medium text-gray-900 dark:text-white">Enterprise Security</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                        <td className="text-center p-6 text-yellow-400">~</td>
                                    </tr>
                                    <tr className="border-t border-gray-200 dark:border-white/10">
                                        <td className="p-6 font-medium text-gray-900 dark:text-white">Environmental Impact</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                    </tr>
                                    <tr className="border-t border-gray-200 dark:border-white/10">
                                        <td className="p-6 font-medium text-gray-900 dark:text-white">15+ Premium Themes</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                        <td className="text-center p-6 text-yellow-400">~</td>
                                    </tr>
                                    <tr className="border-t border-gray-200 dark:border-white/10">
                                        <td className="p-6 font-medium text-gray-900 dark:text-white">No App Required</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-green-400">✓</td>
                                        <td className="text-center p-6 text-red-400">✗</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-[#1a1a1a]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-smart-charcoal dark:text-white">
                        Ready to Transform Your
                        <br />
                        <span className="text-gradient">Networking Game?</span>
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-stone-900 dark:text-white">
                        Join thousands of professionals who've already made the switch to SmartWave. Start your
                        free trial today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="sw-btn-primary px-8 py-4 font-semibold">
                            Start Free Trial
                        </button>
                        <button className="sw-btn-premium px-8 py-4 font-semibold border-2 border-transparent">
                            Schedule Demo
                        </button>
                    </div>
                </div>
            </section>
        
        <Footer />
        </main>
    );
}
