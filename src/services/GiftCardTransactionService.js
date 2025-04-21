import apiClient from './ApiConfig';

/**
 * Service for managing gift card transactions
 */
class GiftCardTransactionService {
  /**
   * Get transaction history for a specific gift card
   * @param {String} giftCardId - The gift card ID
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated transaction data
   */
  async getTransactions(giftCardId, pageable = { page: 0, size: 20 }) {
    try {
      const response = await apiClient.get(`/v1/giftcard/${giftCardId}/transactions`, {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions for gift card ${giftCardId}:`, error);
      throw error;
    }
  }

  /**
   * Get transaction history for a specific gift card (alias for getTransactions)
   * @param {String} giftCardId - The gift card ID
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated transaction data
   */
  async getTransactionsByGiftCardId(giftCardId, pageable = { page: 0, size: 20 }) {
    return this.getTransactions(giftCardId, pageable);
  }

  /**
   * Format transaction data for display
   * @param {Object} transaction - Transaction data from API
   * @returns {Object} Formatted transaction data
   */
  formatTransaction(transaction) {
    return {
      ...transaction,
      formattedAmount: transaction.amount.toFixed(2) + ' €',
      formattedDate: new Date(transaction.timestamp).toLocaleString(),
    };
  }

  /**
   * Recharge a gift card with specified amount
   * @param {String} giftCardId - The gift card ID
   * @param {Number} amount - The amount to add to the card
   * @returns {Promise} Promise resolving to the created transaction
   */
  async rechargeGiftCard(giftCardId, amount) {
    return this.createManualTransaction(
      giftCardId,
      amount,
      `Manuelle Aufladung: ${amount.toFixed(2)} €`
    );
  }

  /**
   * Create a manual transaction for a gift card (e.g., adding balance)
   * @param {String} giftCardId - The gift card ID
   * @param {Number} amount - The transaction amount (positive for credit, negative for debit)
   * @param {String} description - Description of the transaction
   * @returns {Promise} Promise resolving to the created transaction
   */
  async createManualTransaction(giftCardId, amount, description) {
    try {
      const payload = {
        giftCardId,
        amount,
        description,
        type: 'MANUAL',
      };

      const response = await apiClient.post(`/v1/giftcard/${giftCardId}/transaction`, payload);
      return response.data;
    } catch (error) {
      console.error(`Error creating manual transaction for gift card ${giftCardId}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific transaction by ID
   * @param {String} transactionId - The transaction ID
   * @returns {Promise} Promise resolving to transaction data
   */
  async getTransactionById(transactionId) {
    try {
      const response = await apiClient.get(`/v1/giftcard/transaction/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction with ID ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Void/cancel a transaction
   * @param {String} transactionId - The transaction ID
   * @param {String} reason - The reason for voiding the transaction
   * @returns {Promise} Promise resolving to the voided transaction
   */
  async voidTransaction(transactionId, reason) {
    try {
      const response = await apiClient.post(`/v1/giftcard/transaction/${transactionId}/void`, {
        reason,
      });
      return response.data;
    } catch (error) {
      console.error(`Error voiding transaction with ID ${transactionId}:`, error);
      throw error;
    }
  }

  /**
   * Get summary of transactions for a gift card
   * @param {String} giftCardId - The gift card ID
   * @returns {Promise} Promise resolving to transaction summary data
   */
  async getTransactionSummary(giftCardId) {
    try {
      const response = await apiClient.get(`/v1/giftcard/${giftCardId}/transaction-summary`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction summary for gift card ${giftCardId}:`, error);
      throw error;
    }
  }

  /**
   * Export transactions for a gift card (e.g., CSV, PDF)
   * @param {String} giftCardId - The gift card ID
   * @param {String} format - The export format (csv, pdf)
   * @returns {Promise} Promise resolving to the export data
   */
  async exportTransactions(giftCardId, format = 'csv') {
    try {
      const response = await apiClient.get(`/v1/giftcard/${giftCardId}/export-transactions`, {
        params: { format },
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      console.error(`Error exporting transactions for gift card ${giftCardId}:`, error);
      throw error;
    }
  }
}

export default new GiftCardTransactionService();
