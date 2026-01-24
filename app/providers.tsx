'use client';

import { ThemeProvider } from '@/context/ThemeContext';
import { CountryProvider } from '@/context/CountryContext';
import SessionProviderWrapper from './SessionProviderWrapper';
import { Toaster } from 'sonner';
import { CartProvider } from '@/context/CartContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProviderWrapper>
      <ThemeProvider>
        <CountryProvider>
          <CartProvider>
            {children}
            <Toaster richColors position="top-center" />
          </CartProvider>
        </CountryProvider>
      </ThemeProvider>
    </SessionProviderWrapper>
  );
}