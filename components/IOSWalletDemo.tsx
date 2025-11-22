'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { flushSync } from 'react-dom';

export default function IOSWalletDemo() {
    const [showBadge, setShowBadge] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [showWalletPass, setShowWalletPass] = useState(false);
    const [badgeKey, setBadgeKey] = useState(0);
    const [notificationKey, setNotificationKey] = useState(0);
    const [walletPassKey, setWalletPassKey] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const badgeShowTimerRef = useRef<NodeJS.Timeout | null>(null);
    const walletPassTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const walletPassShowTimerRef = useRef<NodeJS.Timeout | null>(null);

    const showBadgeAndNotification = useCallback(() => {
        // Clear any existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        if (badgeShowTimerRef.current) {
            clearTimeout(badgeShowTimerRef.current);
            badgeShowTimerRef.current = null;
        }
        
        // Force synchronous update to hide first
        flushSync(() => {
            setShowBadge(false);
            setShowNotification(false);
        });
        
        // Show after a delay to trigger animation
        badgeShowTimerRef.current = setTimeout(() => {
            // Increment keys to force re-render and trigger animations
            flushSync(() => {
                setBadgeKey(prev => prev + 1);
                setNotificationKey(prev => prev + 1);
                setShowBadge(true);
                setShowNotification(true);
            });
            
            // Hide after 3 seconds
            timeoutRef.current = setTimeout(() => {
                flushSync(() => {
                    setShowBadge(false);
                    setShowNotification(false);
                });
                timeoutRef.current = null;
            }, 3000);
            
            badgeShowTimerRef.current = null;
        }, 200);
    }, []);

    // Show badge and notification on initial render for 3 seconds
    useEffect(() => {
        // Clear any existing timeouts
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (badgeShowTimerRef.current) clearTimeout(badgeShowTimerRef.current);
        
        // Always hide first to reset state - use flushSync to ensure it happens
        flushSync(() => {
            setShowBadge(false);
            setShowNotification(false);
        });
        
        // Show after a delay
        badgeShowTimerRef.current = setTimeout(() => {
            flushSync(() => {
                setBadgeKey(1);
                setNotificationKey(1);
                setShowBadge(true);
                setShowNotification(true);
            });
            
            // Hide after 3 seconds
            timeoutRef.current = setTimeout(() => {
                flushSync(() => {
                    setShowBadge(false);
                    setShowNotification(false);
                });
                timeoutRef.current = null;
            }, 3000);
            
            badgeShowTimerRef.current = null;
        }, 200);
        
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            if (badgeShowTimerRef.current) clearTimeout(badgeShowTimerRef.current);
        };
    }, []); // Empty deps - only run on mount

    // Expose function to window for button clicks
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).simulatePushUpdate = showBadgeAndNotification;
        }
        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).simulatePushUpdate;
            }
        };
    }, [showBadgeAndNotification]);

    const showWalletPassCard = useCallback(() => {
        // Clear any existing timeouts
        if (walletPassTimeoutRef.current) {
            clearTimeout(walletPassTimeoutRef.current);
            walletPassTimeoutRef.current = null;
        }
        if (walletPassShowTimerRef.current) {
            clearTimeout(walletPassShowTimerRef.current);
            walletPassShowTimerRef.current = null;
        }
        
        // Force synchronous update to hide first
        flushSync(() => {
            setShowWalletPass(false);
        });
        
        // Show after a delay
        walletPassShowTimerRef.current = setTimeout(() => {
            // Increment key and show
            flushSync(() => {
                setWalletPassKey(prev => prev + 1);
                setShowWalletPass(true);
            });
            
            // Hide after 3 seconds (2.2s visible + 0.8s fade-out animation)
            walletPassTimeoutRef.current = setTimeout(() => {
                // Wait for animation to complete before removing from DOM
                setTimeout(() => {
                    flushSync(() => {
                        setShowWalletPass(false);
                    });
                }, 800); // Wait for fade-out animation to complete
                walletPassTimeoutRef.current = null;
            }, 2200); // Start fade-out at 2.2s
            
            walletPassShowTimerRef.current = null;
        }, 200);
    }, []);

    // Show wallet pass on initial render for 3 seconds
    useEffect(() => {
        // Clear any existing timeouts
        if (walletPassTimeoutRef.current) clearTimeout(walletPassTimeoutRef.current);
        if (walletPassShowTimerRef.current) clearTimeout(walletPassShowTimerRef.current);
        
        // Always hide first to reset state - use flushSync to ensure it happens
        flushSync(() => {
            setShowWalletPass(false);
        });
        
        // Show after a delay
        walletPassShowTimerRef.current = setTimeout(() => {
            flushSync(() => {
                setWalletPassKey(1);
                setShowWalletPass(true);
            });
            
            // Hide after 3 seconds (2.2s visible + 0.8s fade-out animation)
            walletPassTimeoutRef.current = setTimeout(() => {
                // Wait for animation to complete before removing from DOM
                setTimeout(() => {
                    flushSync(() => {
                        setShowWalletPass(false);
                    });
                }, 800); // Wait for fade-out animation to complete
                walletPassTimeoutRef.current = null;
            }, 2200); // Start fade-out at 2.2s
            
            walletPassShowTimerRef.current = null;
        }, 200);
        
        return () => {
            if (walletPassTimeoutRef.current) clearTimeout(walletPassTimeoutRef.current);
            if (walletPassShowTimerRef.current) clearTimeout(walletPassShowTimerRef.current);
        };
    }, []); // Empty deps - only run on mount

    // Expose function to window for button clicks
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).addToWallet = showWalletPassCard;
        }
        return () => {
            if (typeof window !== 'undefined') {
                delete (window as any).addToWallet;
            }
        };
    }, [showWalletPassCard]);

    return (
        <div className="wallet-phone">
                <div className="wallet-screen ios-wallet-bg p-4 relative" id="iosWallet">
                    {/* Wallet Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Wallet</h2>
                        <div className="relative">
                            <span className="text-gray-600 dark:text-gray-400">🔍</span>
                        </div>
                    </div>

                    {/* Credit Cards Section */}
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">CARDS</h3>
                        <div className="wallet-card">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-blue-600 rounded mr-3 flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">V</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">Visa</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">•••• •••• •••• 1234</p>
                                    </div>
                                </div>
                                <span className="text-gray-400">⚡</span>
                            </div>
                        </div>
                    </div>

                    {/* Passes Section */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">PASSES</h3>

                        {/* SmartWave Business Card */}
                        {showWalletPass && (
                            <div 
                                key={walletPassKey}
                                className="wallet-card business-card wallet-pass-card wallet-pass-animate"
                                id="businessCard"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 bg-smart-teal rounded mr-3 flex items-center justify-center">
                                            <span className="text-smart-charcoal font-bold text-xs">SW</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">John Smith</p>
                                            <p className="text-sm opacity-80 text-gray-700 dark:text-gray-300">Creative Director</p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <span className="text-smart-teal">👔</span>
                                        {showBadge && (
                                            <div 
                                                key={badgeKey}
                                                className="notification-badge badge-animate"
                                            >
                                                1
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-xs opacity-60 text-gray-700 dark:text-gray-300">SmartWave Business Card</p>
                                    <span className="text-xs opacity-60">📱</span>
                                </div>
                            </div>
                        )}

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
                    {showNotification && (
                        <div 
                            key={notificationKey}
                            className="push-notification notification-animate"
                            id="pushNotification"
                        >
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
                    )}
                </div>
            </div>
    );
}
