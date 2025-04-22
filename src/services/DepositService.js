import apiClient from './ApiConfig';

class DepositService {
  /**
   * Get all deposit receipts with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise<Object>} - Promise with deposit receipts and pagination info
   */
  getAllDepositReceipts(pageable = { page: 0, size: 10 }) {
    return apiClient.get(`/depositreceipt?page=${pageable.page}&size=${pageable.size}`);
  }

  /**
   * Get a specific deposit receipt by ID
   * @param {string} id - Deposit receipt ID
   * @returns {Promise<Object>} - Promise with deposit receipt data
   */
  getDepositReceiptById(id) {
    return apiClient.get(`/depositreceipt/${id}`);
  }

  /**
   * Get deposit receipt positions by product ID
   * @param {string} productId - Product ID
   * @returns {Promise<Array>} - Promise with positions for the product
   */
  getDepositReceiptsByProductId(productId) {
    return apiClient.get(`/depositreceipt/positions/${productId}`);
  }

  /**
   * Create a new deposit receipt
   * @param {Object} depositReceiptData - Deposit receipt data
   * @returns {Promise<Object>} - Promise with created receipt
   */
  createDepositReceipt(depositReceiptData) {
    return apiClient.post('/depositreceipt', depositReceiptData);
  }

  /**
   * Delete a deposit receipt
   * @param {string} id - Deposit receipt ID to delete
   * @returns {Promise<void>} - Promise that resolves when deleted
   */
  deleteDepositReceipt(id) {
    return apiClient.delete(`/depositreceipt/${id}`);
  }
}

export default new DepositService();
