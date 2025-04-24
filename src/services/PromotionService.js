import { getUserFriendlyErrorMessage } from '../utils/errorUtils';
import apiClient from './ApiConfig';

/**
 * Service for managing product promotions and discounts
 */
class PromotionService {
  /**
   * Get all promotions with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated promotion data
   */
  async getPromotions(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/promotion', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching promotions:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch promotions'));
    }
  }

  /**
   * Get a specific promotion by ID
   * @param {String} id - Promotion ID
   * @returns {Promise} Promise resolving to promotion data
   */
  async getPromotionById(id) {
    try {
      const response = await apiClient.get(`/v1/promotion/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching promotion ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to fetch promotion details'));
    }
  }

  /**
   * Create a new promotion
   * @param {Object} promotionData - Promotion data
   * @returns {Promise} Promise resolving to created promotion data
   */
  async createPromotion(promotionData) {
    try {
      const response = await apiClient.post('/v1/promotion', promotionData);
      return response.data;
    } catch (error) {
      console.error('Error creating promotion:', error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to create promotion'));
    }
  }

  /**
   * Update an existing promotion
   * @param {String} id - Promotion ID
   * @param {Object} promotionData - Updated promotion data
   * @returns {Promise} Promise resolving to updated promotion data
   */
  async updatePromotion(id, promotionData) {
    try {
      const response = await apiClient.put(`/v1/promotion/${id}`, promotionData);
      return response.data;
    } catch (error) {
      console.error(`Error updating promotion ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to update promotion'));
    }
  }

  /**
   * Delete a promotion
   * @param {String} id - Promotion ID to delete
   * @returns {Promise} Promise resolving when promotion is deleted
   */
  async deletePromotion(id) {
    try {
      await apiClient.delete(`/v1/promotion/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting promotion ${id}:`, error.response || error.message);
      throw new Error(getUserFriendlyErrorMessage(error, 'Failed to delete promotion'));
    }
  }

  /**
   * Find active promotions for a product
   * @param {String} productId - Product ID to find promotions for
   * @returns {Promise} Promise resolving to array of active promotions for the product
   */
  async getActivePromotionsForProduct(productId) {
    try {
      // We use the general promotion endpoint with filtering
      const response = await apiClient.get('/v1/promotion', {
        params: {
          productId,
          active: true,
        },
      });
      return response.data?.content || [];
    } catch (error) {
      console.error(
        `Error fetching promotions for product ${productId}:`,
        error.response || error.message
      );
      return []; // Return empty array on error rather than throwing
    }
  }

  /**
   * Calculate the discount amount for a product based on the price
   * @param {Object} product - Product data with price
   * @param {Object} promotion - Promotion data with discount
   * @returns {Object} Discount information
   */
  calculateDiscount(product, promotion) {
    if (!product || !promotion || !promotion.discount) {
      return {
        hasDiscount: false,
        originalPrice: product?.price || 0,
        discountAmount: 0,
        discountedPrice: product?.price || 0,
        discountPercentage: 0,
      };
    }

    const originalPrice = parseFloat(product.price) || 0;
    // Ensure originalPrice is not zero to avoid division by zero
    if (originalPrice <= 0) {
      return {
        hasDiscount: false,
        originalPrice: 0,
        discountAmount: 0,
        discountedPrice: 0,
        discountPercentage: 0,
      };
    }

    // Get the raw discount amount
    let discountAmount = parseFloat(promotion.discount) || 0;

    // Limit discount to a maximum of 50% of the original price
    const maxDiscount = originalPrice * 0.5;
    if (discountAmount > maxDiscount) {
      discountAmount = maxDiscount;
    }

    // Ensure discount is not negative and doesn't exceed product price
    discountAmount = Math.min(Math.max(0, discountAmount), originalPrice);

    const discountedPrice = Math.max(0, originalPrice - discountAmount);
    const discountPercentage = Math.round((discountAmount / originalPrice) * 100);

    return {
      hasDiscount: discountAmount > 0,
      originalPrice,
      discountAmount,
      discountedPrice,
      discountPercentage,
    };
  }
}

export default new PromotionService();
