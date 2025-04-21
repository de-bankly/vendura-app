import apiClient from './ApiConfig';

/**
 * Service for managing sales
 */
class SaleService {
  /**
   * Create a new sale
   * @param {Object} saleData - Data for the new sale
   * @returns {Promise} Promise resolving to the created sale
   */
  async createSale(saleData) {
    try {
      // Map cart items to positions
      const positions = saleData.items.map(item => ({
        productDTO: {
          id: item.id,
          name: item.name,
          price: parseFloat((Math.round(item.price * 100) / 100).toFixed(2)),
        },
        quantity: item.quantity,
        discountEuro: 0, // Let the backend apply promotions
      }));

      // Prepare payments with the correct calculated total
      const payments = [];

      // Add gift card payments if applicable
      if (saleData.giftCards && saleData.giftCards.length > 0) {
        saleData.giftCards.forEach(card => {
          payments.push({
            type: 'GIFTCARD',
            amount: parseFloat((Math.round((card.amount || 0) * 100) / 100).toFixed(2)),
            giftcardId: card.id,
          });
        });
      }

      // Add discount card payments if applicable
      if (saleData.discountCards && saleData.discountCards.length > 0) {
        // Just use the first discount card for simplicity (as per existing business logic)
        const discountCard = saleData.discountCards[0];
        const discountAmount = parseFloat(
          (Math.round(saleData.voucherDiscount * 100) / 100).toFixed(2)
        );

        payments.push({
          type: 'GIFTCARD', // The backend treats discount cards as a type of gift card payment
          amount: discountAmount,
          giftcardId: discountCard.id,
        });
      }

      // We need to calculate the actual amount the customer pays without deducting the giftcard amounts
      const finalTotal = parseFloat((Math.round(saleData.total * 100) / 100).toFixed(2));

      if (saleData.paymentMethod === 'cash') {
        payments.push({
          type: 'CASH',
          // Use the final total that the customer actually pays
          amount: finalTotal,
          handed: parseFloat((Math.round(saleData.cashReceived * 100) / 100).toFixed(2)),
          returned: parseFloat((Math.round((saleData.change || 0) * 100) / 100).toFixed(2)),
        });
      } else if (saleData.paymentMethod === 'card') {
        payments.push({
          type: 'CARD',
          // Use the final total that the customer actually pays
          amount: finalTotal,
          cardDetails: {
            cardNumber: saleData.cardDetails?.cardNumber,
            cardHolderName: saleData.cardDetails?.cardHolderName,
            expirationDate: saleData.cardDetails?.expirationDate,
            cvv: saleData.cardDetails?.cvv,
          },
        });
      }

      // Create final sale DTO with correct total
      const saleDTO = {
        positions,
        payments,
        total: saleData.subtotal, // Use the subtotal (before discounts) instead of final total
        depositReceipts: [],
      };

      const response = await apiClient.post('/v1/sale', saleDTO);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  /**
   * Get all sales with pagination
   * @param {Object} pageable - Pagination parameters
   * @returns {Promise} Promise resolving to paginated sale data
   */
  async getSales(pageable = { page: 0, size: 10 }) {
    try {
      const response = await apiClient.get('/v1/sale', { params: pageable });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      throw error;
    }
  }

  /**
   * Get a specific sale by ID
   * @param {String} id - The sale ID
   * @returns {Promise} Promise resolving to sale data
   */
  async getSaleById(id) {
    try {
      const response = await apiClient.get(`/v1/sale/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sale with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Calculate totals for a sale
   * @param {Array} items - Sale items
   * @param {Array} vouchers - Applied vouchers
   * @returns {Object} Calculated totals
   */
  calculateTotals(items, vouchers = []) {
    // Calculate subtotal from items
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate discount from vouchers
    let discountAmount = 0;
    let giftCardPayment = 0;

    if (vouchers && vouchers.length > 0) {
      // Process discount cards
      const discountVouchers = vouchers.filter(v => v.type === 'DISCOUNT_CARD');
      if (discountVouchers.length > 0) {
        // Just use the first discount card for simplicity
        const discountCard = discountVouchers[0];
        discountAmount = subtotal * (discountCard.discountPercentage / 100);
      }

      // Process gift cards
      const giftCardVouchers = vouchers.filter(v => v.type === 'GIFT_CARD');
      giftCardPayment = giftCardVouchers.reduce((sum, card) => sum + (card.amount || 0), 0);
    }

    // Calculate final total
    const total = Math.max(0, subtotal - discountAmount - giftCardPayment);

    return {
      subtotal,
      discountAmount,
      giftCardPayment,
      total,
    };
  }

  /**
   * Void a sale
   * @param {String} id - The sale ID
   * @param {String} reason - Reason for voiding
   * @returns {Promise} Promise resolving to the voided sale
   */
  async voidSale(id, reason) {
    try {
      const response = await apiClient.post(`/v1/sale/${id}/void`, { reason });
      return response.data;
    } catch (error) {
      console.error(`Error voiding sale with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get sales report for a date range
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Promise} Promise resolving to sales report data
   */
  async getSalesReport(startDate, endDate) {
    try {
      const response = await apiClient.get('/v1/sale/report', {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales report:', error);
      throw error;
    }
  }
}

export default new SaleService();
