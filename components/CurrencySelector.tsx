"use client";

import { useEffect, useState } from "react";
import { CurrencyInfo, DEFAULT_CURRENCY } from "@/lib/currencyTypes";

export default function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyInfo>(DEFAULT_CURRENCY);
  const [isLoading, setIsLoading] = useState(true);

  // Load currency from localStorage on mount
  useEffect(() => {
    const loadCurrency = async () => {
      try {
        // Try to get currency from localStorage first
        const storedCurrency = localStorage.getItem('userCurrency');
        if (storedCurrency) {
          try {
            setSelectedCurrency(JSON.parse(storedCurrency));
          } catch (e) {
            console.error("Failed to parse stored currency", e);
            setSelectedCurrency(DEFAULT_CURRENCY);
          }
        }
      } catch (error) {
        console.error("Error loading currency:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCurrency();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center">
        <div className="h-3 w-10 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  // Format the display text
  const displayText = selectedCurrency.symbol === selectedCurrency.code 
    ? selectedCurrency.code 
    : `${selectedCurrency.symbol} ${selectedCurrency.code}`;

  return (
    <div className="text-[0.6rem] text-gray-600 dark:text-gray-400 font-medium px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 tracking-tighter">
      {displayText}
    </div>
  );
} 