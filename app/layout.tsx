import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import './styles/animations.css';
import { Providers } from "./providers";
import Script from 'next/script'

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
      <body className={inter.className}>
        <Providers>
          {children}
          <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />
        </Providers>
      </body>
    </html>
  );
}
