
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useCountry } from "@/context/CountryContext";
import { currencyConfig, ProductType } from "@/lib/currencyConfig";
import { useState } from 'react';
import { useAuthNavigation } from "@/hooks/useAuthNavigation";

const PricingCards = () => {
  const { selectedCountry } = useCountry();
  const currency = currencyConfig[selectedCountry.currency] || currencyConfig.USD;
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const handleNavigation = useAuthNavigation();

  const formatPrice = (price: number) => {
    return currency.position === 'before'
      ? `${currency.symbol}${price}`
      : `${price} ${currency.symbol}`;
  };

  const getRate = (key: ProductType) => currency.rates[key];

  const individualFeatures = [
    "3 different card content",
    "Premium themes",
    "QR code generation",
    "vCard download",
    "Digital profile & digital card",
    "Wallet integration"
  ];

  const enterpriseFeatures = [
    ...individualFeatures,
    "Analytics",
    "Team management"
  ];

  const corporateFeatures = [
    "Unlimited cards",
    "Custom branding",
    "API access",
    "Advanced security",
    "Dedicated support"
  ];

  // Logic: 
  // Old Monthly -> New Annual (1 Year Plan)
  // Old Annual -> New 5 Years (5 Year Plan)

  const plans = [
    {
      name: "Individual",
      subtitle: "Perfect for individuals",
      // keys: perpetual, annual (was monthly)
      pricingKeys: {
        perpetual: 'plan_individual_perpetual',
        annual: 'plan_individual_annual'
      },
      trial: "14 days free trial",
      features: individualFeatures,
      cta: "Start Free Trial",
      ctaLink: "/auth/signup",
      popular: false,
      color: "bg-teal-50/30 dark:bg-teal-900/10 border-teal-200 dark:border-teal-800"
    },
    {
      name: "Enterprise - Starter",
      subtitle: "For small teams",
      employeeCount: 10,
      pricingKeys: {
        annual: 'plan_starter_annual',
        fiveYear: 'plan_starter_5y'
      },
      discount: "Save on 5-year plan",
      features: enterpriseFeatures,
      cta: "Buy Now",
      ctaLink: "/cart",
      popular: false,
      color: "bg-slate-50/50 dark:bg-slate-800/20 border-slate-300 dark:border-slate-700"
    },
    {
      name: "Enterprise - Growth",
      subtitle: "For growing organizations",
      tiers: [
        { employees: 25, annualKey: 'plan_growth_annual', fiveYearKey: 'plan_growth_5y' },
        { employees: 100, annualKey: 'plan_growth_100_annual', fiveYearKey: 'plan_growth_100_5y' }
      ],
      discount: "Save on 5-year plan",
      features: enterpriseFeatures,
      cta: "Buy Now",
      ctaLink: "/cart",
      popular: true,
      color: "bg-amber-50/50 dark:bg-amber-900/10 border-amber-300 dark:border-amber-800"
    },
    {
      name: "Enterprise - Corporate",
      subtitle: "For bulk & corporate needs",
      isCustom: true,
      pricing: "Custom",
      features: corporateFeatures,
      cta: "Contact Sales",
      ctaLink: "mailto:smart@smartwave.name",
      popular: false,
      color: "bg-gray-50 dark:bg-zinc-900 border-gray-200 dark:border-zinc-800"
    }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Choose Your SmartWave Plan</h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">Flexible pricing for professionals and enterprises</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan, index) => (
          <Card
            key={index}
            onClick={() => setSelectedPlan(index)}
            className={`price-card shadow-lg ${plan.popular ? "ring-2 ring-teal-500" : ""} ${plan.color} relative flex flex-col cursor-pointer transition-all duration-300
              ${selectedPlan === index ? 'border-2 border-primary shadow-2xl scale-[1.02] ring-0' : 'hover:shadow-xl'}
            `}
          >
            <CardHeader>
              {plan.popular && <Badge className="absolute top-4 right-4 bg-teal-500">Popular</Badge>}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">{plan.subtitle}</p>
            </CardHeader>
            <CardContent className="flex-grow">
              {/* Individual Pricing */}
              {plan.name === "Individual" && (
                <div className="mb-6">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold">
                      {formatPrice(getRate(plan.pricingKeys!.perpetual as ProductType))}
                    </span>
                    <span className="text-gray-500 text-sm">perpetual</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 mb-1">or</div>
                  <div className="flex items-baseline gap-3 mb-3">
                    <span className="text-4xl font-bold">
                      {formatPrice(getRate(plan.pricingKeys!.annual as ProductType))}
                    </span>
                    <span className="text-gray-500 text-sm">/year</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {plan.trial}
                  </Badge>
                </div>
              )}

              {/* Enterprise Starter */}
              {plan.name === "Enterprise - Starter" && (
                <div className="mb-6">
                  <div className="mb-4">
                    <div className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2">
                      Up to {plan.employeeCount} employees
                    </div>
                    {/* Annual (was monthly) */}
                    <div className="block mb-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">
                          {formatPrice(getRate(plan.pricingKeys!.annual as ProductType))}
                        </span>
                        <span className="text-gray-500 text-sm">/year</span>
                      </div>
                      <div className="text-xs text-gray-500">Billed yearly</div>
                    </div>

                    {/* 5 Years (was annual) */}
                    <div className="block mt-3">
                      <div className="text-sm text-green-600 font-bold italic">
                        {formatPrice(getRate(plan.pricingKeys!.fiveYear as ProductType))}/year
                      </div>
                      <div className="text-xs text-gray-500">
                        Billed as {formatPrice(getRate(plan.pricingKeys!.fiveYear as ProductType) * 5)} for 5 years
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                    {plan.discount}
                  </Badge>
                </div>
              )}

              {/* Enterprise Growth */}
              {plan.name === "Enterprise - Growth" && plan.tiers && (
                <div className="mb-6 space-y-4">
                  {plan.tiers.map((tier, i) => (
                    <div key={i} className={`pb-3 ${i !== plan.tiers!.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-1">
                        Up to {tier.employees} employees
                      </div>

                      {/* Annual */}
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold">
                          {formatPrice(getRate(tier.annualKey as ProductType))}
                        </span>
                        <span className="text-gray-500 text-xs">/year</span>
                      </div>

                      {/* 5 Year */}
                      <div className="block">
                        <div className="text-sm text-green-600 font-bold italic">
                          {formatPrice(getRate(tier.fiveYearKey as ProductType))}/year
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Billed {formatPrice(getRate(tier.fiveYearKey as ProductType) * 5)} (5 years)
                        </div>
                      </div>
                    </div>
                  ))}
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs">
                    {plan.discount}
                  </Badge>
                </div>
              )}

              {/* Enterprise Corporate (Custom) */}
              {plan.isCustom && (
                <div className="mb-5 mt-4 text-center">
                  <div className="text-4xl font-bold mb-2">Custom</div>
                  <p className="text-sm text-gray-500 mb-4">Contact us for bulk pricing</p>
                </div>
              )}

              {/* Features */}
              <ul className="space-y-2 mt-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-teal-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="mt-auto">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigation(plan.ctaLink);
                }}
                className={`w-full ${plan.popular ? "bg-teal-600 hover:bg-teal-700" : ""}`}
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