export type ProductType = 'pvc' | 'nfc' | 'color' | 'premium' | 'annual' | 'fiveEdits' | 'singleEdit';

export interface CurrencyRates {
  [key: string]: {
    symbol: string;
    position: 'before' | 'after';
    rates: {
      [key in ProductType]: number;
    };
  };
}

export const currencyConfig: CurrencyRates = {
  INR: {
    symbol: '₹',
    position: 'before',
    rates: {
      pvc: 499,
      nfc: 999,
      color: 799,
      premium: 1499,
      annual: 4999,
      fiveEdits: 2499,
      singleEdit: 599
    }
  },
  USD: {
    symbol: '$',
    position: 'before',
    rates: {
      pvc: 5.99,
      nfc: 11.99,
      color: 9.99,
      premium: 17.99,
      annual: 59.99,
      fiveEdits: 29.99,
      singleEdit: 7.99
    }
  },
  SAR: {
    symbol: 'SAR',
    position: 'after',
    rates: {
      pvc: 22.50,
      nfc: 45,
      color: 37.50,
      premium: 67.50,
      annual: 225,
      fiveEdits: 112.50,
      singleEdit: 30
    }
  },
  AED: {
    symbol: 'AED',
    position: 'after',
    rates: {
      pvc: 22,
      nfc: 44,
      color: 36,
      premium: 66,
      annual: 220,
      fiveEdits: 110,
      singleEdit: 29
    }
  },
  BHD: {
    symbol: 'BHD',
    position: 'after',
    rates: {
      pvc: 2.25,
      nfc: 4.50,
      color: 3.75,
      premium: 6.75,
      annual: 22.50,
      fiveEdits: 11.25,
      singleEdit: 3
    }
  }
};

export const DEFAULT_CURRENCY = {
  code: 'INR',
  ...currencyConfig.INR
};