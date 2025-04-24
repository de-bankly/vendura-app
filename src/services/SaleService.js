import apiClient from './ApiConfig';

/**
 * Service for managing sales operations via API.
 */
class SaleService {
  /**
   * Creates a new sale record.
   * @param {Object} saleData - Data for the new sale.
   * @param {Array<Object>} saleData.items - Items included in the sale.
   * @param {number} saleData.items[].id - Product ID.
   * @param {number} saleData.items[].quantity - Quantity of the product.
   * @param {number} saleData.items[].price - Price per unit of the product.
   * @param {Array<Object>} [saleData.giftCards] - Optional array of gift cards used.
   * @param {number} saleData.giftCards[].id - ID of the gift card.
   * @param {number} [saleData.giftCards[].amount] - Amount applied from the gift card.
   * @param {Array<Object>} [saleData.discountCards] - Optional array of discount cards used.
   * @param {number} saleData.discountCards[].id - ID of the discount card.
   * @param {number} [saleData.voucherDiscount] - Total discount amount from discount cards.
   * @param {string} saleData.paymentMethod - Payment method used ('cash' or 'card').
   * @param {number} saleData.total - The final total amount to be paid via cash or card after deductions.
   * @param {number} [saleData.cashReceived] - Amount of cash received (if paymentMethod is 'cash').
   * @param {number} [saleData.change] - Change given back (if paymentMethod is 'cash').
   * @param {Object} [saleData.cardDetails] - Card details (if paymentMethod is 'card').
   * @param {string} [saleData.cardDetails.cardNumber] - Card number.
   * @param {string} [saleData.cardDetails.cardHolderName] - Cardholder name.
   * @param {string} [saleData.cardDetails.expirationDate] - Card expiration date.
   * @param {string} [saleData.cardDetails.cvv] - Card CVV.
   * @returns {Promise<Object>} Promise resolving to the created sale object from the API.
   * @throws {Error} Throws an error if the API call fails.
   */
  async createSale(saleData) {
    try {
      const positions = saleData.items.map(item => ({
        product: { id: item.id },
        quantity: item.quantity,
        unitPrice: parseFloat((Math.round(item.price * 100) / 100).toFixed(2)),
        total: parseFloat((Math.round(item.price * item.quantity * 100) / 100).toFixed(2)),
        discountValue: 0,
      }));

      const payments = [];

      if (saleData.giftCards && saleData.giftCards.length > 0) {
        saleData.giftCards.forEach(card => {
          payments.push({
            type: 'GIFTCARD',
            amount: parseFloat((Math.round((card.amount || 0) * 100) / 100).toFixed(2)),
            giftcardId: card.id,
          });
        });
      }

      if (saleData.discountCards && saleData.discountCards.length > 0) {
        const discountCard = saleData.discountCards[0];
        const discountAmount = parseFloat(
          (Math.round(saleData.voucherDiscount * 100) / 100).toFixed(2)
        );

        payments.push({
          type: 'GIFTCARD', // Backend expects GIFTCARD type for discount cards
          amount: discountAmount,
          giftcardId: discountCard.id,
        });
      }

      const finalTotal = parseFloat((Math.round(saleData.total * 100) / 100).toFixed(2));

      if (saleData.paymentMethod === 'cash') {
        payments.push({
          type: 'CASH',
          amount: finalTotal,
          cashReceived: parseFloat((Math.round(saleData.cashReceived * 100) / 100).toFixed(2)),
          change: parseFloat((Math.round((saleData.change || 0) * 100) / 100).toFixed(2)),
        });
      } else if (saleData.paymentMethod === 'card') {
        payments.push({
          type: 'CARD',
          amount: finalTotal,
          cardDetails: {
            cardNumber: saleData.cardDetails?.cardNumber,
            cardHolderName: saleData.cardDetails?.cardHolderName,
            expirationDate: saleData.cardDetails?.expirationDate,
            cvv: saleData.cardDetails?.cvv,
          },
        });
      }

      const saleDTO = {
        positions,
        payments,
        total: finalTotal,
      };

      const response = await apiClient.post('/v1/sale', saleDTO);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      throw error;
    }
  }

  /**
   * Retrieves a paginated list of sales.
   * @param {Object} [pageable={ page: 0, size: 10 }] - Pagination parameters.
   * @param {number} [pageable.page=0] - The page number to retrieve (0-indexed).
   * @param {number} [pageable.size=10] - The number of sales per page.
   * @returns {Promise<Object>} Promise resolving to paginated sale data (likely includes content array and pagination details).
   * @throws {Error} Throws an error if the API call fails.
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
   * Retrieves a specific sale by its unique identifier.
   * @param {String} id - The ID of the sale to retrieve.
   * @returns {Promise<Object>} Promise resolving to the sale data object.
   * @throws {Error} Throws an error if the API call fails or sale is not found.
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
   * Calculates sale totals based on items and applied vouchers.
   * This is a client-side helper function.
   * @param {Array<Object>} items - Array of items in the sale.
   * @param {number} items[].price - Price per unit of the item.
   * @param {number} items[].quantity - Quantity of the item.
   * @param {Array<Object>} [vouchers=[]] - Optional array of applied vouchers (gift cards, discount cards).
   * @param {string} vouchers[].type - Type of voucher ('GIFT_CARD', 'DISCOUNT_CARD').
   * @param {number} [vouchers[].amount] - Amount value for GIFT_CARD type.
   * @param {number} [vouchers[].discountPercentage] - Discount percentage for DISCOUNT_CARD type.
   * @returns {{subtotal: number, discountAmount: number, giftCardPayment: number, total: number}} An object containing calculated subtotal, discount amount, gift card payment total, and the final total.
   */
  calculateTotals(items, vouchers = []) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let discountAmount = 0;
    let giftCardPayment = 0;

    if (vouchers && vouchers.length > 0) {
      const discountVouchers = vouchers.filter(v => v.type === 'DISCOUNT_CARD');
      if (discountVouchers.length > 0) {
        const discountCard = discountVouchers[0]; // Using only the first discount card
        discountAmount = subtotal * (discountCard.discountPercentage / 100);
      }

      const giftCardVouchers = vouchers.filter(v => v.type === 'GIFT_CARD');
      giftCardPayment = giftCardVouchers.reduce((sum, card) => sum + (card.amount || 0), 0);
    }

    const total = Math.max(0, subtotal - discountAmount - giftCardPayment);

    return {
      subtotal,
      discountAmount,
      giftCardPayment,
      total,
    };
  }

  /**
   * Voids a specific sale.
   * @param {String} id - The ID of the sale to void.
   * @param {String} reason - The reason for voiding the sale.
   * @returns {Promise<Object>} Promise resolving to the voided sale object from the API.
   * @throws {Error} Throws an error if the API call fails.
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
   * Retrieves a sales report for a specified date range.
   * @param {Date} startDate - The start date for the report.
   * @param {Date} endDate - The end date for the report.
   * @returns {Promise<Object>} Promise resolving to the sales report data.
   * @throws {Error} Throws an error if the API call fails.
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
