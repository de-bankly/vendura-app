import apiClient from './ApiConfig';

/**
 * Service for managing suppliers
 */
class SupplierService {
  /**
   * Get all suppliers with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated supplier data
   */
  async getSuppliers(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/supplier', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      throw error;
    }
  }

  /**
   * Get a specific supplier by ID
   * @param {String} id - The supplier ID
   * @returns {Promise} Promise resolving to supplier data
   */
  async getSupplierById(id) {
    try {
      const response = await apiClient.get(`/v1/supplier/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching supplier with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new supplier
   * @param {Object} supplierData - The supplier data to create
   * @returns {Promise} Promise resolving to the created supplier
   */
  async createSupplier(supplierData) {
    try {
      const response = await apiClient.post('/v1/supplier', supplierData);
      return response.data;
    } catch (error) {
      console.error('Error creating supplier:', error);
      throw error;
    }
  }

  /**
   * Update an existing supplier
   * @param {String} id - The supplier ID to update
   * @param {Object} supplierData - The updated supplier data
   * @returns {Promise} Promise resolving to the updated supplier
   */
  async updateSupplier(id, supplierData) {
    try {
      const response = await apiClient.put(`/v1/supplier/${id}`, supplierData);
      return response.data;
    } catch (error) {
      console.error(`Error updating supplier with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a supplier
   * @param {String} id - The supplier ID to delete
   * @returns {Promise} Promise resolving when supplier is deleted
   */
  async deleteSupplier(id) {
    try {
      await apiClient.delete(`/v1/supplier/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting supplier with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new SupplierService();
