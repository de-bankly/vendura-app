import apiClient from './ApiConfig';

/**
 * Service for managing product data
 */
class ProductService {
  /**
   * Get all products with pagination
   * @param {Object} pageable - Pagination parameters
   * @param {Boolean} calculateStock - Whether to calculate current stock
   * @returns {Promise} Promise resolving to paginated product data
   */
  async getProducts(pageable = { page: 0, size: 10 }, calculateStock = true) {
    try {
      const response = await apiClient.get('/v1/product', {
        params: {
          ...pageable,
          calculateStock,
        },
      });

      // Transform the data to match the frontend format
      if (response.data && response.data.content) {
        response.data.content = response.data.content.map(product =>
          this.transformProductData(product)
        );
      }

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
      return this.transformProductData(response.data);
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
      return this.transformProductData(response.data);
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
      return this.transformProductData(response.data);
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
   * Transform backend product data to frontend format
   * @param {Object} product - The product data from backend
   * @returns {Object} Transformed product data
   */
  transformProductData = product => {
    if (!product) return null;

    // Get the latest price from priceHistories if available
    let price = 0;
    let stockQuantity = product.currentStock || 0;

    if (product.priceHistories && product.priceHistories.length > 0) {
      // Sort by timestamp descending to get latest price
      const sortedPrices = [...product.priceHistories].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      price = sortedPrices[0].price;
    }

    return {
      id: product.id,
      name: product.name,
      description: '', // Backend doesn't seem to have description
      price: price,
      stockQuantity: stockQuantity,
      lowStockThreshold: 5, // Default value
      category: product.productCategory
        ? {
            id: product.productCategory.id,
            name: product.productCategory.name,
          }
        : null,
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
          }
        : null,
      supplier: product.defaultSupplier
        ? {
            id: product.defaultSupplier.id,
            name: product.defaultSupplier.name,
          }
        : null,
      sku: product.id, // Using ID as SKU since backend doesn't have separate SKU field
    };
  };

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
