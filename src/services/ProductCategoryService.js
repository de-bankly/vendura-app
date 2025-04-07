import apiClient from './ApiConfig';

/**
 * Service for managing product categories
 */
class ProductCategoryService {
  /**
   * Get all product categories with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated product category data
   */
  async getProductCategories(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/productcategory', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching product categories:', error);
      throw error;
    }
  }

  /**
   * Get a specific product category by ID
   * @param {String} id - The product category ID
   * @returns {Promise} Promise resolving to product category data
   */
  async getProductCategoryById(id) {
    try {
      const response = await apiClient.get(`/v1/productcategory/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new product category
   * @param {Object} categoryData - The product category data to create
   * @returns {Promise} Promise resolving to the created product category
   */
  async createProductCategory(categoryData) {
    try {
      const response = await apiClient.post('/v1/productcategory', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating product category:', error);
      throw error;
    }
  }

  /**
   * Update an existing product category
   * @param {String} id - The product category ID to update
   * @param {Object} categoryData - The updated product category data
   * @returns {Promise} Promise resolving to the updated product category
   */
  async updateProductCategory(id, categoryData) {
    try {
      const response = await apiClient.put(`/v1/productcategory/${id}`, categoryData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product category with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product category
   * @param {String} id - The product category ID to delete
   * @returns {Promise} Promise resolving when product category is deleted
   */
  async deleteProductCategory(id) {
    try {
      await apiClient.delete(`/v1/productcategory/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product category with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new ProductCategoryService();
