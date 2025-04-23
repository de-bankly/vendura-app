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
  productDiscount,
  showToast,
  setReceiptReady,
  setPaymentModalOpen,
  setPaymentLoading,
}) => {
  setPaymentLoading(true);

  try {
    // Use subtotal as the starting point for remaining amount calculation
    const roundedSubtotal = Math.round(subtotal * 100) / 100;
    let remainingAmount = roundedSubtotal;

    // Round the final total for consistency if needed elsewhere
    const roundedTotal = Math.round(total * 100) / 100;

    // Prepare payments in the specific order required by the backend
    const payments = [];

    // Deposit wird nicht mehr als Zahlungsmethode im payments-Array gespeichert
    // da die Pfandinformationen bereits im depositReceipts-Objekt korrekt übergeben werden
    if (appliedDeposits && appliedDeposits.length > 0 && depositCredit > 0) {
      // Nur den Restbetrag aktualisieren, aber kein Payment-Objekt hinzufügen
      remainingAmount -= Math.round(depositCredit * 100) / 100;
    }

    // 2. Add gift card payments
    if (appliedVouchers && appliedVouchers.length > 0) {
      const giftCardVouchers = appliedVouchers.filter(voucher => voucher.type === 'GIFT_CARD');
      for (const voucher of giftCardVouchers) {
        const voucherAmount = parseFloat(voucher.amount) || 0;
        if (voucherAmount > 0) {
          payments.push({
            type: 'GIFTCARD',
            amount: Math.round(voucherAmount * 100) / 100,
            giftcardId: voucher.id,
          });
          remainingAmount -= Math.round(voucherAmount * 100) / 100;
        }
      }
    }

    // 3. Add discount card payments
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

    // 4. Add cash or card payment
    if (paymentMethod === 'cash') {
      // Für Barzahlungen wird immer ein 'handed' Wert benötigt, der >= amount sein muss
      const parsedCashReceived = Math.round(parseFloat(cashReceived) * 100) / 100;
      const cashPaymentAmount = Math.max(0, remainingAmount);

      // Wenn kein Bargeld eingegeben wurde oder der Betrag 0 ist,
      // setzen wir handed = amount, um BackendValidierung zu bestehen
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

    // Prepare transaction data for the backend
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

    // Submit transaction to backend
    const response = await TransactionService.createSaleTransaction(transactionData);

    // Show success message
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

    // Update UI to show receipt
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
