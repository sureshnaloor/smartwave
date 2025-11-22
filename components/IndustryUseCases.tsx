'use client';

import { useState } from 'react';

type ColorKey = 'blue' | 'green' | 'purple' | 'orange';

const colorClasses: Record<ColorKey, string> = {
    blue: 'bg-blue-500/20',
    green: 'bg-green-500/20',
    purple: 'bg-purple-500/20',
    orange: 'bg-orange-500/20'
};

const industryData = {
    'real-estate': {
        title: 'Real Estate',
        description: 'Property listings integration',
        icon: '🏠',
        color: 'blue',
        content: 'Showcase property listings directly on your SmartWave card. Clients can instantly view available properties, schedule viewings, and access virtual tours with a single tap.',
        features: [
            'Property listings with high-res photos',
            'Virtual tour integration',
            'One-tap scheduling for viewings',
            'Direct contact with listing agents',
            'Neighborhood insights and market data',
            'Mortgage calculator integration'
        ],
        visualContent: '🏘️'
    },
    'consulting': {
        title: 'Consulting',
        description: 'Client case studies',
        icon: '💼',
        color: 'green',
        content: 'Share your expertise through embedded case studies and client testimonials. Showcase your track record and build trust instantly during networking events.',
        features: [
            'Embedded case study presentations',
            'Client testimonial videos',
            'Industry expertise showcase',
            'Service offering details',
            'Certification and credential display',
            'Direct consultation booking'
        ],
        visualContent: '📊'
    },
    'creative': {
        title: 'Creative',
        description: 'Portfolio showcase',
        icon: '🎨',
        color: 'purple',
        content: 'Display your creative portfolio with high-resolution images, video reels, and interactive galleries. Let your work speak for itself with instant access to your best projects.',
        features: [
            'Interactive portfolio galleries',
            'Video reel integration',
            'Project case studies',
            'Client collaboration showcase',
            'Award and recognition display',
            'Direct project inquiry forms'
        ],
        visualContent: '🎭'
    },
    'tech': {
        title: 'Technology',
        description: 'API integrations',
        icon: '💻',
        color: 'orange',
        content: 'Integrate with your existing tech stack. Connect SmartWave cards to CRM systems, GitHub profiles, product demos, and technical documentation seamlessly.',
        features: [
            'GitHub profile integration',
            'Live product demos',
            'Technical documentation links',
            'API endpoint showcase',
            'Code repository access',
            'Developer blog integration'
        ],
        visualContent: '⚡'
    }
};

export default function IndustryUseCases() {
    const [activeIndustry, setActiveIndustry] = useState<'real-estate' | 'consulting' | 'creative' | 'tech'>('real-estate');

    return (
        <section className="py-20 bg-gray-50 dark:bg-black">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                        Industry-Specific <span className="text-gradient">Solutions</span>
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-smart-silver/80 max-w-3xl mx-auto">
                        SmartWave adapts to your industry's unique networking needs with specialized features and integrations.
                    </p>
                </div>

                <div className="grid lg:grid-cols-4 gap-6 mb-12">
                    {Object.entries(industryData).map(([key, data]) => {
                        return (
                            <div
                                key={key}
                                className={`industry-card p-6 rounded-2xl cursor-pointer transition-all ${
                                    activeIndustry === key ? 'active' : ''
                                }`}
                                onClick={() => setActiveIndustry(key as typeof activeIndustry)}
                            >
                                <div className={`w-12 h-12 ${colorClasses[data.color as ColorKey]} rounded-lg flex items-center justify-center mb-4`}>
                                    <span className="text-2xl">{data.icon}</span>
                                </div>
                                <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">{data.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-smart-silver/60">{data.description}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Use Case Demo */}
                <div className="use-case-demo p-8 rounded-2xl">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Visual Content */}
                        <div className="flex flex-col items-center justify-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-smart-teal/20 to-smart-amber/20 rounded-3xl flex items-center justify-center mb-6">
                                <span className="text-6xl">{industryData[activeIndustry].visualContent}</span>
                            </div>
                            <div className="text-center">
                                <h3 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
                                    {industryData[activeIndustry].title} <span className="text-gradient">Solution</span>
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-smart-silver/80 max-w-md">
                                    {industryData[activeIndustry].content}
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Features List */}
                        <div>
                            <h4 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Key Features</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                                {industryData[activeIndustry].features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-3 p-4 bg-gray-100 dark:bg-white/5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                                    >
                                        <div className="w-6 h-6 bg-smart-teal/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-smart-teal text-xs">✓</span>
                                        </div>
                                        <span className="text-gray-700 dark:text-smart-silver/80 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

