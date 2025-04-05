'use client';

import { useCountry } from '@/context/CountryContext';
import { currencyConfig } from '@/lib/currencyConfig';

interface CartItem {
  price: number;
  quantity: number;
}

interface CartTotalProps {
  items: CartItem[];
}

export default function CartTotal({ items }: CartTotalProps) {
  const { selectedCountry } = useCountry();

  const formatPrice = (amount: number): string => {
    const currencyData = currencyConfig[selectedCountry.currency] || currencyConfig.INR;
    const formattedAmount = amount.toFixed(2);
    
    return currencyData.position === 'before'
      ? `${currencyData.symbol}${formattedAmount}`
      : `${formattedAmount} ${currencyData.symbol}`;
  };

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="flex justify-between items-center py-4 border-t">
      <span className="text-lg font-semibold">Total:</span>
      <span className="text-lg font-bold">{formatPrice(total)}</span>
    </div>
  );
}