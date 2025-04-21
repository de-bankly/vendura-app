import apiClient from './ApiConfig';
import GiftCardService from './GiftCardService';

/**
 * Service for managing sales transactions
 */
class TransactionService {
  /**
   * Create a new sale transaction
   * @param {Object} transactionData - The transaction data
   * @returns {Promise} Promise resolving to the created transaction
   */
  async createSaleTransaction(transactionData) {
    try {
      // Prepare position data (cart items)
      const positions = transactionData.cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity,
        discountValue: item.discount || 0,
      }));

      // Prepare payments data
      const payments = [];

      // Add cash payment if applicable
      if (transactionData.paymentMethod === 'cash') {
        payments.push({
          type: 'CASH',
          amount: transactionData.total,
          cashReceived: transactionData.cashReceived,
          change: transactionData.change,
        });
      }

      // Add card payment if applicable
      if (transactionData.paymentMethod === 'card') {
        payments.push({
          type: 'CARD',
          amount: transactionData.total,
          cardDetails: {
            cardNumber: transactionData.cardDetails?.cardNumber,
            cardHolderName: transactionData.cardDetails?.cardHolderName,
            expirationDate: transactionData.cardDetails?.expirationDate,
            cvv: transactionData.cardDetails?.cvv,
          },
        });
      }

      // Add gift card payments if applicable
      if (transactionData.appliedVouchers && transactionData.appliedVouchers.length > 0) {
        // Filter for gift card type vouchers only
        const giftCardVouchers = transactionData.appliedVouchers.filter(
          voucher => voucher.type === 'GIFT_CARD'
        );

        // Add each gift card as a payment
        for (const voucher of giftCardVouchers) {
          payments.push({
            type: 'GIFTCARD',
            amount: voucher.amount,
            giftcardId: voucher.id,
          });
        }

        // Apply discount cards if any
        const discountVouchers = transactionData.appliedVouchers.filter(
          voucher => voucher.type === 'DISCOUNT_CARD'
        );

        if (discountVouchers.length > 0) {
          // For simplicity, just use the first discount card
          const discountVoucher = discountVouchers[0];
          payments.push({
            type: 'GIFTCARD',
            amount: transactionData.voucherDiscount,
            giftcardId: discountVoucher.id,
          });
        }
      }

      // Construct sale DTO
      const saleDTO = {
        positions,
        payments,
        total: transactionData.subtotal,
      };

      console.log('Sending sale transaction to backend:', saleDTO);

      // Send to backend
      const response = await apiClient.post('/v1/sale', saleDTO);
      return response.data;
    } catch (error) {
      console.error('Error creating sale transaction:', error);
      throw error;
    }
  }

  /**
   * Get transaction history
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated transaction data
   */
  async getTransactionHistory(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/sale/history', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  }

  /**
   * Get a specific transaction by ID
   * @param {String} id - The transaction ID
   * @returns {Promise} Promise resolving to transaction data
   */
  async getTransactionById(id) {
    try {
      const response = await apiClient.get(`/v1/sale/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Void/cancel a transaction
   * @param {String} id - The transaction ID
   * @param {String} reason - The reason for voiding the transaction
   * @returns {Promise} Promise resolving to the voided transaction
   */
  async voidTransaction(id, reason) {
    try {
      const response = await apiClient.post(`/v1/sale/${id}/void`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error voiding transaction with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Issue a refund for a transaction
   * @param {String} id - The transaction ID
   * @param {Object} refundData - The refund data
   * @returns {Promise} Promise resolving to the refund data
   */
  async issueRefund(id, refundData) {
    try {
      const response = await apiClient.post(`/v1/sale/${id}/refund`, refundData);
      return response.data;
    } catch (error) {
      console.error(`Error issuing refund for transaction with ID ${id}:`, error);
      throw error;
    }
  }

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
