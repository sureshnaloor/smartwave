export type CurrencyInfo = {
  code: string;
  symbol: string;
  rates: {
    pvc: number;
    nfc: number;
    color: number;
    premium: number;
    annual: number;
    fiveEdits: number;
    singleEdit: number;
  };
  position: 'before' | 'after';
};

export const CURRENCY_MAP: Record<string, CurrencyInfo> = {
  US: {
    code: 'USD',
    symbol: '$',
    rates: {
      pvc: 19,
      nfc: 49.99,
      color: 99.99,
      premium: 149.99,
      annual: 9.99,
      fiveEdits: 2.99,
      singleEdit: 0.99
    },
    position: 'before'
  },
  CA: {
    code: 'CAD',
    symbol: 'C$',
    rates: {
      pvc: 19,
      nfc: 49.99,
      color: 99.99,
      premium: 149.99,
      annual: 9.99,
      fiveEdits: 2.99,
      singleEdit: 0.99
    },
    position: 'before'
  },
  DE: {
    code: 'EUR',
    symbol: '€',
    rates: {
      pvc: 9.99,
      nfc: 49.99,
      color: 99.99,
      premium: 149.99,
      annual: 9.99,
      fiveEdits: 2.99,
      singleEdit: 0.99
    },
    position: 'before'
  },
  FR: {
    code: 'EUR',
    symbol: '€',
    rates: {
      pvc: 9.99,
      nfc: 49.99,
      color: 99.99,
      premium: 149.99,
      annual: 9.99,
      fiveEdits: 2.99,
      singleEdit: 0.99
    },
    position: 'before'
  },
  IT: {
    code: 'EUR',
    symbol: '€',
    rates: {
      pvc: 9.99,
      nfc: 49.99,
      color: 99.99,
      premium: 149.99,
      annual: 9.99,
      fiveEdits: 2.99,
      singleEdit: 0.99
    },
    position: 'before'
  },
  SA: {
    code: 'SAR',
    symbol: '﷼',
    rates: {
      pvc: 49.99,
      nfc: 149.99,
      color: 299.99,
      premium: 499.99,
      annual: 19.99,
      fiveEdits: 4.99,
      singleEdit: 1.99
    },
    position: 'after'
  },
  AE: {
    code: 'AED',
    symbol: 'د.إ',
    rates: {
      pvc: 49.99,
      nfc: 149.99,
      color: 299.99,
      premium: 499.99,
      annual: 19.99,
      fiveEdits: 4.99,
      singleEdit: 1.99
    },
    position: 'after'
  },
  IN: {
    code: 'INR',
    symbol: '₹',
    rates: {
      pvc: 499.99,
      nfc: 999.99,
      color: 1499,
      premium: 2499.99,
      annual: 199.99,
      fiveEdits: 29.99,
      singleEdit: 19.99
    },
    position: 'before'
  }
};

export const DEFAULT_CURRENCY: CurrencyInfo = {
  code: 'USD',
  symbol: '$',
  rates: {
    pvc: 19,
    nfc: 49.99,
    color: 99.99,
    premium: 149.99,
    annual: 9.99,
    fiveEdits: 2.99,
    singleEdit: 0.99
  },
  position: 'before'
};