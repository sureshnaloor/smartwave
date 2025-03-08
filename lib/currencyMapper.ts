'use server';

import { CURRENCY_MAP, DEFAULT_CURRENCY, type CurrencyInfo } from './currencyTypes';

export async function getCurrencyForCountry(countryCode: string): Promise<CurrencyInfo> {
  // console.log('countryCode', countryCode);
  return CURRENCY_MAP[countryCode] || DEFAULT_CURRENCY;

} 