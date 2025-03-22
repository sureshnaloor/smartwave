'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect } from 'react';

export default function SessionProviderWrapper({ children }: { children: ReactNode }) {
  // Clear any invalid or corrupted next-auth cookies on client-side
  useEffect(() => {
    const handleError = () => {
      try {
        // Delete any corrupted tokens from localStorage
        if (localStorage.getItem('next-auth.csrf-token')) {
          localStorage.removeItem('next-auth.csrf-token');
        }
        
        if (localStorage.getItem('next-auth.callback-url')) {
          localStorage.removeItem('next-auth.callback-url');
        }
        
        if (localStorage.getItem('next-auth.state')) {
          localStorage.removeItem('next-auth.state');
        }

        // Clear any corrupted session cookies 
        document.cookie.split(';').forEach(cookie => {
          const [name] = cookie.trim().split('=');
          if (name.includes('next-auth')) {
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          }
        });
        
        console.log('Auth state cleaned');
      } catch (e) {
        console.error('Error cleaning auth state:', e);
      }
    };

    // Add an error event listener to window
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason?.message?.includes('JWE') || 
          event.reason?.message?.includes('JWT') ||
          event.reason?.message?.includes('session')) {
        console.warn('Auth error detected, clearing session state');
        handleError();
        // Reload the page to get a fresh session
        window.location.reload();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Check for URL indicators of auth issues
    if (window.location.search.includes('error=')) {
      console.warn('Auth error detected in URL, cleaning session state');
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