import axios from 'axios';

const API_URL = import.meta.env.VITE_PRINTER_SERVICE_URL || 'http://localhost:3001';

/**
 * Service class for interacting with the printer API.
 */
class PrinterService {
  /**
   * Creates an instance of PrinterService.
   * @param {string} [apiUrl=API_URL] - The base URL for the printer service API.
   */
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
   * Checks the connection status of the printer service.
   * @returns {Promise<{connected: boolean, error?: string}>} A promise that resolves with the connection status.
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
   * Formats cart items into a structure suitable for receipt printing.
   * @param {Array<Object>} cartItems - Array of cart items.
   * @param {Object} [options={}] - Additional options for formatting.
   * @param {number} [options.voucherDiscount=0] - Discount amount from vouchers.
   * @param {number} [options.depositCredit=0] - Credit amount from deposits.
   * @param {number} [options.productDiscount=0] - Discount amount on products.
   * @param {number} [options.giftCardPayment=0] - Amount paid by gift card.
   * @param {string} [options.paymentMethod='cash'] - The payment method used.
   * @param {number} [options.cashReceived=0] - Amount of cash received (if paymentMethod is 'cash').
   * @param {Object} [options.cardDetails={}] - Details of the card used (if paymentMethod is 'card').
   * @param {number} [options.total=0] - The total amount of the transaction.
   * @returns {Array<{name: string, price: string, description?: string}>} Formatted items ready for printing.
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
   * Sends a request to print a standard sales receipt.
   * @param {Object} receiptData - Data for the receipt.
   * @param {Array<Object>} receiptData.cartItems - Items included in the transaction.
   * @param {number} [receiptData.voucherDiscount] - Discount from vouchers.
   * @param {number} [receiptData.depositCredit] - Credit from deposits.
   * @param {number} [receiptData.productDiscount] - Discount on products.
   * @param {number} [receiptData.giftCardPayment] - Amount paid by gift card.
   * @param {string} [receiptData.paymentMethod] - Payment method used.
   * @param {number} [receiptData.cashReceived] - Cash received (for cash payments).
   * @param {Object} [receiptData.cardDetails] - Card details (for card payments).
   * @param {number} receiptData.total - Total amount of the transaction.
   * @param {string} [receiptData.title] - Title of the receipt.
   * @param {string} [receiptData.transactionId] - Unique identifier for the transaction.
   * @param {string} [receiptData.footerText] - Text to display at the bottom of the receipt.
   * @returns {Promise<{success: boolean, message: string}>} A promise that resolves with the print status or rejects with an error.
   */
  async printReceipt(receiptData) {
    try {
      const { cartItems, ...rest } = receiptData;
      const formattedReceiptData = {
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

      const response = await this.client.post('/print/receipt', formattedReceiptData);
      return response.data;
    } catch (error) {
      console.error('Error printing receipt:', error);
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  /**
   * Sends a request to print a deposit receipt.
   * @param {Object} depositData - Data for the deposit receipt.
   * @param {string} [depositData.id] - Unique identifier for the deposit.
   * @param {Array<Object>} [depositData.positions] - Items included in the deposit.
   * @param {number} [depositData.total] - Total amount of the deposit.
   * @returns {Promise<{success: boolean, message: string}>} A promise that resolves with the print status or rejects with an error.
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
