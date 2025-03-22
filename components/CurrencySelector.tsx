"use client";

import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CurrencyInfo, CURRENCY_MAP, DEFAULT_CURRENCY } from "@/lib/currencyTypes";
import { getCurrencyForCountry } from "@/lib/currencyMapper";
import { toast } from "sonner";

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
        
        // If no currency is set, try to detect from geolocation
        if (!storedCurrency) {
          await detectLocationAndSetCurrency();
        }
      } catch (error) {
        console.error("Error loading currency:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCurrency();
  }, []);

  // Detect user location and set currency
  const detectLocationAndSetCurrency = async () => {
    try {
      // Call a geolocation API to get user's country
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) throw new Error("Failed to fetch location data");
      
      const data = await response.json();
      const countryCode = data.country_code;
      
      if (countryCode) {
        // Get currency info for the detected country
        const currencyInfo = await getCurrencyForCountry(countryCode);
        setSelectedCurrency(currencyInfo);
        
        // Store in local storage for next time
        localStorage.setItem('userCurrency', JSON.stringify(currencyInfo));
        
        // Set a cookie for the country code for server-side detection
        document.cookie = `userCountry=${countryCode}; path=/; max-age=2592000`; // 30 days
        
        toast.success(`Currency set to ${currencyInfo.code} based on your location`);
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      // Fallback to default currency
      setSelectedCurrency(DEFAULT_CURRENCY);
    }
  };

  // Handle currency change
  const handleCurrencyChange = async (value: string) => {
    try {
      // Find the currency info from CURRENCY_MAP
      let currencyInfo: CurrencyInfo = DEFAULT_CURRENCY;
      
      // Find the first country that uses this currency code
      for (const [country, info] of Object.entries(CURRENCY_MAP)) {
        if (info.code === value) {
          currencyInfo = info;
          break;
        }
      }
      
      setSelectedCurrency(currencyInfo);
      
      // Save to localStorage for client-side access
      localStorage.setItem('userCurrency', JSON.stringify(currencyInfo));
      
      toast.success(`Currency changed to ${currencyInfo.code}`);
      
      // Refresh the page to update all prices
      window.location.reload();
    } catch (error) {
      console.error("Error setting currency:", error);
      toast.error("Failed to update currency. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-8 bg-gray-200 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={selectedCurrency.code} 
        onValueChange={handleCurrencyChange}
      >
        <SelectTrigger className="w-[80px] h-8">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {Object.values(CURRENCY_MAP)
            // Filter out duplicate currency codes
            .filter((curr, index, self) => 
              index === self.findIndex(c => c.code === curr.code)
            )
            .map(currency => (
              <SelectItem key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code}
              </SelectItem>
            ))
          }
        </SelectContent>
      </Select>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8" 
        onClick={() => detectLocationAndSetCurrency()}
        title="Detect currency from your location"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
        </svg>
      </Button>
    </div>
  );
} 