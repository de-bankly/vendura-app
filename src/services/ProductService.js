import apiClient from './ApiConfig';

/**
 * Service for managing product data
 */
class ProductService {
  /**
   * Get all products with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated product data
   */
  async getProducts(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/product', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Get a specific product by ID
   * @param {String} id - The product ID
   * @param {Boolean} calculateStock - Whether to calculate current stock
   * @returns {Promise} Promise resolving to product data
   */
  async getProductById(id, calculateStock = false) {
    try {
      const response = await apiClient.get(`/v1/product/${id}`, {
        params: { calculateStock },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new product
   * @param {Object} productData - The product data to create
   * @returns {Promise} Promise resolving to the created product
   */
  async createProduct(productData) {
    try {
      const response = await apiClient.post('/v1/product', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   * @param {String} id - The product ID to update
   * @param {Object} productData - The updated product data
   * @returns {Promise} Promise resolving to the updated product
   */
  async updateProduct(id, productData) {
    try {
      const response = await apiClient.put(`/v1/product/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product
   * @param {String} id - The product ID to delete
   * @returns {Promise} Promise resolving when product is deleted
   */
  async deleteProduct(id) {
    try {
      await apiClient.delete(`/v1/product/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Group products by category
   * @param {Array} products - Array of product objects
   * @returns {Object} Object with categories as keys and arrays of products as values
   */
  groupByCategory(products) {
    const grouped = {};
    products.forEach(product => {
      // Default to 'Uncategorized' if category or category.name is undefined
      const categoryName = product?.category?.name || 'Uncategorized';

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });
    return grouped;
  }

  /**
   * Get products grouped by category
   * @returns {Promise} Promise resolving to products grouped by category
   */
  async getProductsByCategory(pageable = { page: 0, size: 100 }) {
    try {
      const response = await this.getProducts(pageable);
      const products = response.content;
      return this.groupByCategory(products);
    } catch (error) {
      console.error('Error fetching products by category:', error);
      throw error;
    }
  }
}

export default new ProductService();
