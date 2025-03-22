'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import AuthButton from './AuthButton';
import Avatar from './Avatar';
import Navigation from './Navigation';
import CurrencySelector from './CurrencySelector';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold dark:text-white md:text-2xl">
            Smartwave
          </Link>

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

          {/* Desktop Navigation */}
          <div className="hidden items-center justify-between md:flex md:flex-1 md:gap-4">
            <Navigation />
            <nav className="flex items-center gap-4">
              {isAuthenticated && <CurrencySelector />}
              <ThemeToggle />
              <Avatar />
              <AuthButton />
            </nav>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="absolute left-0 right-0 top-16 border-b bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:hidden">
              <Navigation />
              <div className="mt-4 flex items-center justify-between border-t pt-4 dark:border-gray-700">
                {isAuthenticated && <CurrencySelector />}
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