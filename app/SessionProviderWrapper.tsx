'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function SessionProviderWrapper({ children }: { children: ReactNode }) {
  // Clear any invalid or corrupted next-auth cookies on client-side
  useEffect(() => {
    const handleError = () => {
      try {
        // Delete any corrupted tokens from localStorage
        const keysToRemove = [
          'next-auth.csrf-token',
          'next-auth.callback-url',
          'next-auth.state',
          'next-auth.session-token'
        ];
        
        keysToRemove.forEach(key => {
          if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
          }
        });

        // Clear any corrupted session cookies 
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name.includes('next-auth') || name.includes('authjs')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
          }
        });
        
        console.log('Auth state cleaned due to JWT error');
      } catch (e) {
        console.error('Error cleaning auth state:', e);
      }
    };

    // Add an error event listener to window
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('JWE') || 
          event.reason?.message?.includes('JWT') ||
          event.reason?.message?.includes('session') ||
          event.reason?.message?.includes('Invalid Compact JWE')) {
        console.warn('JWT/Session error detected, clearing session state');
        handleError();
        // Reload the page to get a fresh session
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Check for URL indicators of auth issues
    if (window.location.search.includes('error=')) {
      // console.warn('Auth error detected in URL, cleaning session state');
      handleError();
    }

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <SessionProvider 
      refetchInterval={5 * 60} 
      refetchOnWindowFocus={true}>
      {children}
    </SessionProvider>
  );
}