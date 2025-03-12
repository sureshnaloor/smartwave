"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import AiShowcase from "@/components/landing/AiShowcase";
import Sustainability from "@/components/landing/Sustainability";
import CallToAction from "@/components/landing/CallToAction";
import Testimonials from "@/components/landing/Testimonials";
import UserDashboardlogin from "@/components/dashboardlogin/UserDashboardlogin";
import Footer from '@/components/Footer';
import LoadingSpinner from "@/components/LoadingSpinner";

export default function LandingPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Landing Page Session State:', {
      status,
      session,
      userEmail: session?.user?.email
    });

    if (status !== 'loading') {
      setIsLoading(false);
    }
  }, [status, session]);

  if (status === 'loading' || isLoading) {
    return <LoadingSpinner />;
  }

  if (status === 'authenticated' && session?.user?.email) {
    console.log('Rendering dashboard for authenticated user:', session.user.email);
    return <UserDashboardlogin />;
  }

  console.log('Rendering landing page for unauthenticated user');
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Features />
      <AiShowcase />
      <Sustainability />
      <CallToAction />
      <Testimonials />
      <Footer />
    </div>
  );
} 