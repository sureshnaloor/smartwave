"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Wifi, CheckCircle } from "lucide-react";
import { useCountry } from "@/context/CountryContext";
import { currencyConfig, ProductType } from "@/lib/currencyConfig";
import Link from "next/link";

// Add useState import at top
import { useState } from 'react';
import { useAuthNavigation } from "@/hooks/useAuthNavigation";

const NfcCards = () => {
  const { selectedCountry } = useCountry();
  const currency = currencyConfig[selectedCountry.currency] || currencyConfig.USD;
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const handleNavigation = useAuthNavigation();

  const formatPrice = (price: number) => {
    return currency.position === 'before'
      ? `${currency.symbol}${price}`
      : `${price} ${currency.symbol}`;
  };

  const getRate = (key: ProductType) => currency.rates[key];

  const cards = [
    {
      name: "Basic White",
      rateKey: "pvc" as ProductType,
      headerColor: "bg-gradient-to-r from-blue-500 to-cyan-500",
      description: "Simple and elegant NFC business cards",
      features: [
        "White PVC material",
        "Basic design template",
        "NFC tap functionality",
        "Printed QR code",
        "One year digital profile"
      ],
      popular: false
    },
    {
      name: "Color PVC",
      rateKey: "color" as ProductType,
      headerColor: "bg-gradient-to-r from-orange-400 to-orange-600",
      description: "Vibrant full-color business cards",
      features: [
        "Full-color PVC material",
        "Custom color designs",
        "NFC tap functionality",
        "Printed QR code",
        "One year digital profile"
      ],
      popular: true
    },
    {
      name: "Premium NFC",
      rateKey: "nfc" as ProductType,
      headerColor: "bg-gradient-to-r from-gray-300 to-slate-400",
      description: "Premium-finish high-quality cards",
      features: [
        "Premium thick material",
        "Advanced design options",
        "NFC tap functionality",
        "Printed QR code",
        "Two year digital profile"
      ],
      popular: false
    },
    {
      name: "Premium Plus",
      rateKey: "premium" as ProductType,
      headerColor: "bg-gradient-to-r from-yellow-400 to-amber-500",
      description: "Luxury metal business cards",
      features: [
        "Metal construction",
        "Luxury finish options",
        "NFC tap functionality",
        "Printed QR code",
        "Lifetime digital profile"
      ],
      popular: false
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-4">NFC Business Cards</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-6">
          Physical cards with NFC technology and QR codes for in-person networking with a digital advantage
        </p>

        {/* Discount Banner */}
        <div className="inline-block bg-teal-50 dark:bg-teal-900/30 border border-teal-200 dark:border-teal-800 rounded-full px-6 py-2">
          <p className="text-sm font-medium text-teal-800 dark:text-teal-300">
            🎉 <span className="font-bold">Bulk Discounts:</span> 20% off (5+ cards) • 30% off (10+ cards) • 40% off (50+ cards)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <Card
            key={index}
            onClick={() => setSelectedCard(index)}
            className={`sw-card sw-gradient-border overflow-hidden flex flex-col cursor-pointer transition-all duration-300
              ${selectedCard === index ? 'shadow-[0_0_30px_rgba(0,180,216,0.2)] scale-[1.02]' : ''}
            `}
          >
            <div className={`h-48 ${card.headerColor} flex items-center justify-center p-6 relative`}>
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm relative z-10">
                <Wifi className="h-10 w-10 text-white" />
              </div>
              {/* Card visual effect */}
              <div className="absolute inset-0 bg-white/10 opacity-30 transform -skew-x-12 translate-x-16"></div>
            </div>
            <CardHeader>
              {card.popular && <Badge className="absolute top-4 right-4 bg-blue-600">Best Seller</Badge>}
              <CardTitle className="text-xl">{card.name}</CardTitle>
              <CardDescription className="flex items-baseline mt-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatPrice(getRate(card.rateKey))}
                </span>
                <span className="text-gray-500 ml-1">/ card</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">{card.description}</p>
              <ul className="space-y-2">
                {card.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto pt-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation("/store");
                }}
                className={`w-full py-3 ${card.popular ? "sw-btn-premium" : "sw-btn-primary"}`}
              >
                Order Now
              </button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4">Need Custom Quantities or Designs?</h3>
        <button
          onClick={() => handleNavigation("/contact")}
          className="sw-btn-ghost px-8 py-4"
        >
          Contact for Custom Orders
        </button>
      </div>
    </div>
  );
};

export default NfcCards;