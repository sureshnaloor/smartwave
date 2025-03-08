'use server';

import { CURRENCY_MAP, DEFAULT_CURRENCY, type CurrencyInfo } from './currencyTypes';

export async function getCurrencyForCountry(countryCode: string): Promise<CurrencyInfo> {
  console.log('Server: Processing country code:', countryCode); // Add logging for debugging
  
  if (!countryCode || typeof countryCode !== 'string') {
    console.log('Server: Invalid country code, using default currency');
    return DEFAULT_CURRENCY;
  }
  
  const normalizedCountryCode = countryCode.toUpperCase();
  const currencyInfo = CURRENCY_MAP[normalizedCountryCode];
  
  if (!currencyInfo) {
    console.log(`Server: No currency found for country code: ${normalizedCountryCode}`);
    return DEFAULT_CURRENCY;
  }
  
  console.log('Server: Selected currency:', currencyInfo);
  return currencyInfo;
} 