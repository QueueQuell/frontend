/**
 * Currency Utilities for QueueQuell
 * Handles INR formatting and currency display
 */

/**
 * Format currency in Indian Rupees with proper decimal representation
 */
export function formatINR(amount: number | string, showSymbol: boolean = true): string {
  // Convert to number if string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  // Handle invalid amounts
  if (isNaN(numAmount)) {
    return showSymbol ? '₹0.00' : '0.00';
  }

  // Format with Indian numbering system
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Format currency without decimals (for whole numbers)
 */
export function formatINRWhole(amount: number | string, showSymbol: boolean = true): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return showSymbol ? '₹0' : '0';
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numAmount);

  return showSymbol ? `₹${formatted}` : formatted;
}

/**
 * Parse currency string back to number
 */
export function parseINR(currencyString: string): number {
  // Remove currency symbol and commas
  const cleaned = currencyString.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format price range (e.g., "₹100.00 - ₹200.00")
 */
export function formatINRRange(min: number, max: number): string {
  return `${formatINR(min)} - ${formatINR(max)}`;
}

/**
 * Format discount percentage with INR savings
 */
export function formatDiscount(originalPrice: number, discountedPrice: number): {
  discountPercent: string;
  savings: string;
  finalPrice: string;
} {
  const savings = originalPrice - discountedPrice;
  const discountPercent = Math.round((savings / originalPrice) * 100);

  return {
    discountPercent: `${discountPercent}% off`,
    savings: formatINR(savings),
    finalPrice: formatINR(discountedPrice),
  };
}

/**
 * Currency constants
 */
export const CURRENCY = {
  SYMBOL: '₹',
  CODE: 'INR',
  NAME: 'Indian Rupee',
  DECIMAL_PLACES: 2,
} as const;

/**
 * Common currency amounts for UI consistency
 */
export const COMMON_AMOUNTS = {
  ZERO: formatINR(0),
  FREE: 'FREE',
  MINIMUM: formatINR(1),
  MAXIMUM: formatINR(999999.99),
} as const;
