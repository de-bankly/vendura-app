import axios from 'axios';

// Default configuration - should be loaded from environment variables in a real application
const API_URL = import.meta.env.VITE_PRINTER_SERVICE_URL || 'http://localhost:3001';

class PrinterService {
  constructor(apiUrl = API_URL) {
    this.apiUrl = apiUrl;
    console.log('PrinterService initialized with API URL:', apiUrl);
    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 second timeout
    });
  }

  /**
   * Check if the printer is connected
   * @returns {Promise<{connected: boolean}>}
   */
  async checkStatus() {
    try {
      console.log('Checking printer status...');
      // Use the root route instead of the status route
      const response = await this.client.get('/');
      console.log('Printer status response:', response.data);
      // Convert success field from response to connected property
      return { connected: response.data.success === true };
    } catch (error) {
      console.error('Error checking printer status:', error);
      return { connected: false, error: error.message };
    }
  }

  /**
   * Send a basic print job
   * @param {Object} content - Content to print
   * @param {Object} options - Additional options
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async print(content, options = {}) {
    try {
      console.log('Sending print job with content:', content, 'and options:', options);
      const response = await this.client.post('/print', { content, options });
      console.log('Print job response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending print job:', error);
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  /**
   * Format cart items for receipt printing
   * @param {Array} cartItems - Array of cart items
   * @param {Object} options - Additional options for formatting
   * @returns {Array} Formatted items ready for printing
   */
  formatReceiptItems(cartItems, options = {}) {
    console.log('Formatting receipt items from cart items:', cartItems, 'with options:', options);
    const {
      voucherDiscount = 0,
      depositCredit = 0,
      paymentMethod = 'cash',
      cashReceived = 0,
      total = 0,
    } = options;

    // Format regular items
    const formattedItems = cartItems.map(item => ({
      name: item.name,
      price: `${item.price.toFixed(2)} €`,
      description:
        item.quantity > 1 ? `${item.quantity} x ${(item.price / item.quantity).toFixed(2)} €` : '',
    }));

    // Add discount information if applicable
    if (voucherDiscount > 0) {
      formattedItems.push({
        name: 'Gutschein Rabatt',
        price: `-${voucherDiscount.toFixed(2)} €`,
      });
    }

    if (depositCredit > 0) {
      formattedItems.push({
        name: 'Pfand Gutschrift',
        price: `-${depositCredit.toFixed(2)} €`,
      });
    }

    // Add payment method information
    formattedItems.push({
      name: 'Zahlungsart',
      price:
        paymentMethod === 'cash'
          ? 'Barzahlung'
          : paymentMethod === 'card'
            ? 'Kartenzahlung'
            : 'Sonstige',
    });

    // Add change information for cash payments
    if (paymentMethod === 'cash' && parseFloat(cashReceived) > total) {
      const changeAmount = parseFloat(cashReceived) - total;
      formattedItems.push({
        name: 'Rückgeld',
        price: `${changeAmount.toFixed(2)} €`,
      });
    }

    console.log('Formatted receipt items:', formattedItems);
    return formattedItems;
  }

  /**
   * Print a receipt
   * @param {Object} receiptData - Data for the receipt
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async printReceipt(receiptData) {
    try {
      console.log('PrintReceipt called with data:', receiptData);

      // Check if receiptData is an array of cart items and needs formatting
      if (Array.isArray(receiptData)) {
        console.log('Receipt data is an array, formatting as cart items');
        // This is just cart items, create a full receipt structure
        const formattedDate = new Date().toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });

        // Calculate total if not provided
        const total = receiptData.reduce((sum, item) => sum + (item.price || 0), 0);

        receiptData = {
          title: 'KAUFBELEG',
          orderNumber: `TR-${Date.now().toString().slice(-6)}`,
          date: formattedDate,
          items: this.formatReceiptItems(receiptData),
          total: `${total.toFixed(2)} €`,
          footerText: 'Vielen Dank für Ihren Einkauf!',
        };
      } else if (receiptData.cartItems) {
        console.log('Receipt data contains cartItems object, formatting properly');
        // Handle case where receiptData contains cartItems plus additional info
        const { cartItems, ...rest } = receiptData;
        receiptData = {
          ...rest,
          items: this.formatReceiptItems(cartItems, {
            voucherDiscount: receiptData.voucherDiscount || 0,
            depositCredit: receiptData.depositCredit || 0,
            paymentMethod: receiptData.paymentMethod || 'cash',
            cashReceived: receiptData.cashReceived || 0,
            total: receiptData.total || 0,
          }),
          title: receiptData.title || 'KAUFBELEG',
          orderNumber: receiptData.transactionId || `TR-${Date.now().toString().slice(-6)}`,
          total: `${receiptData.total.toFixed(2)} €`,
          footerText: receiptData.footerText || 'Vielen Dank für Ihren Einkauf!',
        };
      }

      // Add printer configuration if not present, using valid code page values
      if (!receiptData.printerConfig) {
        receiptData.printerConfig = {
          characterSet: 'SLOVENIA', // Use a valid character set that matches the printer
        };
      }

      console.log('Sending formatted receipt data to printer service:', receiptData);
      const response = await this.client.post('/print/receipt', receiptData);
      console.log('Receipt print response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error printing receipt:', error);
      throw new Error(error.response?.data?.error || error.message);
    }
  }

  /**
   * Print a simple text
   * @param {string} text - Text to print
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async printText(text) {
    console.log('Printing simple text:', text);
    return this.print({
      text,
      alignCenter: true,
      drawLine: true,
      cut: true,
    });
  }
}

// Create a singleton instance
const printerService = new PrinterService();

export default printerService;
