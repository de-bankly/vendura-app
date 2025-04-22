import apiClient from './ApiConfig';

/**
 * Service for managing gift cards
 */
class GiftCardService {
  /**
   * Get all gift cards with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated gift card data
   */
  async getGiftCards(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/giftcard', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching gift cards:', error);
      throw error;
    }
  }

  /**
   * Get a specific gift card by ID
   * @param {String} id - The gift card ID
   * @returns {Promise} Promise resolving to gift card data
   */
  async getGiftCardById(id) {
    try {
      const response = await apiClient.get(`/v1/giftcard/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching gift card with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get gift card transactional information
   * @param {String} id - The gift card ID
   * @returns {Promise} Promise resolving to gift card transactional information
   */
  async getTransactionalInformation(id) {
    try {
      const response = await apiClient.get(`/v1/giftcard/${id}/transactional`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactional information for gift card with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new gift card
   * @param {Object} giftCardData - The gift card data to create
   * @returns {Promise} Promise resolving to the created gift card
   */
  async createGiftCard(giftCardData) {
    try {
      // Ensure type is always set
      if (!giftCardData.type) {
        giftCardData.type = 'GIFT_CARD'; // Default to GIFT_CARD type if not specified
      }

      // Validate required fields based on type
      if (giftCardData.type === 'GIFT_CARD' && !giftCardData.initialBalance) {
        throw new Error('Initial balance is required for gift cards');
      }

      if (
        giftCardData.type === 'DISCOUNT_CARD' &&
        (!giftCardData.discountPercentage || !giftCardData.maximumUsages)
      ) {
        throw new Error('Discount percentage and maximum usages are required for discount cards');
      }

      const response = await apiClient.post('/v1/giftcard', giftCardData);
      return response.data;
    } catch (error) {
      console.error('Error creating gift card:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      throw error;
    }
  }

  /**
   * Update an existing gift card
   * @param {String} id - The gift card ID to update
   * @param {Object} giftCardData - The updated gift card data
   * @returns {Promise} Promise resolving to the updated gift card
   */
  async updateGiftCard(id, giftCardData) {
    try {
      // Validate data based on type
      if (
        giftCardData.type === 'DISCOUNT_CARD' &&
        (!giftCardData.discountPercentage || !giftCardData.maximumUsages)
      ) {
        throw new Error('Discount percentage and maximum usages are required for discount cards');
      }

      const response = await apiClient.put(`/v1/giftcard/${id}`, giftCardData);
      return response.data;
    } catch (error) {
      console.error(`Error updating gift card with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a gift card
   * @param {String} id - The gift card ID to delete
   * @returns {Promise} Promise resolving to the deleted gift card
   */
  async deleteGiftCard(id) {
    try {
      const response = await apiClient.delete(`/v1/giftcard/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting gift card with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Calculate remaining balance for a gift card
   * @param {String} id - The gift card ID
   * @returns {Promise} Promise resolving to the remaining balance
   */
  async calculateRemainingBalance(id) {
    try {
      const transactionalInfo = await this.getTransactionalInformation(id);
      return transactionalInfo.remainingBalance || 0;
    } catch (error) {
      console.error(`Error calculating remaining balance for gift card with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Check remaining usages for a discount card
   * @param {String} id - The discount card ID
   * @returns {Promise} Promise resolving to the remaining usages
   */
  async getRemainingUsages(id) {
    try {
      const transactionalInfo = await this.getTransactionalInformation(id);
      return transactionalInfo.remainingUsages || 0;
    } catch (error) {
      console.error(`Error getting remaining usages for discount card with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Apply gift card payment (client-side calculation)
   * This is a local utility method that doesn't perform actual backend transaction
   * The actual transaction would happen during checkout
   * @param {String} id - The gift card ID
   * @param {Number} amount - The amount to apply
   * @param {Number} currentTotal - Current cart total
   * @returns {Object} Payment information with updated total
   */
  applyGiftCardPayment(id, amount, currentTotal) {
    return {
      giftcardId: id,
      amount,
      remainingTotal: currentTotal - amount,
    };
  }

  /**
   * Apply discount card (client-side calculation)
   * This is a local utility method that doesn't perform actual backend transaction
   * The actual transaction would happen during checkout
   * @param {String} id - The discount card ID
   * @param {Number} discountPercentage - The discount percentage
   * @param {Number} currentTotal - The current total
   * @returns {Object} Discount information with updated total
   */
  applyDiscountCard(id, discountPercentage, currentTotal) {
    const discountAmount = currentTotal * (discountPercentage / 100);
    return {
      giftcardId: id,
      discountPercentage,
      discountAmount,
      remainingTotal: currentTotal - discountAmount,
    };
  }

  /**
   * Validate gift card format
   * @param {String} id - The gift card ID to validate
   * @returns {Boolean} Whether the gift card ID is in a valid format
   */
  validateGiftCardFormat(id) {
    // Gift card IDs are numeric values of 16-19 digits as per backend implementation
    const giftCardRegex = /^\d{16,19}$/;
    return giftCardRegex.test(id);
  }
}

export default new GiftCardService();
