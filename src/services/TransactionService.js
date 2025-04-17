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
      // Create payment objects for the backend
      const payments = [];

      // Add gift card payments if any are applied
      if (saleData.appliedVouchers && saleData.appliedVouchers.length > 0) {
        const giftCardVouchers = saleData.appliedVouchers.filter(v => v.type === 'GIFT_CARD');

        giftCardVouchers.forEach(voucher => {
          if (voucher.amount > 0) {
            payments.push({
              type: 'GIFTCARD',
              amount: voucher.amount,
              giftcardId: voucher.id,
              timestamp: new Date(),
              status: 'PENDING',
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
          timestamp: new Date(),
          status: 'PENDING',
        });
      } else if (saleData.paymentMethod === 'card') {
        payments.push({
          type: 'CARD',
          amount: saleData.total,
          cardNumber: saleData.cardDetails?.cardNumber || '',
          cardHolderName: saleData.cardDetails?.cardHolderName || '',
          expirationDate: saleData.cardDetails?.expirationDate || '',
          cvv: saleData.cardDetails?.cvv || '',
          timestamp: new Date(),
          status: 'PENDING',
        });
      }

      // Create positions (items) for the backend
      const positions = saleData.cartItems.map(item => ({
        productDTO: {
          id: item.id,
        },
        quantity: item.quantity,
        discountEuro: 0, // No direct discount on individual positions in this implementation
      }));

      // Prepare the final request data matching SaleDTO format
      const requestData = {
        positions,
        payments,
        total: saleData.subtotal,
        date: new Date(),
        depositReceipts: [], // Empty deposit receipts by default
      };

      console.log('Sale request payload:', JSON.stringify(requestData, null, 2));

      const response = await apiClient.post('/v1/sale', requestData);
      return response.data;
    } catch (error) {
      console.error('Error creating sale transaction:', error);

      // Enhanced error handling with details
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);

        // Throw a more detailed error
        const errorMessage =
          error.response.data?.error || error.response.data?.message || 'Unknown server error';
        throw new Error(`Payment failed (${error.response.status}): ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error;
      }
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
