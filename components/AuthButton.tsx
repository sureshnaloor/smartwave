'use client';

import { LogIn, LogOut } from 'lucide-react';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  const handleAuth = async () => {
    if (session) {
      await signOut({ callbackUrl: '/' });
    } else {
      // Direct Google sign-in since it's pre-verified in your setup
      await signIn('google', {
        callbackUrl: '/',
      });
    }
  };

  // Don't render anything while checking authentication status
  if (status === 'loading') return null;
  
  return (
    <button
      onClick={handleAuth}
      className="p-2 rounded-full
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-all duration-200
        focus:outline-none"
      aria-label={session ? 'Sign out' : 'Sign in'}
    >
      {session ? (
        <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:-translate-x-1 transition-transform" />
      ) : (
        <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:translate-x-1 transition-transform" />
      )}
    </button>
  );
} 