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
        <Button variant="ghost" size="sm" className="hidden sm:flex">
          <LogIn className="w-4 h-4 mr-2" />
          Sign In
        </Button>
      </Link>
      <Link href="/auth/signup">
        <Button size="sm">
          <UserPlus className="w-4 h-4 mr-2" />
          Sign Up
        </Button>
      </Link>
    </div>
  );
} 