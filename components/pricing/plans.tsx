
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useCountry } from "@/context/CountryContext";
import { currencyConfig, ProductType } from "@/lib/currencyConfig";

const PricingCards = () => {
  const { selectedCountry } = useCountry();
  const currency = currencyConfig[selectedCountry.currency] || currencyConfig.USD;

  const formatPrice = (rateType: ProductType) => {
    const price = currency.rates[rateType];
    return currency.position === 'before'
      ? `${currency.symbol}${price}`
      : `${price} ${currency.symbol}`;
  };

  const plans = [
    {
      name: "Free Forever",
      rateType: "singleEdit" as ProductType, // Used for type but price will be 0
      price: "0",
      period: "forever",
      description: "Perfect for basic digital networking",
      features: [
        "Digital sharable profile link",
        "One-week editing period",
        "Add to contacts feature",
        "Basic customization",
        "Email support"
      ],
      cta: "Get Started Free",
      popular: false,
      color: "bg-gray-100"
    },
    {
      name: "One-Time Edit",
      rateType: "singleEdit" as ProductType,
      period: "one-time",
      description: "For occasional profile updates",
      features: [
        "Everything in Free",
        "5 additional profile edits",
        "Extended customization",
        "Priority email support",
        "Analytics dashboard"
      ],
      cta: "Choose Plan",
      popular: true,
      color: "bg-blue-50"
    },
    {
      name: "Yearly",
      rateType: "annual" as ProductType,
      period: "per year",
      description: "For professionals who update frequently",
      features: [
        "Everything in One-Time",
        "Unlimited edits for one year",
        "Advanced customization",
        "Priority support",
        "Premium analytics"
      ],
      cta: "Choose Plan",
      popular: false,
      color: "bg-gray-100"
    },
    {
      name: "Five Edits Package",
      rateType: "fiveEdits" as ProductType,
      period: "one-time",
      description: "Best value for serious professionals",
      features: [
        "Everything in Yearly",
        "5 profile edits",
        "Full customization suite",
        "VIP support",
        "Advanced analytics & insights"
      ],
      cta: "Choose Plan",
      popular: false,
      color: "bg-gray-100"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold text-center mb-12">Digital Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {plans.map((plan, index) => (
          <Card key={index} className={`price-card shadow-sm ${plan.popular ? "ring-2 ring-blue-600" : ""} ${plan.color}`}>
            <CardHeader>
              {plan.popular && <Badge className="absolute top-4 right-4 bg-blue-600">Most Popular</Badge>}
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">
                  {plan.name === "Free Forever" ? `${currency.symbol}0` : formatPrice(plan.rateType)}
                </span>
                <span className="text-gray-500"> / {plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                variant={plan.popular ? "default" : "outline"}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingCards;