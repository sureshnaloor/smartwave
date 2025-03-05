'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';

export default function Header() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <header className="border-b dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-bold dark:text-white">
            Smartwave
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            {loading ? (
              <span className="text-sm">Loading...</span>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm dark:text-white">
                  {session.user?.email}
                  {session.user?.emailVerified && 
                    <span className="ml-2 text-green-500">✓</span>
                  }
                </span>
                <button 
                  onClick={() => signOut()} 
                  className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button 
                onClick={() => signIn('google')} 
                className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Login with Google
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 