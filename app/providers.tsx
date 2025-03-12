'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import SessionProviderWrapper from './SessionProviderWrapper';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <ThemeProvider>
        {children}
        <Toaster richColors position="top-center" />
      </ThemeProvider>
    </SessionProviderWrapper>
  );
} 