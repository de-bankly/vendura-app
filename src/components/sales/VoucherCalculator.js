/**
 * Calculates the discount amount from vouchers
 * @param {number} subtotal - The subtotal before discounts
 * @param {Array} vouchers - Array of voucher objects
 * @returns {number} The discount amount
 */
export const calculateVoucherDiscount = (subtotal, vouchers) => {
  if (!vouchers || vouchers.length === 0) return 0;

  const discountVouchers = vouchers.filter(v => v.type === 'DISCOUNT_CARD');
  if (discountVouchers.length === 0) return 0;

  const discountVoucher = discountVouchers[0];
  const discountPercentage = parseFloat(discountVoucher.discountPercentage) || 0;

  return Math.round(subtotal * (discountPercentage / 100) * 100) / 100;
};

/**
 * Calculates the gift card payment amount
 * @param {number} afterProductDiscountTotal - The total after product-specific discounts
 * @param {Array} vouchers - Array of voucher objects
 * @returns {number} The gift card payment amount
 */
export const calculateGiftCardPayment = (afterProductDiscountTotal, vouchers) => {
  if (!vouchers || vouchers.length === 0) return 0;

  const giftCardVouchers = vouchers.filter(v => v.type === 'GIFT_CARD');
  if (giftCardVouchers.length === 0) return 0;

  let totalGiftCardPayment = 0;

  for (const voucher of giftCardVouchers) {
    const voucherAmount = parseFloat(voucher.amount) || 0;
    if (voucherAmount > 0) {
      totalGiftCardPayment += voucherAmount;
    }
  }

  return Math.round(Math.min(totalGiftCardPayment, afterProductDiscountTotal) * 100) / 100;
};
