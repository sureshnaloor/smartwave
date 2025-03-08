'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import AuthButton from './AuthButton';
import Avatar from './Avatar';
import Navigation from './Navigation';
export default function Header() {
  return (
    <header className="border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold dark:text-white">
            Smartwave
          </Link>
          <Navigation />
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Avatar />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
} 