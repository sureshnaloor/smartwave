"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Smartphone, Wifi, CheckCircle } from "lucide-react";
import { useCountry } from "@/context/CountryContext";
import { currencyConfig, ProductType } from "@/lib/currencyConfig";

const NfcCards = () => {
  const { selectedCountry } = useCountry();
  const currency = currencyConfig[selectedCountry.currency] || currencyConfig.USD;

  const formatPrice = (rateType: ProductType) => {
    const price = currency.rates[rateType];
    return currency.position === 'before'
      ? `${currency.symbol}${price}`
      : `${price} ${currency.symbol}`;
  };

  const cards = [
    {
      name: "Basic White",
      rateType: "pvc" as ProductType,
      quantity: "5 cards",
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
      rateType: "color" as ProductType,
      quantity: "5 cards",
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
      rateType: "nfc" as ProductType,
      quantity: "5 cards",
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
      rateType: "premium" as ProductType,
      quantity: "5 cards",
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
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-4">NFC Business Cards</h2>
        <p className="text-center text-gray-600 max-w-3xl mx-auto">
          Physical cards with NFC technology and QR codes for in-person networking with a digital advantage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, index) => (
          <Card key={index} className={`price-card shadow-sm overflow-hidden ${card.popular ? "ring-2 ring-blue-600" : ""}`}>
            <div className="h-48 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-6">
              <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
                <Wifi className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardHeader>
              {card.popular && <Badge className="absolute top-4 right-4 bg-blue-600">Best Seller</Badge>}
              <CardTitle>{card.name}</CardTitle>
              <CardDescription className="flex items-center">
                <span className="text-3xl font-bold">{formatPrice(card.rateType)}</span>
                <span className="text-gray-500 ml-2">/ {card.quantity}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{card.description}</p>
              <ul className="space-y-2">
                {card.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${card.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                variant={card.popular ? "default" : "outline"}
              >
                Order Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h3 className="text-xl font-semibold mb-4">Need Custom Quantities or Designs?</h3>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
          Contact for Custom Orders
        </Button>
      </div>
    </div>
  );
};

export default NfcCards;