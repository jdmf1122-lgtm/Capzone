/**
 * Philippine Peso (PHP) formatting utilities
 */

export const formatPeso = (amount: number, options?: { showDecimals?: boolean; includeCode?: boolean }): string => {
  const num = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  const formatted = num.toLocaleString('en-PH', {
    minimumFractionDigits: options?.showDecimals ? 2 : 0,
    maximumFractionDigits: options?.showDecimals ? 2 : 0
  });

  if (options?.includeCode) {
    return `PHP ₱${formatted}`;
  }
  return `₱${formatted}`;
};
