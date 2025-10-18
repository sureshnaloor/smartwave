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
  BookOpen // Add BookOpen icon for guide
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
  { href: '/guide-me', label: 'Guide Me', icon: BookOpen, requiresAuth: true },
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

// Remove the countries array from here as it's now in CountryContext

export default function Navigation({ variant = 'full' }: { variant?: 'full' | 'country-selector' }) {
  const pathname = usePathname()
  const { status } = useSession()
  const isAuthenticated = status === 'authenticated'

  // Show only country selector if variant is 'country-selector'
  if (variant === 'country-selector') {
    return (
      <nav className="flex items-center">
        {isAuthenticated && <CountrySelector />}
      </nav>
    )
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