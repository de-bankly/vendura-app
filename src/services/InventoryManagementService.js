import apiClient from './ApiConfig';

/**
 * Service for inventory management operations
 */
class InventoryManagementService {
  /**
   * Get inventory status summary for dashboard
   * @returns {Promise} Promise resolving to inventory status data
   */
  async getInventoryStatus() {
    try {
      const response = await apiClient.get('/v1/inventory/status');
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory status:', error);
      // Return fallback data structure in case of error
      return {
        total: 0,
        lowStock: 0,
        outOfStock: 0,
      };
    }
  }

  /**
   * Get products with low stock
   * @returns {Promise} Promise resolving to low stock products data
   */
  async getLowStockProducts() {
    try {
      const response = await apiClient.get('/v1/inventory/low-stock');
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      throw error;
    }
  }

  /**
   * Adjust stock level for a product
   * @param {String} productId - Product ID
   * @param {Number} quantity - Quantity to adjust (positive or negative)
   * @param {String} reason - Reason for adjustment
   * @returns {Promise} Promise resolving to adjustment result
   */
  async adjustStock(productId, quantity, reason) {
    try {
      const params = { quantity };
      if (reason) params.reason = reason;

      const response = await apiClient.post(`/v1/inventory/${productId}/adjust`, null, { params });
      return response.data;
    } catch (error) {
      console.error(`Error adjusting stock for product ${productId}:`, error);
      throw error;
    }
  }

  /**
   * Trigger automatic reordering check
   * @returns {Promise}
   */
  async triggerReorderCheck() {
    try {
      const response = await apiClient.post('/v1/inventory/reorder-check');
      return response.data;
    } catch (error) {
      console.error('Error triggering reorder check:', error);
      throw error;
    }
  }

  /**
   * Get pending supplier orders
   * @returns {Promise} Promise resolving to pending orders
   */
  async getPendingSupplierOrders() {
    try {
      const response = await apiClient.get('/v1/supplierorder/pending');
      return response.data;
    } catch (error) {
      console.error('Error fetching pending supplier orders:', error);
      throw error;
    }
  }

  /**
   * Get supplier orders by status
   * @param {String} status - Order status (PLACED, SHIPPED, DELIVERED, CANCELLED)
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to supplier orders
   */
  async getSupplierOrdersByStatus(status, pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get(`/v1/supplierorder/status/${status}`, {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier orders with status ${status}:`, error);
      throw error;
    }
  }

  /**
   * Get automatic supplier orders
   * @param {Boolean} isAutomatic - Whether to get automatic or manual orders
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to supplier orders
   */
  async getAutomaticSupplierOrders(isAutomatic, pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get(`/v1/supplierorder/automatic/${isAutomatic}`, {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching ${isAutomatic ? 'automatic' : 'manual'} supplier orders:`,
        error
      );
      throw error;
    }
  }
}

export default new InventoryManagementService();
