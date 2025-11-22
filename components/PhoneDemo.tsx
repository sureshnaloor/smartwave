'use client';

import { useEffect, useRef } from 'react';

export default function PhoneDemo() {
    const nfcAnimationRef = useRef<HTMLDivElement>(null);
    const cardOverlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulate NFC tap interaction
        const handleTap = () => {
            if (cardOverlayRef.current) {
                cardOverlayRef.current.classList.remove('opacity-0');
                cardOverlayRef.current.classList.add('opacity-100');
            }
        };

        const demoScreen = document.getElementById('demoScreen');
        if (demoScreen) {
            demoScreen.addEventListener('click', handleTap);
            return () => {
                demoScreen.removeEventListener('click', handleTap);
            };
        }
    }, []);

    return (
        <div className="flex justify-center">
            <div className="demo-phone">
                <div className="demo-screen flex items-center justify-center relative" id="demoScreen">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-smart-teal/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📱</span>
                        </div>
                        <p className="text-gray-600 dark:text-smart-silver/60">Tap a SmartWave card here</p>
                    </div>

                    {/* NFC Animation */}
                    <div className="nfc-simulation" id="nfcAnimation" ref={nfcAnimationRef}></div>

                    {/* Demo Card Overlay */}
                    <div
                        className="absolute inset-0 bg-black/90 flex items-center justify-center opacity-0 transition-opacity duration-300"
                        id="cardOverlay"
                        ref={cardOverlayRef}
                        onClick={(e) => {
                            if (e.target === e.currentTarget && cardOverlayRef.current) {
                                cardOverlayRef.current.classList.remove('opacity-100');
                                cardOverlayRef.current.classList.add('opacity-0');
                            }
                        }}
                    >
                        <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-black">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-smart-teal to-smart-amber rounded-lg flex items-center justify-center mr-4">
                                    <span className="text-smart-charcoal font-bold">JS</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">John Smith</h3>
                                    <p className="text-gray-600 text-sm">Creative Director</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-3">📧</span>
                                    <span className="text-sm">john.smith@company.com</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-3">📱</span>
                                    <span className="text-sm">+1 (555) 123-4567</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-3">🌐</span>
                                    <span className="text-sm">www.company.com</span>
                                </div>
                                <div className="flex items-center">
                                    <span className="text-gray-500 mr-3">💼</span>
                                    <span className="text-sm">linkedin.com/in/johnsmith</span>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button className="flex-1 bg-smart-teal text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-smart-teal/80 transition-colors">
                                    Save Contact
                                </button>
                                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                    Add to Wallet
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

