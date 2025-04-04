'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { CountryProvider } from '@/context/CountryContext';
import SessionProviderWrapper from './SessionProviderWrapper';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <ThemeProvider>
        <CountryProvider>
          {children}
          <Toaster richColors position="top-center" />
        </CountryProvider>
      </ThemeProvider>
    </SessionProviderWrapper>
  );
}