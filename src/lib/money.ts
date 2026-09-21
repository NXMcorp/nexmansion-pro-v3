// Server-authoritative money utilities.
// All authoritative amounts are stored as integers in minor currency units (e.g. euro cents).

export const SUPPORTED_CURRENCIES = ["EUR", "USD", "IDR"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export function currencyMinorMultiplier(currency: string): number {
  // IDR has no commonly used minor unit; treat minor = whole.
  if (currency === "IDR") return 1;
  return 100;
}

export function formatMoney(minor: number, currency: string = "EUR", locale: string = "en-GB"): string {
  const major = minor / currencyMinorMultiplier(currency);
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "IDR" ? 0 : 0,
    }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString(locale)}`;
  }
}

export function formatMoneyMajor(major: number, currency: string = "EUR", locale: string = "en-GB"): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      maximumFractionDigits: currency === "IDR" ? 0 : 0,
    }).format(major);
  } catch {
    return `${currency} ${major.toLocaleString(locale)}`;
  }
}

export interface PriceBreakdown {
  nights: number;
  nightlyRateMinor: number;
  nightsSubtotalMinor: number;
  cleaningFeeMinor: number;
  serviceFeeMinor: number;
  platformFeeMinor: number;
  taxMinor: number;
  servicesMinor: number;
  discountMinor: number;
  depositMinor: number;
  totalMinor: number;
  hostNetMinor: number;
  currency: string;
}

export interface PricingInput {
  nightlyRateMinor: number;
  nights: number;
  cleaningFeeMinor: number;
  serviceFeePct: number; // guest-facing service fee %
  taxPct: number;
  platformCommissionPct: number; // taken from host net in reporting
  servicesMinor?: number;
  discountMinor?: number;
  securityDepositMinor?: number;
  currency?: string;
}

/**
 * Server-authoritative price calculation.
 * All inputs are minor units (integers).
 * Never do float math for money.
 */
export function calculatePrice(input: PricingInput): PriceBreakdown {
  const nightsSubtotalMinor = input.nightlyRateMinor * input.nights;
  const accommodationSubtotal = nightsSubtotalMinor + input.cleaningFeeMinor;
  const servicesMinor = input.servicesMinor ?? 0;
  const discountMinor = input.discountMinor ?? 0;

  // percent-based fees are rounded to nearest minor unit
  const pctBase = nightsSubtotalMinor; // percent fees calculated off stay
  const serviceFeeMinor = Math.round((pctBase * input.serviceFeePct) / 100);
  const preTax = accommodationSubtotal + servicesMinor + serviceFeeMinor - discountMinor;
  const taxMinor = Math.round((preTax * input.taxPct) / 100);
  const totalMinor = preTax + taxMinor + (input.securityDepositMinor ?? 0);
  const platformFeeMinor = Math.round((nightsSubtotalMinor * input.platformCommissionPct) / 100);
  const hostNetMinor =
    nightsSubtotalMinor +
    input.cleaningFeeMinor +
    servicesMinor -
    platformFeeMinor -
    discountMinor;

  return {
    nights: input.nights,
    nightlyRateMinor: input.nightlyRateMinor,
    nightsSubtotalMinor,
    cleaningFeeMinor: input.cleaningFeeMinor,
    serviceFeeMinor,
    platformFeeMinor,
    taxMinor,
    servicesMinor,
    discountMinor,
    depositMinor: input.securityDepositMinor ?? 0,
    totalMinor,
    hostNetMinor,
    currency: input.currency ?? "EUR",
  };
}

export function serviceLinePrice(
  priceMinor: number,
  priceModel: string,
  quantity: number,
  guests: number,
  nights: number,
): number {
  switch (priceModel) {
    case "PER_GUEST":
      return priceMinor * Math.max(1, guests) * quantity;
    case "PER_DAY":
      return priceMinor * Math.max(1, nights) * quantity;
    case "PER_TRIP":
    case "FIXED":
    case "QUOTE":
    default:
      return priceMinor * quantity;
  }
}

/**
 * Stay nights calculation. Returns number of nights.
 */
export function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

export function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function parseISODate(s: string): Date {
  return new Date(s + "T00:00:00Z");
}

export function formatDate(s: string | Date, locale = "en-GB"): string {
  const d = typeof s === "string" ? new Date(s) : s;
  return d.toLocaleDateString(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
