import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Zero-decimal currencies (ISO 4217). Prices in these currencies are not subdivided.
const ZERO_DECIMAL_CURRENCIES = new Set([
  "KRW", "JPY", "VND", "CLP", "ISK", "HUF", "TWD", "UGX", "XAF", "XOF", "XPF", "RWF", "BIF", "DJF", "GNF", "KMF", "PYG",
]);

export function formatPrice(amount: string | number, currencyCode: string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const decimals = ZERO_DECIMAL_CURRENCIES.has(currencyCode.toUpperCase()) ? 0 : 2;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  } catch {
    return `${currencyCode} ${num.toFixed(decimals)}`;
  }
}
