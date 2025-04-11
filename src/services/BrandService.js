import apiClient from './ApiConfig';

/**
 * Service for managing brand data
 */
class BrandService {
  /**
   * Get all brands with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated brand data
   */
  async getBrands(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/brand', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching brands:', error);
      throw error;
    }
  }

  /**
   * Get a specific brand by ID
   * @param {String} id - The brand ID
   * @returns {Promise} Promise resolving to brand data
   */
  async getBrandById(id) {
    try {
      const response = await apiClient.get(`/v1/brand/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching brand with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new brand
   * @param {Object} brandData - The brand data to create
   * @returns {Promise} Promise resolving to the created brand
   */
  async createBrand(brandData) {
    try {
      const response = await apiClient.post('/v1/brand', brandData);
      return response.data;
    } catch (error) {
      console.error('Error creating brand:', error);
      throw error;
    }
  }

  /**
   * Update an existing brand
   * @param {String} id - The brand ID to update
   * @param {Object} brandData - The updated brand data
   * @returns {Promise} Promise resolving to the updated brand
   */
  async updateBrand(id, brandData) {
    try {
      const response = await apiClient.put(`/v1/brand/${id}`, brandData);
      return response.data;
    } catch (error) {
      console.error(`Error updating brand with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a brand
   * @param {String} id - The brand ID to delete
   * @returns {Promise} Promise resolving when brand is deleted
   */
  async deleteBrand(id) {
    try {
      await apiClient.delete(`/v1/brand/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting brand with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new BrandService();
