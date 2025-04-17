import apiClient from './ApiConfig';

/**
 * Service for transaction operations including sales and gift card redemption
 */
class TransactionService {
  /**
   * Get all transactions for a product
   * @param {String} productId - The ID of the product
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to transaction data
   */
  async getProductTransactions(productId, pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get(`/v1/transaction/product/product/${productId}`, {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Get all product transactions in the system
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to transaction data
   */
  async getAllProductTransactions(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/transaction/product', {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching all product transactions:', error);
      throw error;
    }
  }

  /**
   * Create a new sale transaction with optional gift card payment
   * @param {Object} saleData - The sale transaction data
   * @returns {Promise} Promise resolving to the created sale
   */
  async createSaleTransaction(saleData) {
    try {
      // Prepare payment data based on payment method and vouchers
      const payments = [];

      // Add gift card payments if any are applied
      if (saleData.appliedVouchers && saleData.appliedVouchers.length > 0) {
        const giftCardVouchers = saleData.appliedVouchers.filter(v => v.type === 'GIFT_CARD');

        giftCardVouchers.forEach(voucher => {
          if (voucher.amount > 0) {
            payments.push({
              type: 'GIFT_CARD',
              amount: voucher.amount,
              giftcardId: voucher.id,
            });
          }
        });
      }

      // Add primary payment method (cash or card)
      if (saleData.paymentMethod === 'cash') {
        payments.push({
          type: 'CASH',
          amount: saleData.total,
          handed: parseFloat(saleData.cashReceived),
          returned: saleData.change,
        });
      } else if (saleData.paymentMethod === 'card') {
        payments.push({
          type: 'CARD',
          amount: saleData.total,
          cardNumber: saleData.cardDetails?.cardNumber || '',
          cardHolderName: saleData.cardDetails?.cardHolderName || '',
          expirationDate: saleData.cardDetails?.expirationDate || '',
          cvv: saleData.cardDetails?.cvv || '',
        });
      }

      // Format cart items for the backend
      const items = saleData.cartItems.map(item => ({
        product: { id: item.id },
        quantity: item.quantity,
        pricePerItem: item.price,
      }));

      // Prepare the final request data
      const requestData = {
        items,
        payments,
        total: saleData.subtotal, // The backend will calculate discounts based on applied vouchers
        discount: saleData.voucherDiscount,
        appliedDiscountCards: saleData.appliedVouchers
          .filter(v => v.type === 'DISCOUNT_CARD')
          .map(v => v.id),
      };

      const response = await apiClient.post('/v1/sale', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating sale transaction:', error);
      throw error;
    }
  }

  /**
   * Format transaction type for display
   * @param {String} transactionType - Transaction type from API
   * @returns {Object} Formatted display information
   */
  getTransactionTypeDisplay(transactionType) {
    switch (transactionType) {
      case 'WAREHOUSE_IN':
        return { label: 'Wareneingang', color: 'success' };
      case 'WAREHOUSE_OUT':
        return { label: 'Warenausgang', color: 'error' };
      case 'SALE':
        return { label: 'Verkauf', color: 'info' };
      case 'RETURN':
        return { label: 'Rückgabe', color: 'warning' };
      case 'GIFT_CARD_PAYMENT':
        return { label: 'Gutscheinzahlung', color: 'primary' };
      default:
        return { label: transactionType, color: 'default' };
    }
  }
}

export default new TransactionService();
