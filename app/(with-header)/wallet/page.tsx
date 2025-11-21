import IOSWalletDemo from '@/components/IOSWalletDemo';

export default function WalletPage() {
    return (
        <main className="pt-20">
            {/* Hero Section */}
            <section id="wallet" className="pt-12 pb-20 bg-gradient-to-b from-smart-charcoal to-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                            Seamless <span className="text-gradient">Wallet Integration</span>
                            <br />
                            iOS & Google Pay
                        </h1>
                        <p className="text-xl text-smart-silver/80 max-w-3xl mx-auto">
                            Transform how professionals connect with SmartWave's native wallet integration. Add
                            digital business cards to Apple Wallet and Google Pay with a single tap.
                        </p>
                    </div>

                    {/* Two Column Layout: iOS Wallet Demo (Left) and Integration Steps (Right) */}
                    <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
                        {/* Left Column: iOS Wallet Demo */}
                        <div className="flex justify-center lg:justify-start">
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
                                        <h3 className="text-xl font-bold mb-2">One-Tap Addition</h3>
                                        <p className="text-smart-silver/80 mb-4">
                                            Users can add your SmartWave card to their wallet with a single tap. No complex
                                            setup or additional apps required.
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            <button className="bg-smart-teal hover:bg-smart-teal/80 text-smart-charcoal px-6 py-2 rounded-lg font-semibold transition-colors">
                                                Add to Wallet
                                            </button>
                                            <span className="text-sm text-smart-silver/60">📱 iOS & Android compatible</span>
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
                                        <h3 className="text-xl font-bold mb-2">Automatic Updates</h3>
                                        <p className="text-smart-silver/80 mb-4">
                                            When you update your information, all wallet cards update automatically via push
                                            notifications. Your contacts always have your latest details.
                                        </p>
                                        <button className="border border-smart-amber/30 hover:border-smart-amber text-smart-amber px-6 py-2 rounded-lg font-semibold transition-colors">
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
                                        <h3 className="text-xl font-bold mb-2">Multiple Card Management</h3>
                                        <p className="text-smart-silver/80 mb-4">
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

            {/* Technical Integration */}
            <section className="py-20 bg-gray-50 dark:bg-black">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                            Developer-Friendly <span className="text-gradient">Integration</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-smart-silver/80 max-w-3xl mx-auto">
                            Simple API integration that works with your existing tech stack. Get up and running in
                            hours, not weeks.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* API Code Example */}
                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Quick Start Code</h3>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-lg font-semibold mb-2 text-smart-teal">
                                        1. Create Wallet Pass
                                    </h4>
                                    <div className="bg-gray-100 dark:bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                        <div className="text-green-600 dark:text-green-400">// JavaScript/Node.js example</div>
                                        <div className="text-gray-900 dark:text-white">
                                            <span className="text-blue-600 dark:text-blue-400">const</span> pass ={' '}
                                            <span className="text-blue-600 dark:text-blue-400">await</span> smartwave.createPass({'{'}
                                            <br />
                                            &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">type</span>:{' '}
                                            <span className="text-orange-600 dark:text-orange-400">'businessCard'</span>,
                                            <br />
                                            &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">template</span>:{' '}
                                            <span className="text-orange-600 dark:text-orange-400">'professional'</span>,
                                            <br />
                                            &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">data</span>: {'{'}
                                            <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">name</span>:{' '}
                                            <span className="text-orange-600 dark:text-orange-400">'John Smith'</span>,
                                            <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">title</span>:{' '}
                                            <span className="text-orange-600 dark:text-orange-400">'Creative Director'</span>,
                                            <br />
                                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">company</span>:{' '}
                                            <span className="text-orange-600 dark:text-orange-400">'SmartWave Technologies'</span>
                                            <br />
                                            &nbsp;&nbsp;{'}'}
                                            <br />
                                            {'}'});
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-2 text-smart-teal">
                                        2. Generate Add-to-Wallet Button
                                    </h4>
                                    <div className="bg-gray-100 dark:bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                        <div className="text-gray-900 dark:text-white">
                                            <span className="text-blue-600 dark:text-blue-400">const</span> button ={' '}
                                            <span className="text-blue-600 dark:text-blue-400">await</span> smartwave.createWalletButton({'{'}
                                            <br />
                                            &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">passId</span>:{' '}
                                            pass.<span className="text-green-600 dark:text-green-400">id</span>,
                                            <br />
                                            &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">style</span>:{' '}
                                            <span className="text-orange-600 dark:text-orange-400">'black'</span>,
                                            <br />
                                            &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">language</span>:{' '}
                                            <span className="text-orange-600 dark:text-orange-400">'en'</span>
                                            <br />
                                            {'}'});
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-lg font-semibold mb-2 text-smart-teal">
                                        3. Handle Push Updates
                                    </h4>
                                    <div className="bg-gray-100 dark:bg-black/50 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                        <div className="text-gray-900 dark:text-white">
                                            smartwave.<span className="text-blue-600 dark:text-blue-400">onUpdate</span>(<span className="text-orange-600 dark:text-orange-400">'passUpdated'</span>,{' '}
                                            <span className="text-blue-600 dark:text-blue-400">async</span> (passId) =&gt; {'{'}
                                            <br />
                                            &nbsp;&nbsp;<span className="text-green-600 dark:text-green-400">// Push notification sent automatically</span>
                                            <br />
                                            &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">const</span> analytics ={' '}
                                            <span className="text-blue-600 dark:text-blue-400">await</span> smartwave.getPassAnalytics(passId);
                                            <br />
                                            {'}'});
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Integration Benefits */}
                        <div className="space-y-6">
                            <div className="integration-step p-6 rounded-2xl">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-smart-teal/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-smart-teal text-xl">⚡</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Lightning Fast Integration</h3>
                                        <p className="text-gray-600 dark:text-smart-silver/80">
                                            Get your SmartWave cards into wallets with just a few lines of code. Our SDK
                                            handles all the complexity of wallet integration.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="integration-step p-6 rounded-2xl">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-smart-amber/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-smart-amber text-xl">🔧</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Works with Any Tech Stack</h3>
                                        <p className="text-gray-600 dark:text-smart-silver/80">
                                            JavaScript, Python, PHP, Ruby - we've got you covered. RESTful APIs and
                                            webhooks make integration seamless regardless of your stack.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="integration-step p-6 rounded-2xl">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-green-500 text-xl">📊</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Real-time Analytics</h3>
                                        <p className="text-gray-600 dark:text-smart-silver/80">
                                            Track wallet additions, engagement metrics, and update delivery in real-time
                                            with comprehensive analytics dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="integration-step p-6 rounded-2xl relative">
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1 bg-smart-amber/20 text-smart-amber rounded-full text-xs font-medium">
                                        Upcoming Shortly
                                    </span>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-purple-500 text-xl">🛡️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Enterprise Security</h3>
                                        <p className="text-gray-600 dark:text-smart-silver/80">
                                            SOC 2 Type II certified with end-to-end encryption. Your data and your customers' data are protected with bank-level security.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Enterprise Features */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-smart-charcoal">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                            Enterprise-Grade <span className="text-gradient">Features</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-smart-silver/80 max-w-3xl mx-auto">
                            Scale your digital business card deployment with advanced management tools, bulk
                            operations, and comprehensive analytics.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <div className="enterprise-feature p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-smart-teal/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">👥</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Bulk Card Management</h3>
                            <p className="text-gray-600 dark:text-smart-silver/80 mb-4">
                                Create, update, and manage thousands of cards simultaneously with our enterprise
                                dashboard and API.
                            </p>
                            <ul className="text-sm text-gray-500 dark:text-smart-silver/60 space-y-2">
                                <li>• CSV import/export</li>
                                <li>• Bulk template updates</li>
                                <li>• Role-based permissions</li>
                                <li>• Automated provisioning</li>
                            </ul>
                        </div>

                        <div className="enterprise-feature p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-smart-amber/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Advanced Analytics</h3>
                            <p className="text-gray-600 dark:text-smart-silver/80 mb-4">
                                Comprehensive insights into card usage, engagement rates, and networking
                                effectiveness across your organization.
                            </p>
                            <ul className="text-sm text-gray-500 dark:text-smart-silver/60 space-y-2">
                                <li>• Real-time usage tracking</li>
                                <li>• Engagement analytics</li>
                                <li>• Geographic insights</li>
                                <li>• ROI calculations</li>
                            </ul>
                        </div>

                        <div className="enterprise-feature p-8 rounded-2xl">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-2xl">🔒</span>
                            </div>
                            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Enhanced Security</h3>
                            <p className="text-gray-600 dark:text-smart-silver/80 mb-4">
                                Advanced security features including SSO integration, audit logs, and compliance
                                reporting for regulated industries.
                            </p>
                            <ul className="text-sm text-gray-500 dark:text-smart-silver/60 space-y-2">
                                <li>• SSO integration</li>
                                <li>• Audit trail logging</li>
                                <li>• Compliance reporting</li>
                                <li>• Data residency options</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-50 dark:bg-[#1a1a1a]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                        Ready to Integrate with
                        <br />
                        <span style={{ color: '#00d4aa' }}>Apple Wallet</span>
                        {' '}&{' '}
                        <span style={{ color: '#ffb347' }}>Google Pay?</span>
                    </h2>
                    <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto cta-description">
                        Join leading companies who've already transformed their networking with SmartWave's
                        wallet integration.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                        <button 
                            className="px-8 py-4 rounded-xl font-semibold transition-colors text-white"
                            style={{ backgroundColor: '#00d4aa' }}
                        >
                            Start Free Trial
                        </button>
                        <button 
                            className="px-8 py-4 rounded-xl font-semibold transition-colors text-white border-2"
                            style={{ borderColor: 'rgba(255, 255, 255, 0.3)', backgroundColor: 'transparent' }}
                        >
                            Request Demo
                        </button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                <span style={{ color: '#00d4aa' }}>45</span> Days
                            </div>
                            <div className="text-sm md:text-base cta-stat-label">
                                Free Trial
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
                                <span style={{ color: '#ffb347' }}>24</span> Hours
                            </div>
                            <div className="text-sm md:text-base cta-stat-label">
                                Setup Time
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">99.9%</div>
                            <div className="text-sm md:text-base cta-stat-label">
                                Uptime SLA
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
