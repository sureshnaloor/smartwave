'use client';

import { useEffect } from 'react';
import DemoHero from '@/components/demo/DemoHero';
import CardCustomizer from '@/components/demo/CardCustomizer';
import MarketGrowth from '@/components/demo/MarketGrowth';
import SocialProof from '@/components/demo/SocialProof';
import DemoPricing from '@/components/demo/DemoPricing';
import WalletDemo from '@/components/demo/WalletDemo';
import Footer from '@/components/Footer';

export default function DemoPage() {
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
      // Could open a video modal or navigate to a demo page
      console.log('Play demo clicked');
    };

    // Contact sales function
    (window as any).contactSales = () => {
      // Could open a contact form or navigate to contact page
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
      <DemoHero />
      <CardCustomizer />
      <WalletDemo />
      <MarketGrowth />
      <SocialProof />
      <DemoPricing />
      <Footer />
    </div>
  );
}

