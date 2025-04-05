'use client';

import { useEffect, useState } from 'react';
import { useCountry } from '@/context/CountryContext';
import { currencyConfig, ProductType } from '@/lib/currencyConfig';
import { toast } from 'sonner';

interface PriceDisplayProps {
  productType: ProductType;
}

export default function PriceDisplay({ productType }: PriceDisplayProps) {
  const { selectedCountry } = useCountry();
  const [formattedPrice, setFormattedPrice] = useState('');

  useEffect(() => {
    const currencyData = currencyConfig[selectedCountry.currency];
    if (!currencyData) {
      toast.error('Currency not supported, showing prices in INR');
      const defaultCurrency = currencyConfig.INR;
      formatPrice(defaultCurrency, defaultCurrency.rates[productType]);
      return;
    }

    formatPrice(currencyData, currencyData.rates[productType]);
  }, [selectedCountry, productType]);

  const formatPrice = (currencyData: typeof currencyConfig.INR, amount: number) => {
    const formattedAmount = new Intl.NumberFormat('en-US').format(amount);
    
    setFormattedPrice(
      currencyData.position === 'before'
        ? `${currencyData.symbol}${formattedAmount}`
        : `${formattedAmount} ${currencyData.symbol}`
    );
  };

  return (
    <span className="font-semibold whitespace-nowrap">
      {formattedPrice}
    </span>
  );
}