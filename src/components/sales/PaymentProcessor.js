import { TransactionService } from '../../services';
import { getUserFriendlyErrorMessage } from '../../utils/errorUtils';

/**
 * Processes a payment transaction
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
  showToast,
  setReceiptReady,
  setPaymentModalOpen,
  setSuccessSnackbarOpen,
  setPaymentLoading,
}) => {
  setPaymentLoading(true);

  try {
    // Round the total for payment processing
    const roundedTotal = Math.round(total * 100) / 100;

    // Prepare transaction data for the backend
    const transactionData = {
      cartItems: cartItems.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: Math.round(item.price * 100) / 100,
        discount: item.discount || 0,
      })),
      paymentMethod: paymentMethod,
      total: roundedTotal,
      subtotal: Math.round(subtotal * 100) / 100,
      appliedVouchers: appliedVouchers,
      voucherDiscount: Math.round(voucherDiscount * 100) / 100,
      depositReceipts: appliedDeposits,
      depositCredit: Math.round(depositCredit * 100) / 100,
      // Include additional payment details based on payment method
      cashReceived: paymentMethod === 'cash' ? Math.round(parseFloat(cashReceived) * 100) / 100 : 0,
      change:
        paymentMethod === 'cash'
          ? Math.round((parseFloat(cashReceived) - roundedTotal) * 100) / 100
          : 0,
      cardDetails:
        paymentMethod === 'card'
          ? {
              ...cardDetails,
              cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
            }
          : null,
    };

    // Submit transaction to backend
    const response = await TransactionService.createSaleTransaction(transactionData);

    // Show success message
    showToast({
      message: 'Zahlung erfolgreich',
      severity: 'success',
    });

    // Update UI to show receipt
    setReceiptReady(true);
    setPaymentModalOpen(false);
    setSuccessSnackbarOpen(true);

    return response;
  } catch (error) {
    console.error('Payment error:', error);
    showToast({
      message: getUserFriendlyErrorMessage(error, 'Zahlungsfehler'),
      severity: 'error',
    });
    throw error;
  } finally {
    setPaymentLoading(false);
  }
};
