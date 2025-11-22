"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useMemo } from "react";
import dynamic from 'next/dynamic';
import LoadingSpinner from "@/components/LoadingSpinner";

// Dynamically import components with no SSR to prevent hydration issues
const Hero = dynamic(() => import("@/components/landing/Hero"), { ssr: false });
const Processflow = dynamic(() => import("@/components/landing/Processflow"), { ssr: false });
const Features = dynamic(() => import("@/components/landing/Features"), { ssr: false });
const AiShowcase = dynamic(() => import("@/components/landing/AiShowcase"), { ssr: false });
const Sustainability = dynamic(() => import("@/components/landing/Sustainability"), { ssr: false });
const CallToAction = dynamic(() => import("@/components/landing/CallToAction"), { ssr: false });
const Testimonials = dynamic(() => import("@/components/landing/Testimonials"), { ssr: false });
const UserDashboardlogin = dynamic(() => import("@/components/dashboardlogin/UserDashboardlogin"), { ssr: false });
const UserOverview = dynamic(() => import("@/components/dashboard/UserOverview"), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

// Create a separate component for the landing page content
const LandingPageContent = () => {
  // Memoize the content to prevent unnecessary re-renders
  return useMemo(() => (
    <div className="flex flex-col w-full">
      <Hero />
      <Processflow />
      <Features />
      <AiShowcase />
      <Sustainability />
      <CallToAction />
      <Testimonials />
      <Footer />
    </div>
  ), []); // Empty dependency array since content is static
};

export default function LandingPage() {
  const { status } = useSession();
  const [mounted, setMounted] = useState(false);

  // Only run mounting effect once
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle loading and content rendering
  if (!mounted || status === 'loading') {
    return <LoadingSpinner />;
  }

  // Always show landing page content, regardless of authentication status
  return <LandingPageContent />;
}