'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import AuthButton from './AuthButton';
import Avatar from './Avatar';
import Navigation from './Navigation';
import { Menu, X, Mail, DollarSign, ShoppingBag, Globe, BookOpen, IdCard } from 'lucide-react';
import AboutDropdown from './AboutDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo and Store link */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold dark:text-white md:text-2xl mr-4">
              Smartwave
            </Link>
            {isAuthenticated && (
              <Link 
                href="/store" 
                className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Store</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="ml-2 rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 md:hidden"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Center Section: Main Navigation Items */}
          <div className="hidden md:flex items-center justify-center space-x-6">
            {isAuthenticated && (
              <Link 
                href="/myprofile" 
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <IdCard className="h-5 w-5" />
                <span>Create/Edit Profile</span>
              </Link>
            )}
            {isAuthenticated && (
              <Link 
                href="/guide-me" 
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <BookOpen className="h-5 w-5" />
                <span>Guide Me</span>
              </Link>
            )}
            <Link 
              href="/contact-us" 
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <Mail className="h-5 w-5" />
              <span>Contact</span>
            </Link>
            <Link 
              href="/pricing" 
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <DollarSign className="h-5 w-5" />
              <span>Pricing</span>
            </Link>
            <AboutDropdown />
          </div>

          {/* Right Section: User-related items */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && <Navigation variant="country-selector" />}
            <ThemeToggle />
            <Avatar />
            <AuthButton />
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute left-0 right-0 top-16 z-50 border-b bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:hidden">
              <div className="flex flex-col gap-4">
                {isAuthenticated && (
                  <div className="flex items-center gap-2 px-2">
                    <Globe className="h-5 w-5 text-gray-600" />
                    <Navigation variant="country-selector" />
                  </div>
                )}
                {isAuthenticated && (
                  <Link 
                    href="/myprofile" 
                    className="flex items-center gap-2 px-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <IdCard className="h-5 w-5" />
                    <span>Create/Edit Profile</span>
                  </Link>
                )}
                <Navigation variant="full" />
              </div>
              <div className="mt-4 flex items-center justify-around border-t pt-4 dark:border-gray-700">
                <ThemeToggle />
                <Avatar />
                <AuthButton />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}