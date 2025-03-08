export type CurrencyInfo = {
  code: string;
  symbol: string;
  rate: number;
  position: 'before' | 'after';
};

export const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  US: {
    code: 'USD',
    symbol: '$',
    rate: 1,
    position: 'before'
  },
  CA: {
    code: 'CAD',
    symbol: 'CAD',
    rate: 1.35,
    position: 'before'
  },
  // European Union countries
  DE: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    position: 'before'
  },
  FR: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    position: 'before'
  },
  IT: {
    code: 'EUR',
    symbol: '€',
    rate: 0.92,
    position: 'before'
  },
  // Add more EU countries as needed
  
  SA: {
    code: 'SAR',
    symbol: 'SAR',
    rate: 3.75,
    position: 'after'
  },
  AE: {
    code: 'AED',
    symbol: 'AED',
    rate: 3.67,
    position: 'after'
  },
  IN: {
    code: 'INR',
    symbol: '₹',
    rate: 83,
    position: 'before'
  }
};

export const DEFAULT_CURRENCY: CurrencyInfo = {
  code: 'USD',
  symbol: '$',
  rate: 1,
  position: 'before'
}; 