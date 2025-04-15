import { getUserFriendlyErrorMessage } from '../utils/errorUtils'; // Import error utility

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
      console.error('Error fetching products:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch products'));
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
      console.error(`Error fetching product with ID ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch product details'));
    }
  }

  /**
   * Create a new product
   * @param {Object} productData - The product data to create
   * @returns {Promise} Promise resolving to the created product
   */
  async createProduct(productData) {
    try {
      // Ensure product has a priceHistory entry for the current price
      const dataToSend = { ...productData };

      // If price is set but no priceHistories, create an initial price history
      if (
        dataToSend.price &&
        (!dataToSend.priceHistories || dataToSend.priceHistories.length === 0)
      ) {
        dataToSend.priceHistories = [
          {
            timestamp: new Date(),
            price: dataToSend.price,
            purchasePrice: dataToSend.price * 0.7, // Default purchase price if not specified
            supplier: dataToSend.supplier, // Use the selected supplier
          },
        ];
      }

      const response = await apiClient.post('/v1/product', dataToSend);
      return this.transformProductData(response.data);
    } catch (error) {
      console.error('Error creating product:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to create product'));
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
      // Create a properly formatted data object for the backend
      const dataToSend = {
        id: id,
        name: productData.name,
        productCategory: productData.productCategory || productData.category,
        brand: productData.brand,
        defaultSupplier: productData.defaultSupplier || productData.supplier,
        // Only add new price history if the price has changed
        priceHistories: productData.priceHistories,
      };

      // Remove any undefined or null values
      Object.keys(dataToSend).forEach(key => {
        if (dataToSend[key] === undefined || dataToSend[key] === null) {
          delete dataToSend[key];
        }
      });

      const response = await apiClient.put(`/v1/product/${id}`, dataToSend);
      return this.transformProductData(response.data);
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to update product'));
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
      console.error(`Error deleting product with ID ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to delete product'));
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
    let stockQuantity = product.currentStock ?? 0; // Use nullish coalescing

    // Use optional chaining and nullish coalescing for safer access
    const latestPriceEntry = [...(product.priceHistories || [])].sort(
      (a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
    )[0];

    price = latestPriceEntry?.price ?? 0;

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
    if (!Array.isArray(products)) return {}; // Handle non-array input
    const grouped = {};
    products.forEach(product => {
      // Ensure product and category exist before accessing name
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
      const products = response.content || []; // Ensure products is an array
      return this.groupByCategory(products);
    } catch (error) {
      console.error('Error fetching products by category:', error.response || error.message);
      // Reuse getProducts error message or create specific one
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch products by category'));
    }
  }
}

export default new ProductService();
