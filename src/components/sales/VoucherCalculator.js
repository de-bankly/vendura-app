/**
 * Calculates the discount amount from vouchers
 * @param {number} subtotal - The subtotal before discounts
 * @param {Array} vouchers - Array of voucher objects
 * @returns {number} The discount amount
 */
export const calculateVoucherDiscount = (subtotal, vouchers) => {
  if (!vouchers || vouchers.length === 0) return 0;

  // Get discount vouchers
  const discountVouchers = vouchers.filter(v => v.type === 'DISCOUNT_CARD');
  if (discountVouchers.length === 0) return 0;

  // For simplicity, we'll just use the first discount voucher
  // In a real implementation, you might want to stack discounts or use the highest one
  const discountVoucher = discountVouchers[0];
  const discountPercentage = parseFloat(discountVoucher.discountPercentage) || 0;

  // Calculate the actual discount amount, ensuring it's a valid number
  return subtotal * (discountPercentage / 100);
};

/**
 * Calculates the gift card payment amount
 * @param {number} afterDiscountTotal - The total after discounts
 * @param {Array} vouchers - Array of voucher objects
 * @returns {number} The gift card payment amount
 */
export const calculateGiftCardPayment = (afterDiscountTotal, vouchers) => {
  if (!vouchers || vouchers.length === 0) return 0;

  // Get gift card vouchers
  const giftCardVouchers = vouchers.filter(v => v.type === 'GIFT_CARD');
  if (giftCardVouchers.length === 0) return 0;

  // We now sum up the pre-specified amounts for each gift card
  let totalGiftCardPayment = 0;

  for (const voucher of giftCardVouchers) {
    // Only add gift cards with a specified amount
    const voucherAmount = parseFloat(voucher.amount) || 0;
    if (voucherAmount > 0) {
      totalGiftCardPayment += voucherAmount;
    }
  }

  // Make sure the total doesn't exceed the amount due
  return Math.min(totalGiftCardPayment, afterDiscountTotal);
};
