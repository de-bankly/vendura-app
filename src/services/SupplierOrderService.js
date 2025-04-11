import apiClient from './ApiConfig';

/**
 * Service for managing supplier orders
 */
class SupplierOrderService {
  /**
   * Get all supplier orders with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated supplier order data
   */
  async getSupplierOrders(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/supplierorder', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching supplier orders:', error);
      throw error;
    }
  }

  /**
   * Get a specific supplier order by ID
   * @param {String} id - The supplier order ID
   * @returns {Promise} Promise resolving to supplier order data
   */
  async getSupplierOrderById(id) {
    try {
      const response = await apiClient.get(`/v1/supplierorder/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier order with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new supplier order
   * @param {Object} orderData - The supplier order data to create
   * @returns {Promise} Promise resolving to the created supplier order
   */
  async createSupplierOrder(orderData) {
    try {
      const response = await apiClient.post('/v1/supplierorder', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier order:', error);
      throw error;
    }
  }

  /**
   * Update a supplier order
   * @param {String} id - The supplier order ID
   * @param {Object} orderData - The updated supplier order data
   * @returns {Promise} Promise resolving to the updated supplier order
   */
  async updateSupplierOrder(id, orderData) {
    try {
      const response = await apiClient.put(`/v1/supplierorder/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier order with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a supplier order
   * @param {String} id - The supplier order ID to delete
   * @returns {Promise} Promise resolving when the supplier order is deleted
   */
  async deleteSupplierOrder(id) {
    try {
      const response = await apiClient.delete(`/v1/supplierorder/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting supplier order with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a supplier order's status
   * @param {String} id - The supplier order ID
   * @param {String} status - The new status (PLACED, SHIPPED, DELIVERED, CANCELLED)
   * @returns {Promise} Promise resolving to the updated supplier order
   */
  async updateSupplierOrderStatus(id, status) {
    try {
      const orderData = { orderStatus: status };
      const response = await apiClient.put(`/v1/supplierorder/${id}`, orderData);
      return response.data;
    } catch (error) {
      console.error(`Error updating status for supplier order with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get supplier orders by supplier ID
   * @param {String} supplierId - The supplier ID
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to supplier orders
   */
  async getSupplierOrdersBySupplierId(supplierId, pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get(`/v1/supplierorder/supplier/${supplierId}`, {
        params: pageable,
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier orders for supplier ${supplierId}:`, error);
      throw error;
    }
  }
}

export default new SupplierOrderService();
