import type { Metadata } from "next";
import { Inter, Space_Grotesk, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import './styles/animations.css';
import { Providers } from "./providers";
import Script from 'next/script'

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-display" });
const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-body-fallback" });

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
      <body className={`${inter.variable} ${spaceGrotesk.variable} ${outfit.variable} ${plusJakarta.variable} font-body`}>
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
