'use client';

export default function IOSWalletDemo() {
    return (
        <div className="wallet-phone">
                <div className="wallet-screen ios-wallet-bg p-4 relative" id="iosWallet">
                    {/* Wallet Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Wallet</h2>
                        <div className="relative">
                            <span className="text-gray-600">🔍</span>
                        </div>
                    </div>

                    {/* Credit Cards Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-600 mb-3">CARDS</h3>
                        <div className="wallet-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">V</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Visa</p>
                                        <p className="text-sm text-gray-600">•••• •••• •••• 1234</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">⚡</span>
                            </div>
                        </div>
                    </div>

                    {/* Passes Section */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 mb-3">PASSES</h3>

                        {/* SmartWave Business Card */}
                        <div className="wallet-card business-card" id="businessCard">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-smart-teal rounded mr-3 flex items-center justify-center">
                                        <span className="text-smart-charcoal font-bold text-xs">SW</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">John Smith</p>
                                        <p className="text-sm opacity-80 text-gray-700">Creative Director</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <span className="text-smart-teal">👔</span>
                                    <div className="notification-badge">1</div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs opacity-60 text-gray-700">SmartWave Business Card</p>
                                <span className="text-xs opacity-60">📱</span>
                            </div>
                        </div>

                        {/* Loyalty Card */}
                        <div className="wallet-card loyalty-card">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-red-600 rounded mr-3 flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">★</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Coffee Shop Rewards</p>
                                        <p className="text-sm opacity-80 text-gray-700">12 points</p>
                                    </div>
                                </div>
                                <span className="text-smart-amber">⭐</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs opacity-60 text-gray-700">Loyalty Program</p>
                                <span className="text-xs opacity-60">☕</span>
                            </div>
                        </div>

                        {/* Event Ticket */}
                        <div className="wallet-card event-card">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-purple-600 rounded mr-3 flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">🎫</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">Tech Conference 2025</p>
                                        <p className="text-sm opacity-80 text-gray-700">March 15, 2025</p>
                                    </div>
                                </div>
                                <span className="text-smart-teal">🎪</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs opacity-60 text-gray-700">Event Ticket</p>
                                <span className="text-xs opacity-60">📅</span>
                            </div>
                        </div>
                    </div>

                    {/* Push Notification Demo */}
                    <div className="push-notification" id="pushNotification">
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-smart-teal rounded mr-3 flex items-center justify-center">
                                <span className="text-smart-charcoal font-bold text-xs">SW</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-white">John Smith updated his contact info</p>
                                <p className="text-xs text-gray-800 dark:text-gray-600">Tap to view updated card</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}
