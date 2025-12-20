'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import AuthButton from './AuthButton';
import Avatar from './Avatar';
import Navigation from './Navigation';
import { Menu, X, DollarSign, ShoppingBag, BookOpen, IdCard, Globe } from 'lucide-react';
import AboutDropdown from './AboutDropdown';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Left Section: Logo and Main Navigation Links */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Link href="/" className="logo-icon">
                <span className="logo-icon-text">sw</span>
              </Link>
              <Link href="/" className="logo-text-box mr-4">
                <span className="logo-text">SmartWave</span>
              </Link>
            </div>
            {/* Main Navigation Links - Grouped and Styled Differently */}
            <div className="hidden md:flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-4">
              <Link
                href="/pricing"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === '/pricing'
                    ? 'bg-smart-teal text-white dark:bg-smart-teal dark:text-white'
                    : 'text-gray-700 hover:bg-smart-teal/10 hover:text-smart-teal dark:text-gray-300 dark:hover:bg-smart-teal/20 dark:hover:text-smart-teal'
                  }`}
              >
                <DollarSign className="h-4 w-4" />
                <span>Pricing</span>
              </Link>
              {isAuthenticated && (
                <Link
                  href="/store"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === '/store'
                      ? 'bg-smart-teal text-white dark:bg-smart-teal dark:text-white'
                      : 'text-gray-700 hover:bg-smart-teal/10 hover:text-smart-teal dark:text-gray-300 dark:hover:bg-smart-teal/20 dark:hover:text-smart-teal'
                    }`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  <span>Store</span>
                </Link>
              )}
            </div>
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

          {/* Center Section: About Dropdown */}
          <div className="hidden md:flex items-center justify-center">
            <AboutDropdown />
          </div>

          {/* Right Section: Profile Links, Theme Toggle, Avatar, Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && (
              <>
                <Link
                  href="/myprofile"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === '/myprofile'
                      ? 'bg-smart-teal text-white dark:bg-smart-teal dark:text-white'
                      : 'text-gray-700 hover:bg-smart-teal/10 hover:text-smart-teal dark:text-gray-300 dark:hover:bg-smart-teal/20 dark:hover:text-smart-teal'
                    }`}
                >
                  <IdCard className="h-4 w-4" />
                  <span>Create/Edit Profile</span>
                </Link>
                <Link
                  href="/guide-me"
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === '/guide-me'
                      ? 'bg-smart-teal text-white dark:bg-smart-teal dark:text-white'
                      : 'text-gray-700 hover:bg-smart-teal/10 hover:text-smart-teal dark:text-gray-300 dark:hover:bg-smart-teal/20 dark:hover:text-smart-teal'
                    }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Guide Me</span>
                </Link>
              </>
            )}
            <ThemeToggle />
            <Avatar />
            <AuthButton />
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute left-0 right-0 top-16 z-50 border-b bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:hidden">
              <div className="flex flex-col gap-4">
                {/* Main Links */}
                <div className="flex flex-col gap-2 border-b pb-4 dark:border-gray-700">
                  <Link
                    href="/pricing"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === '/pricing'
                        ? 'bg-smart-teal text-white'
                        : 'text-gray-700 hover:bg-smart-teal/10 hover:text-smart-teal dark:text-gray-300'
                      }`}
                  >
                    <DollarSign className="h-5 w-5" />
                    <span>Pricing</span>
                  </Link>
                  {isAuthenticated && (
                    <Link
                      href="/store"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${pathname === '/store'
                          ? 'bg-smart-teal text-white'
                          : 'text-gray-700 hover:bg-smart-teal/10 hover:text-smart-teal dark:text-gray-300'
                        }`}
                    >
                      <ShoppingBag className="h-5 w-5" />
                      <span>Store</span>
                    </Link>
                  )}
                </div>
                {/* About Dropdown */}
                <div className="border-b pb-4 dark:border-gray-700">
                  <AboutDropdown />
                </div>
                {/* Profile Links (if authenticated) */}
                {isAuthenticated && (
                  <div className="flex flex-col gap-2 border-b pb-4 dark:border-gray-700">
                    <Link
                      href="/myprofile"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === '/myprofile'
                          ? 'bg-smart-teal/10 text-smart-teal dark:bg-smart-teal/20 dark:text-smart-teal'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                      <IdCard className="h-5 w-5" />
                      <span>Create/Edit Profile</span>
                    </Link>
                    <Link
                      href="/guide-me"
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === '/guide-me'
                          ? 'bg-smart-teal/10 text-smart-teal dark:bg-smart-teal/20 dark:text-smart-teal'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                      <BookOpen className="h-5 w-5" />
                      <span>Guide Me</span>
                    </Link>
                    <div className="flex items-center gap-2 px-3 py-2">
                      <Globe className="h-5 w-5 text-gray-600" />
                      <Navigation variant="country-selector" />
                    </div>
                  </div>
                )}
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