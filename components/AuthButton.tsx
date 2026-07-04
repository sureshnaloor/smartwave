'use client';

import { LogIn, UserPlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthButton() {
  const { data: session, status } = useSession();

  // Don't render anything while checking authentication status or if user is logged in
  if (status === 'loading' || session) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Link href="/auth/signin">
        <button className="sw-btn-ghost px-4 py-2 hidden sm:flex items-center text-sm">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </button>
      </Link>
      <Link href="/auth/signup">
        <button className="sw-btn-primary px-4 py-2 flex items-center text-sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Sign Up
        </button>
      </Link>
    </div>
  );
} 