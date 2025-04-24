import axios from 'axios';

const API_URL = import.meta.env.VITE_PRINTER_SERVICE_URL || 'http://localhost:3001';

class PrinterService {
  constructor(apiUrl = API_URL) {
    this.apiUrl = apiUrl;

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  /**
   * Check if the printer is connected
   * @returns {Promise<{connected: boolean}>}
   */
  async checkStatus() {
    try {
      const response = await this.client.get('/');
      return { connected: response.data.success === true };
    } catch (error) {
      console.error('Error checking printer status:', error);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Format cart items for receipt printing
   * @param {Array} cartItems - Array of cart items
   * @param {Object} options - Additional options for formatting
   * @returns {Array} Formatted items ready for printing
   */
  formatReceiptItems(cartItems, options = {}) {
    const {
      voucherDiscount = 0,
      depositCredit = 0,
      productDiscount = 0,
      giftCardPayment = 0,
      paymentMethod = 'cash',
      cashReceived = 0,
      cardDetails = {},
      total = 0,
    } = options;

    const formattedItems = cartItems.map(item => ({
      name: item.name,
      price: `${item.price.toFixed(2)} €`,
      description:
        item.quantity > 1 ? `${item.quantity} x ${(item.price / item.quantity).toFixed(2)} €` : '',
    }));

    if (voucherDiscount > 0) {
      formattedItems.push({
        name: 'Gutschein Rabatt',
        price: `-${voucherDiscount.toFixed(2)} €`,
      });
    }

    if (productDiscount > 0) {
      formattedItems.push({
        name: 'Produkt Rabatt',
        price: `-${productDiscount.toFixed(2)} €`,
      });
    }

    if (giftCardPayment > 0) {
      formattedItems.push({
        name: 'Gutscheinzahlung',
        price: `-${giftCardPayment.toFixed(2)} €`,
      });
    }

    if (depositCredit > 0) {
      formattedItems.push({
        name: 'Pfand Gutschrift',
        price: `-${depositCredit.toFixed(2)} €`,
      });
    }

    formattedItems.push({
      name: 'Zahlungsart',
      price:
        paymentMethod === 'cash'
          ? 'Barzahlung'
          : paymentMethod === 'card'
            ? 'Kartenzahlung'
            : 'Sonstige',
    });

    if (paymentMethod === 'cash') {
      const parsedCashReceived = parseFloat(cashReceived);
      if (!isNaN(parsedCashReceived) && parsedCashReceived > 0) {
        formattedItems.push({
          name: 'Gegeben',
          price: `${parsedCashReceived.toFixed(2)} €`,
        });
      }
    }

    if (paymentMethod === 'card' && cardDetails) {
      if (cardDetails.cardNumber) {
        const maskedCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
        if (maskedCardNumber.length >= 4) {
          const lastFourDigits = maskedCardNumber.slice(-4);
          formattedItems.push({
            name: 'Kartennummer',
            price: `**** **** **** ${lastFourDigits}`,
          });
        }
      }

      if (cardDetails.cardHolderName) {
        formattedItems.push({
          name: 'Karteninhaber',
          price: cardDetails.cardHolderName,
        });
      }

      if (cardDetails.expirationDate) {
        formattedItems.push({
          name: 'Gültig bis',
          price: cardDetails.expirationDate,
        });
      }
    }

    if (paymentMethod === 'cash' && parseFloat(cashReceived) > total) {
      const changeAmount = parseFloat(cashReceived) - total;
      formattedItems.push({
        name: 'Rückgeld',
        price: `${changeAmount.toFixed(2)} €`,
      });
    }

    return formattedItems;
  }

  /**
   * Print a receipt
   * @param {Object} receiptData - Data for the receipt
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async printReceipt(receiptData) {
    try {
      const { cartItems, ...rest } = receiptData;
      receiptData = {
        ...rest,
        items: this.formatReceiptItems(cartItems, {
          voucherDiscount: receiptData.voucherDiscount || 0,
          depositCredit: receiptData.depositCredit || 0,
          productDiscount: receiptData.productDiscount || 0,
          giftCardPayment: receiptData.giftCardPayment || 0,
          paymentMethod: receiptData.paymentMethod || 'cash',
          cashReceived: receiptData.cashReceived || 0,
          cardDetails: receiptData.cardDetails || {},
          total: receiptData.total || 0,
        }),
        title: receiptData.title || 'KAUFBELEG',
        orderNumber: receiptData.transactionId || `TR-${Date.now().toString().slice(-6)}`,
        total: `${receiptData.total.toFixed(2)} €`,
        footerText: receiptData.footerText || 'Vielen Dank für Ihren Einkauf!',
      };

      const response = await this.client.post('/print/receipt', receiptData);
      return response.data;
    } catch (error) {
      console.error('Error printing receipt:', error);
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  /**
   * Print a deposit receipt
   * @param {Object} depositData - Deposit receipt data
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async printDepositReceipt(depositData) {
    try {
      const formattedDate = new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

      const items =
        depositData.positions?.map(position => ({
          name: position.product.name,
          price: `${position.product.price.toFixed(2)} €`,
          description: position.quantity > 1 ? `${position.quantity} x Stück` : null,
        })) || [];

      const receiptData = {
        title: 'PFANDBON',
        orderNumber: depositData.id || `PF-${Date.now().toString().slice(-6)}`,
        date: formattedDate,
        items: items,
        total: `${depositData.total?.toFixed(2) || '0.00'} €`,
      };

      const response = await this.client.post('/print/deposit', receiptData);
      return response.data;
    } catch (error) {
      console.error('Error printing deposit receipt:', error);
      throw new Error(error.response?.data?.error || error.message);
    }
  }
}

const printerService = new PrinterService();

export default printerService;
