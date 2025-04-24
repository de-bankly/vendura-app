import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

import apiClient from './ApiConfig';
import PromotionService from './PromotionService';

/**
 * Service for managing product data
 */
class ProductService {
  /**
   * Get all products with pagination
   * @param {Object} pageable - Pagination parameters
   * @param {number} pageable.page - The page number (0-indexed)
   * @param {number} pageable.size - The number of items per page
   * @param {boolean} [calculateStock=true] - Whether to calculate current stock
   * @param {boolean} [includeDiscounts=true] - Whether to include discount information
   * @returns {Promise<Object>} Promise resolving to paginated product data
   */
  async getProducts(
    pageable = { page: 0, size: 10 },
    calculateStock = true,
    includeDiscounts = true
  ) {
    try {
      const response = await apiClient.get('/v1/product', {
        params: {
          ...pageable,
          calculateStock,
        },
      });

      if (response.data && response.data.content) {
        const transformedProducts = response.data.content.map(product =>
          this.transformProductData(product)
        );

        if (includeDiscounts) {
          const promotionsResponse = await PromotionService.getPromotions({
            page: 0,
            size: 1000,
          });
          const promotions = promotionsResponse.content || [];
          const activePromotions = promotions.filter(promo => promo.active);

          response.data.content = await Promise.all(
            transformedProducts.map(async product => {
              const productPromotion = activePromotions.find(p => p.productId === product.id);

              if (productPromotion) {
                const discountInfo = PromotionService.calculateDiscount(product, productPromotion);
                return {
                  ...product,
                  hasDiscount: discountInfo.hasDiscount,
                  originalPrice: discountInfo.originalPrice,
                  discountAmount: discountInfo.discountAmount,
                  discountedPrice: discountInfo.discountedPrice,
                  discountPercentage: discountInfo.discountPercentage,
                  promotion: productPromotion,
                };
              }
              return product;
            })
          );
        } else {
          response.data.content = transformedProducts;
        }
      }

      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch products'));
    }
  }

  /**
   * Get a specific product by ID
   * @param {string} id - The product ID
   * @param {boolean} [calculateStock=false] - Whether to calculate current stock
   * @param {boolean} [includeDiscounts=true] - Whether to include discount information
   * @returns {Promise<Object>} Promise resolving to product data
   */
  async getProductById(id, calculateStock = false, includeDiscounts = true) {
    try {
      const response = await apiClient.get(`/v1/product/${id}`, {
        params: { calculateStock },
      });

      const transformedProduct = this.transformProductData(response.data);

      if (includeDiscounts) {
        try {
          const promotions = await PromotionService.getActivePromotionsForProduct(id);
          if (promotions && promotions.length > 0) {
            const highestPromotion = promotions.reduce(
              (max, p) => (p.discount > max.discount ? p : max),
              promotions[0]
            );

            if (this.isValidPromotion(highestPromotion, transformedProduct)) {
              const discountInfo = PromotionService.calculateDiscount(
                transformedProduct,
                highestPromotion
              );

              if (this.isReasonableDiscount(discountInfo)) {
                return {
                  ...transformedProduct,
                  hasDiscount: discountInfo.hasDiscount,
                  originalPrice: discountInfo.originalPrice,
                  discountAmount: discountInfo.discountAmount,
                  discountedPrice: discountInfo.discountedPrice,
                  discountPercentage: discountInfo.discountPercentage,
                  promotion: highestPromotion,
                };
              }
            }
          }
        } catch (promotionError) {
          console.error('Error fetching promotions for product:', promotionError);
        }
      }

      return transformedProduct;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch product details'));
    }
  }

  /**
   * Create a new product
   * @param {Object} productData - The product data to create
   * @returns {Promise<Object>} Promise resolving to the created product
   */
  async createProduct(productData) {
    try {
      const dataToSend = { ...productData };

      if (
        dataToSend.price &&
        (!dataToSend.priceHistories || dataToSend.priceHistories.length === 0)
      ) {
        dataToSend.priceHistories = [
          {
            timestamp: new Date(),
            price: dataToSend.price,
            purchasePrice: dataToSend.price * 0.7,
            supplier: dataToSend.supplier,
          },
        ];
      }

      if (dataToSend.connectedProducts && dataToSend.connectedProducts.length > 0) {
        dataToSend.standalone = false;
      } else {
        dataToSend.standalone = dataToSend.standalone ?? true;
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
   * @param {string} id - The product ID to update
   * @param {Object} productData - The updated product data
   * @returns {Promise<Object>} Promise resolving to the updated product
   */
  async updateProduct(id, productData) {
    try {
      const dataToSend = {
        productCategory: productData.productCategory || productData.category,
        brand: productData.brand,
        defaultSupplier: productData.defaultSupplier || productData.supplier,
        priceHistories: productData.priceHistories,
        standalone: productData.standalone,
        connectedProducts: productData.connectedProducts,
      };

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
   * @param {string} id - The product ID to delete
   * @returns {Promise<boolean>} Promise resolving to true when product is deleted
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
   * Get products grouped by category
   * @param {Object} [pageable={ page: 0, size: 100 }] - Pagination parameters
   * @param {number} pageable.page - The page number (0-indexed)
   * @param {number} pageable.size - The number of items per page
   * @param {boolean} [includeDiscounts=true] - Whether to include discount information
   * @returns {Promise<Object>} Promise resolving to products grouped by category
   */
  async getProductsByCategory(pageable = { page: 0, size: 100 }, includeDiscounts = true) {
    try {
      const response = await this.getProducts(pageable, true, includeDiscounts);
      const products = response.content || [];
      return this.groupByCategory(products);
    } catch (error) {
      console.error('Error fetching products by category:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch products by category'));
    }
  }

  /**
   * Get deposit products (non-standalone products, often used for Pfand)
   * @param {Object} [pageable={ page: 0, size: 50 }] - Pagination parameters
   * @param {number} pageable.page - The page number (0-indexed)
   * @param {number} pageable.size - The number of items per page
   * @param {boolean} [includeDiscounts=true] - Whether to include discount information
   * @returns {Promise<Array<Object>>} Promise resolving to an array of deposit products
   */
  async getDepositProducts(pageable = { page: 0, size: 50 }, includeDiscounts = true) {
    try {
      const response = await this.getProducts(pageable, true, includeDiscounts);
      const products = response.content || [];

      const depositProducts = products
        .filter(product => product.standalone === false)
        .map(product => ({
          ...product,
          depositValue: product.price,
        }));

      return depositProducts;
    } catch (error) {
      console.error('Error fetching deposit products:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch deposit products'));
    }
  }

  /**
   * Get all products for selection lists (e.g., for connecting products).
   * Fetches minimal data (no stock, no discounts) for performance.
   * @param {Object} [pageable={ page: 0, size: 1000 }] - Pagination parameters
   * @param {number} pageable.page - The page number (0-indexed)
   * @param {number} pageable.size - The number of items per page
   * @returns {Promise<Array<Object>>} Promise resolving to products for selection
   */
  async getAllProductsForSelection(pageable = { page: 0, size: 1000 }) {
    try {
      const response = await this.getProducts(pageable, false, false);
      return response.content || [];
    } catch (error) {
      console.error('Error fetching products for selection:', error);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch products for selection'));
    }
  }

  /**
   * Get all deposit items connected to a specific product via deposit receipts.
   * Filters for items explicitly categorized as "Pfand".
   * @param {string} productId - ID of the product to get connected deposit items for
   * @returns {Promise<Array<Object>>} Promise resolving to connected deposit items in the "Pfand" category
   */
  async getConnectedDepositItems(productId) {
    try {
      if (!productId) {
        throw new Error('Product ID is required');
      }

      const response = await apiClient.get(`/v1/depositreceipt/positions/${productId}`);

      const pfandItems = (response.data || []).filter(
        item => item.product && item.product.category && item.product.category.name === 'Pfand'
      );

      return pfandItems;
    } catch (error) {
      console.error('Error fetching connected deposit items:', error.response || error.message);
      throw new Error(
        getUserFriendlyErrorMessage(error, 'Failed to fetch deposit items for product')
      );
    }
  }

  // --- Helper Methods ---

  /**
   * Validates if a promotion is reasonable for a product (e.g., discount <= 50%).
   * @param {Object} promotion - The promotion object
   * @param {Object} product - The product object
   * @returns {boolean} Whether the promotion is valid for the product
   */
  isValidPromotion(promotion, product) {
    if (!promotion || !product) return false;

    const productPrice = parseFloat(product.price) || 0;
    if (productPrice <= 0) return false;

    const discountAmount = parseFloat(promotion.discount) || 0;
    if (discountAmount <= 0) return false;

    const discountPercentage = (discountAmount / productPrice) * 100;
    return discountPercentage <= 50;
  }

  /**
   * Validates if a calculated discount result is reasonable (e.g., positive price, discount <= 50%).
   * @param {Object} discountInfo - The calculated discount information object
   * @param {number} discountInfo.originalPrice - The original price of the product
   * @param {number} discountInfo.discountAmount - The calculated discount amount
   * @param {number} discountInfo.discountPercentage - The calculated discount percentage
   * @returns {boolean} Whether the calculated discount is reasonable
   */
  isReasonableDiscount(discountInfo) {
    if (!discountInfo) return false;

    const { originalPrice, discountAmount, discountPercentage } = discountInfo;

    if (originalPrice <= 0) return false;
    if (discountAmount < 0) return false;
    if (discountPercentage > 50) return false;

    return true;
  }

  /**
   * Transform product data from backend format to frontend format.
   * Extracts latest price, calculates `toBeDiscontinued` flag, and formats related entities.
   * @param {Object} product - The product data from backend
   * @returns {Object | null} Transformed product data or null if input is invalid
   */
  transformProductData(product) {
    if (!product) return null;

    let price = 0;
    let stockQuantity = product.currentStock ?? 0;

    const latestPriceEntry = [...(product.priceHistories || [])].sort(
      (a, b) => new Date(b?.timestamp) - new Date(a?.timestamp)
    )[0];

    price = latestPriceEntry?.price ?? 0;

    let toBeDiscontinued = false;
    if (stockQuantity <= 5 && stockQuantity > 0) {
      if (latestPriceEntry?.timestamp) {
        const lastPriceChangeDate = new Date(latestPriceEntry.timestamp);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        toBeDiscontinued = lastPriceChangeDate < threeMonthsAgo;
      }
    }

    return {
      id: product.id,
      name: product.name,
      shortDescription: product.shortDescription || '',
      longDescription: product.longDescription || '',
      price: price,
      stockQuantity: product.currentStock,
      lowStockThreshold: 5,
      toBeDiscontinued: toBeDiscontinued,
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
            name: product.defaultSupplier.legalName,
          }
        : null,
      sku: product.id,
      standalone: product.standalone,
      connectedProducts: product.connectedProducts
        ? product.connectedProducts.map(connectedProduct =>
            this.transformProductData(connectedProduct)
          )
        : [],
    };
  }

  /**
   * Check if a product belongs to the Pfand category.
   * @param {Object} product - The product to check
   * @returns {boolean} True if the product is in the Pfand category, false otherwise
   */
  isPfandProduct(product) {
    return product?.category?.name === 'Pfand';
  }

  /**
   * Group products by category name. Excludes "Pfand" category products.
   * Sorts products within each category (out-of-stock/discontinued last, then alphabetically).
   * @param {Array<Object>} products - Array of product objects (frontend format)
   * @returns {Object} Object with category names as keys and arrays of sorted products as values
   */
  groupByCategory(products) {
    if (!Array.isArray(products)) return {};
    const grouped = {};
    products.forEach(product => {
      const categoryName = product?.category?.name || 'Uncategorized';

      if (this.isPfandProduct(product)) {
        return;
      }

      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    });

    Object.keys(grouped).forEach(category => {
      grouped[category].sort((a, b) => {
        const aOutOfStock = a.stockQuantity <= 0;
        const bOutOfStock = b.stockQuantity <= 0;
        if (aOutOfStock && !bOutOfStock) return 1;
        if (!aOutOfStock && bOutOfStock) return -1;

        if (a.toBeDiscontinued && !b.toBeDiscontinued) return 1;
        if (!a.toBeDiscontinued && b.toBeDiscontinued) return -1;

        const nameA = (a.name || '').toLowerCase();
        const nameB = (b.name || '').toLowerCase();
        return nameA.localeCompare(nameB, 'de');
      });
    });

    return grouped;
  }
}

export default new ProductService();
