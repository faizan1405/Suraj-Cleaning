/**
 * Currency configuration — single source of truth for INR formatting.
 *
 * All prices in this application are in Indian Rupees (INR).
 * Import formatPrice() wherever prices are displayed.
 */

import { payments } from "@/config/site";

/** ISO currency code */
export const CURRENCY_CODE = payments.currency as "INR";

/** Display symbol */
export const CURRENCY_SYMBOL = payments.currencySymbol as "₹";

/**
 * Format a numeric amount as Indian Rupees.
 *
 * @example
 * formatPrice    // "₹1,499.00"
 * formatPrice(49)      // "₹49.00"
 * formatPrice(0)       // "₹0.00"
 */
export function formatPrice(amount: number): string {
  return `${CURRENCY_SYMBOL}${amount.toFixed(2)}`;
}

/**
 * Format a numeric amount using Intl.NumberFormat for proper Indian numbering system.
 * Uses lakh/crore grouping: e.g., ₹1,50,000.00
 *
 * @example
 * formatPriceIN  // "₹1,50,000.00"
 * formatPriceIN    // "₹1,499.00"
 */
export function formatPriceIN(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
