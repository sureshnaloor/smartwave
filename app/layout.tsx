import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from '@/context/ThemeContext';
import SessionProviderWrapper from './SessionProviderWrapper';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smartwave",
  description: "Smartwave is a platform for creating and managing business card and digital profile",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
