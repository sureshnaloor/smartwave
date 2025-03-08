'use client';

import { useEffect, useState } from 'react';
import { type CurrencyInfo, DEFAULT_CURRENCY } from '@/lib/currencyTypes';

interface PriceDisplayProps {
  amount: number;
  currencyInfo?: CurrencyInfo;
}

export default function PriceDisplay({ amount, currencyInfo = DEFAULT_CURRENCY }: PriceDisplayProps) {
  const [formattedPrice, setFormattedPrice] = useState('');

  useEffect(() => {
    const convertedAmount = Math.round(amount * currencyInfo.rate);
    const formattedAmount = new Intl.NumberFormat('en-US').format(convertedAmount);
    
    setFormattedPrice(
      currencyInfo.position === 'before'
        ? `${currencyInfo.symbol}${formattedAmount}`
        : `${formattedAmount} ${currencyInfo.symbol}`
    );
    // console.log('formattedPrice', formattedPrice);
  }, [amount, currencyInfo]);

  return (
    <span className="font-semibold whitespace-nowrap">
      {formattedPrice}
    </span>
  );
} 