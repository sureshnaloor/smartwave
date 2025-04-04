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
  Globe // Add Globe icon for country selector
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useCountry } from '@/context/CountryContext';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  requiresAuth?: boolean;
  children?: { href: string; label: string; icon: LucideIcon }[];
}

const navItems: NavItem[] = [
  { href: '/store', label: 'Store', icon: ShoppingBag, requiresAuth: true },
  { href: '/contact-us', label: 'Contact', icon: Mail, requiresAuth: false },
  { href: '/pricing', label: 'Pricing', icon: DollarSign, requiresAuth: false },
  { 
    href: '#', 
    label: 'About', 
    icon: Info, 
    requiresAuth: false,
    children: [
      { href: '/about-smartwave', label: 'About Smartwave', icon: Info },
      { href: '/about-xbeyond', label: 'About xBeyond', icon: Info }
    ]
  }
];

// Add country options
const countries = [
  { code: 'IN', name: 'India', currency: 'INR', flag: '🇮🇳' },
  { code: 'SA', name: 'KSA', currency: 'SAR', flag: '🇸🇦' },
  { code: 'US', name: 'USA', currency: 'USD', flag: '🇺🇸' },
  { code: 'AE', name: 'UAE', currency: 'AED', flag: '🇦🇪' },
  { code: 'BH', name: 'Bahrain', currency: 'BHD', flag: '🇧🇭' },
];

export default function Navigation({ variant = 'full' }: { variant?: 'full' | 'country-selector' }) {
  const pathname = usePathname();
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const { selectedCountry, setCountry } = useCountry();

  // Show only country selector if variant is 'country-selector'
  if (variant === 'country-selector') {
    return (
      <nav className="flex items-center">
        {isAuthenticated && (
          <div className="relative">
            <select
              value={selectedCountry.code}
              onChange={(e) => {
                const country = countries.find(c => c.code === e.target.value);
                if (country) setCountry(country);
              }}
              className="appearance-none bg-transparent text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer pr-6"
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
            <Globe className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
        )}
      </nav>
    );
  }

  // Rest of the existing navigation code for full variant
  const visibleNavItems = navItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

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
                    className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
                      pathname === child.href
                        ? 'text-red-500 font-medium'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
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
            className="group flex items-center gap-2 text-sm"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 rounded-md p-2 transition-colors ${
                isActive 
                  ? 'text-red-500' 
                  : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <item.icon className={`h-5 w-5 ${
                  isActive 
                    ? 'text-red-500' 
                    : 'text-gray-600 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-gray-200'
                }`} />
              </motion.div>
              <span className="font-medium">{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}