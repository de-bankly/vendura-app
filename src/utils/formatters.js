/**
 * Format a number as currency in EUR with German locale
 * @param {number} amount - The amount to format
 * @returns {string} The formatted currency string
 */
export const formatCurrency = amount => {
  return (parseFloat(amount) || 0).toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
};
