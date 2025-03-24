'use client';

import { LogIn } from 'lucide-react';
import { signIn, useSession } from 'next-auth/react';

export default function AuthButton() {
  const { data: session, status } = useSession();

  const handleSignIn = async () => {
    // Direct Google sign-in since it's pre-verified in your setup
    await signIn('google', {
      callbackUrl: '/',
    });
  };

  // Don't render anything while checking authentication status or if user is logged in
  if (status === 'loading' || session) return null;
  
  return (
    <button
      onClick={handleSignIn}
      className="p-2 rounded-full
        hover:bg-gray-100 dark:hover:bg-gray-800
        transition-all duration-200
        focus:outline-none"
      aria-label="Sign in"
    >
      <LogIn className="w-5 h-5 text-gray-600 dark:text-gray-400 hover:translate-x-1 transition-transform" />
    </button>
  );
} 