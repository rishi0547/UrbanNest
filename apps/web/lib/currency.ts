/**
 * Global Indian Rupee (INR) currency formatter utility.
 * Formats a monetary number into standard Indian numbering format (e.g. ₹1,25,000).
 */
export const formatPrice = (amount: number | string | null | undefined): string => {
  const numericValue = typeof amount === "string" ? parseFloat(amount) : Number(amount ?? 0);
  if (isNaN(numericValue)) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

// Backwards compatibility alias
export const formatINR = formatPrice;

export default formatPrice;
