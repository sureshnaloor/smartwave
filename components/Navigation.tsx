'use client';
import {useState} from 'react'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { 
  Mail, 
  DollarSign, 
  ShoppingBag,
  Info,
  Globe, // Add Globe icon for country selector
  BookOpen, // Add BookOpen icon for guide
  CreditCard, // Add CreditCard icon for wallet page
  Zap, // Add Zap icon for features page
  PlayCircle, // Add PlayCircle icon for demo page
  IdCard // Add IdCard icon for create/edit profile
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCountry } from '@/context/CountryContext';
import CountrySelector from "@/components/shared/CountrySelector"

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  children?: { href: string; label: string; icon: LucideIcon }[];
}

const navItems: NavItem[] = [
  { href: '/store', label: 'Store', icon: ShoppingBag, requiresAuth: true },
  { href: '/pricing', label: 'Pricing', icon: DollarSign, requiresAuth: false },
  { href: '/wallet', label: 'Wallet', icon: CreditCard, requiresAuth: false },
  { href: '/demo', label: 'Demo', icon: PlayCircle, requiresAuth: false },
  { href: '/features', label: 'Features', icon: Zap, requiresAuth: false },
  { href: '/myprofile', label: 'Create/Edit Profile', icon: IdCard, requiresAuth: true },
  { href: '/guide-me', label: 'Guide Me', icon: BookOpen, requiresAuth: true },
  { 
    href: '#', 
    label: 'About', 
    icon: Info, 
    requiresAuth: false,
    children: [
      { href: '/about-smartwave', label: 'About Smartwave', icon: Info },
      { href: '/about-xbeyond', label: 'About xBeyond', icon: Info },
      { href: '/contact-us', label: 'Contact', icon: Mail }
    ]
  }
];

// Remove the countries array from here as it's now in CountryContext

export default function Navigation({ variant = 'full' }: { variant?: 'full' | 'country-selector' }) {
  const pathname = usePathname()
  const { status, data: session } = useSession()
  const isAuthenticated = status === 'authenticated'
  const isCorporateEmployee = (session?.user as { role?: string })?.role === 'employee'

  // Show only country selector if variant is 'country-selector'
  if (variant === 'country-selector') {
    return (
      <nav className="flex items-center">
        {isAuthenticated && <CountrySelector />}
      </nav>
    )
  }

  // Rest of the existing navigation code for full variant
  const visibleNavItems = navItems.filter(item => {
    // Hide Store, Pricing, Guide Me for corporate employees
    if (isCorporateEmployee && (item.href === '/store' || item.href === '/pricing' || item.href === '/guide-me')) {
      return false;
    }
    return !item.requiresAuth || (item.requiresAuth && isAuthenticated);
  });

  return (
    <nav className="flex flex-col gap-2">
      {visibleNavItems.map((item) => {
        const isActive = pathname === item.href;
        
        // If this is a dropdown parent item
        if (item.children) {
          return (
            <div key={item.label} className="space-y-1">
              <div className="flex items-center px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-200">
                <item.icon className="mr-2 h-5 w-5" />
                {item.label}
              </div>
              <div className="pl-8 space-y-1">
                {item.children.map(child => (
                  <Link 
                    key={child.href} 
                    href={child.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      pathname === child.href
                        ? 'bg-smart-teal/10 text-smart-teal font-medium dark:bg-smart-teal/20 dark:text-smart-teal'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <child.icon className="h-4 w-4" />
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          );
        }
        
        // Regular navigation item
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className="group"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
                isActive 
                  ? 'bg-smart-teal/10 text-smart-teal dark:bg-smart-teal/20 dark:text-smart-teal' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className={`h-5 w-5 ${
                  isActive 
                    ? 'text-smart-teal' 
                    : 'text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200'
                }`} />
              </motion.div>
              <span className="font-medium text-sm">{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}