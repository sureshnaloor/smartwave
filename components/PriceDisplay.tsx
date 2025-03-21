'use client';

import { useEffect, useState } from 'react';
import { type CurrencyInfo, DEFAULT_CURRENCY } from '@/lib/currencyTypes';

interface PriceDisplayProps {
  cardType: 'pvc' | 'nfc' | 'color' | 'premium' | 'annual' | 'fiveEdits' | 'singleEdit';
  currencyInfo?: CurrencyInfo;
}

export default function PriceDisplay({ cardType, currencyInfo = DEFAULT_CURRENCY }: PriceDisplayProps) {
  const [formattedPrice, setFormattedPrice] = useState('');

  useEffect(() => {
    const amount = currencyInfo.rates[cardType];
    const formattedAmount = new Intl.NumberFormat('en-US').format(amount);
    
    setFormattedPrice(
      currencyInfo.position === 'before'
        ? `${currencyInfo.symbol}${formattedAmount}`
        : `${formattedAmount} ${currencyInfo.symbol}`
    );
  }, [cardType, currencyInfo]);

  return (
    <span className="font-semibold whitespace-nowrap">
      {formattedPrice}
    </span>
  );
}