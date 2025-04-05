'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export type Country = {
  code: string;
  name: string;
  currency: string;
  flag: string;
};

type CountryContextType = {
  selectedCountry: Country;
  setCountry: (country: Country) => Promise<void>;
};

const CountryContext = createContext<CountryContextType | undefined>(undefined);

export function CountryProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'US',
    name: 'United States',
    currency: 'USD',
    flag: '🇺🇸'
  });

  // Load user's country preference on mount or when auth status changes
  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/user-preferences/country')
        .then(res => res.json())
        .then(data => {
          if (data.country) {
            setSelectedCountry(data.country);
          } else {
            // If no preference is set, use default USD
            setSelectedCountry({
              code: 'US',
              name: 'United States',
              currency: 'USD',
              flag: '🇺🇸'
            });
          }
        })
        .catch(() => {
          // On error, use default USD
          setSelectedCountry({
            code: 'US',
            name: 'United States',
            currency: 'USD',
            flag: '🇺🇸'
          });
        });
    }
  }, [status]);

  const setCountry = async (country: Country) => {
    if (status !== 'authenticated') {
      toast.error('Please login to save preferences');
      return;
    }

    try {
      const response = await fetch('/api/user-preferences/country', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      });

      if (!response.ok) throw new Error('Failed to update country preference');

      setSelectedCountry(country);
      toast.success('Country preference updated');
    } catch (error) {
      toast.error('Failed to update country preference');
    }
  };

  return (
    <CountryContext.Provider value={{ selectedCountry, setCountry }}>
      {children}
    </CountryContext.Provider>
  );
}

export function useCountry() {
  const context = useContext(CountryContext);
  if (context === undefined) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
}