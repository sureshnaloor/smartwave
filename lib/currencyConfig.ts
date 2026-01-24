export type ProductType =
  | 'pvc' | 'nfc' | 'color' | 'premium'
  | 'annual' | 'fiveEdits' | 'singleEdit'
  | 'plan_individual_perpetual' | 'plan_individual_annual'
  | 'plan_starter_annual' | 'plan_starter_5y'
  | 'plan_growth_annual' | 'plan_growth_5y'
  | 'plan_growth_100_annual' | 'plan_growth_100_5y';

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
      pvc: 749,
      nfc: 2249,
      color: 1499,
      premium: 3749,
      annual: 4999,
      fiveEdits: 2499,
      singleEdit: 599,
      plan_individual_perpetual: 1199,
      plan_individual_annual: 299,
      plan_starter_annual: 1499,
      plan_starter_5y: 1049,
      plan_growth_annual: 2249,
      plan_growth_5y: 1575,
      plan_growth_100_annual: 7499,
      plan_growth_100_5y: 5249
    }
  },
  USD: {
    symbol: '$',
    position: 'before',
    rates: {
      pvc: 9.99,
      nfc: 29.99,
      color: 19.99,
      premium: 49.99,
      annual: 59.99,
      fiveEdits: 29.99,
      singleEdit: 7.99,
      plan_individual_perpetual: 15.99,
      plan_individual_annual: 3.99,
      plan_starter_annual: 19.99,
      plan_starter_5y: 13.99,
      plan_growth_annual: 29.99,
      plan_growth_5y: 20.99,
      plan_growth_100_annual: 99.99,
      plan_growth_100_5y: 69.99
    }
  },
  SAR: {
    symbol: 'SAR',
    position: 'after',
    rates: {
      pvc: 37.50,
      nfc: 112.50,
      color: 75,
      premium: 187.50,
      annual: 225,
      fiveEdits: 112.50,
      singleEdit: 30,
      plan_individual_perpetual: 59,
      plan_individual_annual: 15,
      plan_starter_annual: 75,
      plan_starter_5y: 52,
      plan_growth_annual: 112,
      plan_growth_5y: 79,
      plan_growth_100_annual: 375,
      plan_growth_100_5y: 262
    }
  },
  AED: {
    symbol: 'AED',
    position: 'after',
    rates: {
      pvc: 37.50,
      nfc: 112.50,
      color: 75,
      premium: 187.50,
      annual: 220,
      fiveEdits: 110,
      singleEdit: 29,
      plan_individual_perpetual: 59,
      plan_individual_annual: 15,
      plan_starter_annual: 75,
      plan_starter_5y: 52,
      plan_growth_annual: 112,
      plan_growth_5y: 79,
      plan_growth_100_annual: 375,
      plan_growth_100_5y: 262
    }
  },
  BHD: {
    symbol: 'BHD',
    position: 'after',
    rates: {
      pvc: 3.75,
      nfc: 11.25,
      color: 7.5,
      premium: 18.75,
      annual: 22.50,
      fiveEdits: 11.25,
      singleEdit: 3,
      plan_individual_perpetual: 5.9,
      plan_individual_annual: 1.5,
      plan_starter_annual: 7.5,
      plan_starter_5y: 5.25,
      plan_growth_annual: 11.25,
      plan_growth_5y: 7.85,
      plan_growth_100_annual: 37.5,
      plan_growth_100_5y: 26.25
    }
  }
};

export const DEFAULT_CURRENCY = {
  code: 'INR',
  ...currencyConfig.INR
};