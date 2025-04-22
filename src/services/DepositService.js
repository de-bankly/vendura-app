import apiClient from './ApiConfig';
import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

class DepositService {
  /**
   * Get all deposit receipts with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise<Object>} - Promise with deposit receipts and pagination info
   */
  async getAllDepositReceipts(pageable = { page: 0, size: 10 }) {
    try {
      return await apiClient.get(`/v1/depositreceipt?page=${pageable.page}&size=${pageable.size}`);
    } catch (error) {
      console.error('Error fetching deposit receipts:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch deposit receipts'));
    }
  }

  /**
   * Get a specific deposit receipt by ID
   * @param {string} id - Deposit receipt ID
   * @returns {Promise<Object>} - Promise with deposit receipt data
   */
  async getDepositReceiptById(id) {
    try {
      return await apiClient.get(`/v1/depositreceipt/${id}`);
    } catch (error) {
      console.error('Error fetching deposit receipt:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch deposit receipt'));
    }
  }

  /**
   * Get deposit receipt positions by product ID
   * This endpoint returns the deposit items connected to a specific product
   * @param {string} productId - Product ID
   * @returns {Promise<Array>} - Promise with positions for the product
   */
  async getDepositReceiptsByProductId(productId) {
    try {
      return await apiClient.get(`/v1/depositreceipt/positions/${productId}`);
    } catch (error) {
      console.error('Error fetching deposit positions:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch deposit positions'));
    }
  }

  /**
   * Create a new deposit receipt
   * @param {Object} depositReceiptData - Deposit receipt data
   * @returns {Promise<Object>} - Promise with created receipt
   */
  async createDepositReceipt(depositReceiptData) {
    try {
      return await apiClient.post('/v1/depositreceipt', depositReceiptData);
    } catch (error) {
      console.error('Error creating deposit receipt:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to create deposit receipt'));
    }
  }

  /**
   * Delete a deposit receipt
   * @param {string} id - Deposit receipt ID to delete
   * @returns {Promise<void>} - Promise that resolves when deleted
   */
  async deleteDepositReceipt(id) {
    try {
      return await apiClient.delete(`/v1/depositreceipt/${id}`);
    } catch (error) {
      console.error('Error deleting deposit receipt:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to delete deposit receipt'));
    }
  }
}

export default new DepositService();
