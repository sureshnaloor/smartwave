'use client';

import { useCountry } from '@/context/CountryContext';
import { currencyConfig } from '@/lib/currencyConfig';

interface ItemPriceDisplayProps {
  price: number;
  quantity?: number;
  showTotal?: boolean;
}

export default function ItemPriceDisplay({ price, quantity = 1, showTotal = false }: ItemPriceDisplayProps) {
  const { selectedCountry } = useCountry();

  const formatPrice = (amount: number): string => {
    // Always use USD as fallback instead of INR
    const currencyData = currencyConfig[selectedCountry.currency] || currencyConfig.USD;
    const formattedAmount = amount.toFixed(2);
    
    return currencyData.position === 'before'
      ? `${currencyData.symbol}${formattedAmount}`
      : `${formattedAmount} ${currencyData.symbol}`;
  };

  return (
    <div className="flex flex-col">
      <span className="text-sm font-medium">
        {formatPrice(price)} {quantity > 1 && `x ${quantity}`}
      </span>
      {showTotal && quantity > 1 && (
        <span className="text-xs text-gray-500">
          Total: {formatPrice(price * quantity)}
        </span>
      )}
    </div>
  );
}