import apiClient from './ApiConfig';

/**
 * Service for product transaction operations
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
      default:
        return { label: transactionType, color: 'default' };
    }
  }
}

export default new TransactionService();
