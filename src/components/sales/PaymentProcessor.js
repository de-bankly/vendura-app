import { TransactionService } from '../../services';
import { getUserFriendlyErrorMessage } from '../../utils/errorUtils';

/**
 * Processes a payment transaction by calculating amounts, preparing payment details,
 * calling the transaction service, and updating the UI.
 *
 * @param {object} params - The payment processing parameters.
 * @param {Array<object>} params.cartItems - Items in the cart.
 * @param {number} params.total - The final total amount after all discounts and credits.
 * @param {number} params.subtotal - The subtotal before discounts and credits.
 * @param {string} params.paymentMethod - The primary payment method ('cash' or 'card').
 * @param {string|number} params.cashReceived - Amount of cash received (if paymentMethod is 'cash').
 * @param {object} params.cardDetails - Details for card payment (if paymentMethod is 'card').
 * @param {string} params.cardDetails.cardNumber - The card number.
 * @param {Array<object>} params.appliedVouchers - Vouchers applied to the transaction.
 * @param {number} params.voucherDiscount - Total discount amount from vouchers.
 * @param {Array<object>} params.appliedDeposits - Deposit receipts applied.
 * @param {number} params.depositCredit - Total credit amount from deposits.
 * @param {number} params.productDiscount - Total discount applied directly to products.
 * @param {function} params.showToast - Function to display toast notifications.
 * @param {function} params.setReceiptReady - State setter to indicate receipt is ready.
 * @param {function} params.setPaymentModalOpen - State setter to close the payment modal.
 * @param {function} params.setPaymentLoading - State setter for loading indicator.
 * @returns {Promise<object>} An object indicating success or failure, potentially including the transaction response or error.
 */
export const processPayment = async ({
  cartItems,
  total,
  subtotal,
  paymentMethod,
  cashReceived,
  cardDetails,
  appliedVouchers,
  voucherDiscount,
  appliedDeposits,
  depositCredit,
  productDiscount,
  showToast,
  setReceiptReady,
  setPaymentModalOpen,
  setPaymentLoading,
}) => {
  setPaymentLoading(true);

  try {
    const roundedSubtotal = Math.round(subtotal * 100) / 100;
    let remainingAmount = roundedSubtotal;
    const roundedTotal = Math.round(total * 100) / 100;
    const payments = [];

    if (appliedDeposits && appliedDeposits.length > 0 && depositCredit > 0) {
      remainingAmount -= Math.round(depositCredit * 100) / 100;
    }

    if (appliedVouchers && appliedVouchers.length > 0) {
      const giftCardVouchers = appliedVouchers.filter(voucher => voucher.type === 'GIFT_CARD');
      for (const voucher of giftCardVouchers) {
        const voucherAmount = parseFloat(voucher.amount) || 0;
        if (voucherAmount > 0) {
          const roundedVoucherAmount = Math.min(
            Math.round(voucherAmount * 100) / 100,
            remainingAmount
          );
          if (roundedVoucherAmount > 0) {
            payments.push({
              type: 'GIFTCARD',
              amount: roundedVoucherAmount,
              giftcardId: voucher.id,
            });
            remainingAmount -= roundedVoucherAmount;
          }
        }
      }
    }

    if (appliedVouchers && appliedVouchers.length > 0 && voucherDiscount > 0) {
      const discountVouchers = appliedVouchers.filter(voucher => voucher.type === 'DISCOUNT_CARD');
      if (discountVouchers.length > 0) {
        const discountVoucher = discountVouchers[0];
        const roundedVoucherDiscount = Math.min(
          Math.round(voucherDiscount * 100) / 100,
          remainingAmount
        );

        if (roundedVoucherDiscount > 0) {
          payments.push({
            type: 'GIFTCARD',
            amount: roundedVoucherDiscount,
            giftcardId: discountVoucher.id,
          });
          remainingAmount -= roundedVoucherDiscount;
        }
      }
    }

    remainingAmount = Math.max(0, Math.round(remainingAmount * 100) / 100);

    if (paymentMethod === 'cash') {
      const parsedCashReceived = Math.round(parseFloat(cashReceived) * 100) / 100;
      const cashPaymentAmount = remainingAmount;
      const handedAmount =
        parsedCashReceived > 0 ? parsedCashReceived : Math.max(cashPaymentAmount, 0.01);

      payments.push({
        type: 'CASH',
        amount: cashPaymentAmount,
        handed: handedAmount,
        change: Math.max(0, Math.round((handedAmount - cashPaymentAmount) * 100) / 100),
      });
    } else if (paymentMethod === 'card' && remainingAmount > 0) {
      payments.push({
        type: 'CARD',
        amount: remainingAmount,
        cardDetails: {
          ...cardDetails,
          cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
        },
      });
    }

    const transactionData = {
      cartItems: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Math.round(item.price * 100) / 100,
        discount: item.discount || 0,
      })),
      paymentMethod,
      total: roundedTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      productDiscount: Math.round(productDiscount * 100) / 100,
      appliedVouchers,
      voucherDiscount: Math.round(voucherDiscount * 100) / 100,
      depositReceipts: appliedDeposits,
      depositCredit: Math.round(depositCredit * 100) / 100,
      payments,
    };

    const response = await TransactionService.createSaleTransaction(transactionData);

    showToast({
      message: 'Zahlung erfolgreich abgeschlossen!',
      severity: 'success',
      title: 'Erfolg',
      anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
      variant: 'filled',
      autoHideDuration: 6000,
      sx: {
        left: 'auto',
        right: 'auto',
        width: '100%',
        maxWidth: '400px',
      },
    });

    setReceiptReady(true);
    setPaymentModalOpen(false);

    return { ...response, success: true };
  } catch (error) {
    console.error('Payment error:', error);
    showToast({
      message: getUserFriendlyErrorMessage(error, 'Zahlungsfehler'),
      severity: 'error',
    });
    return { success: false, error };
  } finally {
    setPaymentLoading(false);
  }
};
