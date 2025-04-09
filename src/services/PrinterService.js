/**
 * Service for handling thermal printer operations
 * Specifically configured for EPOS Z58B thermal desktop printer
 */
class PrinterService {
  constructor() {
    this.port = null;
    this.writer = null;
    this.reader = null;
    this.isInitialized = false;
    this.encoder = new TextEncoder();
  }

  /**
   * Initialize printer with default configuration
   * @returns {boolean} - Whether initialization was successful
   */
  init() {
    try {
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize printer:', error);
      return false;
    }
  }

  /**
   * Request access to the printer via Web Serial API
   * @returns {Promise<boolean>} - Whether connection was successful
   */
  async connectToPrinter() {
    try {
      if (!navigator.serial) {
        throw new Error('Web Serial API nicht unterstützt. Bitte verwenden Sie Chrome oder Edge.');
      }

      // Request port
      this.port = await navigator.serial.requestPort({
        filters: [{ usbVendorId: 0x0416 }], // Default USB vendor ID for EPOS printers
      });

      // Open connection
      await this.port.open({ baudRate: 9600 });

      // Create writer
      this.writer = this.port.writable.getWriter();

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Error connecting to printer:', error);
      return false;
    }
  }

  /**
   * Check if printer is connected and ready
   * @returns {Promise<boolean>} - Whether printer is ready
   */
  async isPrinterConnected() {
    if (!this.isInitialized) {
      return false;
    }

    if (!this.port || !this.writer) {
      try {
        return await this.connectToPrinter();
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  /**
   * Send data to the printer
   * @param {Uint8Array} data - Data to send
   * @returns {Promise<void>}
   */
  async sendData(data) {
    if (!this.writer) {
      throw new Error('Drucker ist nicht verbunden');
    }

    await this.writer.write(data);
  }

  /**
   * ESC/POS Command: Initialize printer
   * @returns {Promise<void>}
   */
  async initializePrinter() {
    await this.sendData(this.encoder.encode('\x1B\x40'));
  }

  /**
   * ESC/POS Command: Set text alignment
   * @param {string} alignment - 'left', 'center', or 'right'
   * @returns {Promise<void>}
   */
  async setAlignment(alignment) {
    let command = '\x1B\x61';

    switch (alignment) {
      case 'center':
        command += '\x01';
        break;
      case 'right':
        command += '\x02';
        break;
      default: // left
        command += '\x00';
        break;
    }

    await this.sendData(this.encoder.encode(command));
  }

  /**
   * ESC/POS Command: Set text style (bold, underline, etc.)
   * @param {boolean} bold - Whether text should be bold
   * @returns {Promise<void>}
   */
  async setBold(bold) {
    if (bold) {
      await this.sendData(this.encoder.encode('\x1B\x45\x01'));
    } else {
      await this.sendData(this.encoder.encode('\x1B\x45\x00'));
    }
  }

  /**
   * ESC/POS Command: Print and feed paper
   * @param {number} lines - Number of lines to feed
   * @returns {Promise<void>}
   */
  async feed(lines = 1) {
    await this.sendData(this.encoder.encode('\x1B\x64' + String.fromCharCode(lines)));
  }

  /**
   * ESC/POS Command: Cut paper
   * @returns {Promise<void>}
   */
  async cut() {
    await this.sendData(this.encoder.encode('\x1D\x56\x41\x03'));
  }

  /**
   * Print text
   * @param {string} text - Text to print
   * @returns {Promise<void>}
   */
  async printText(text) {
    await this.sendData(this.encoder.encode(text + '\n'));
  }

  /**
   * Print a horizontal line
   * @returns {Promise<void>}
   */
  async printLine() {
    await this.printText('----------------------------------------');
  }

  /**
   * Print left and right aligned text
   * @param {string} left - Left-aligned text
   * @param {string} right - Right-aligned text
   * @returns {Promise<void>}
   */
  async printLeftRight(left, right) {
    const maxChars = 48; // For 58mm paper
    const spaces = maxChars - left.length - right.length;

    if (spaces > 0) {
      await this.printText(left + ' '.repeat(spaces) + right);
    } else {
      // If not enough space, print on separate lines
      await this.printText(left);
      await this.setAlignment('right');
      await this.printText(right);
      await this.setAlignment('left');
    }
  }

  /**
   * Close connection to printer
   * @returns {Promise<void>}
   */
  async close() {
    if (this.writer) {
      await this.writer.close();
      this.writer = null;
    }

    if (this.port) {
      await this.port.close();
      this.port = null;
    }

    this.isInitialized = false;
  }

  /**
   * Generate a unique receipt number
   * @returns {string} - Generated receipt number
   */
  generateReceiptNumber() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    return `R-${year}${month}${day}-${random}`;
  }

  /**
   * Print a receipt for a completed transaction
   * @param {Array} items - Cart items
   * @param {number} subtotal - Subtotal amount
   * @param {Array} vouchers - Applied vouchers
   * @param {number} voucherDiscount - Total voucher discount
   * @param {number} total - Total amount
   * @param {string} paymentMethod - Payment method used
   * @param {number} cashReceived - Cash received (if applicable)
   * @param {number} change - Change given (if applicable)
   * @returns {Promise<boolean>} - Whether printing was successful
   */
  async printReceipt(
    items,
    subtotal,
    vouchers = [],
    voucherDiscount = 0,
    total,
    paymentMethod,
    cashReceived = 0,
    change = 0
  ) {
    try {
      const isConnected = await this.isPrinterConnected();
      if (!isConnected) {
        throw new Error('Drucker ist nicht verbunden');
      }

      // Initialize printer
      await this.initializePrinter();

      // Store header
      await this.setAlignment('center');
      await this.setBold(true);
      await this.printText('VENDURA SHOP');
      await this.setBold(false);
      await this.printText('Musterstraße 123, 12345 Musterstadt');
      await this.printText('Tel: 01234-567890');
      await this.printText('USt-IdNr: DE123456789');
      await this.feed(1);

      // Receipt details
      await this.setAlignment('left');
      await this.printText(`Datum: ${new Date().toLocaleString('de-DE')}`);
      await this.printText(`Belegnummer: ${this.generateReceiptNumber()}`);
      await this.printLine();

      // Items
      await this.setAlignment('left');
      await this.setBold(true);
      await this.printText('ARTIKEL');
      await this.setBold(false);

      for (const item of items) {
        await this.printLeftRight(
          `${item.quantity}x ${item.name}`,
          `${(item.price * item.quantity).toFixed(2)} €`
        );

        // Print item details if available
        if (item.sku) {
          await this.printText(`  Art-Nr: ${item.sku}`);
        }
      }

      await this.printLine();

      // Subtotal
      await this.printLeftRight('Zwischensumme:', `${subtotal.toFixed(2)} €`);

      // Vouchers if applied
      if (vouchers.length > 0) {
        await this.feed(1);
        await this.setBold(true);
        await this.printText('GUTSCHEINE');
        await this.setBold(false);

        for (const voucher of vouchers) {
          await this.printLeftRight(`Gutschein ${voucher.code}:`, `-${voucher.value.toFixed(2)} €`);
        }

        await this.printLeftRight('Gutschein-Rabatt:', `-${voucherDiscount.toFixed(2)} €`);
      }

      await this.printLine();

      // Total
      await this.setBold(true);
      await this.printLeftRight('GESAMTSUMME:', `${total.toFixed(2)} €`);
      await this.setBold(false);
      await this.feed(1);

      // Payment information
      await this.setBold(true);
      await this.printText('ZAHLUNGSINFORMATIONEN');
      await this.setBold(false);

      const paymentMethodText =
        paymentMethod === 'cash'
          ? 'Barzahlung'
          : paymentMethod === 'card'
            ? 'Kartenzahlung'
            : paymentMethod === 'invoice'
              ? 'Rechnung'
              : 'Andere';

      await this.printLeftRight('Zahlungsart:', paymentMethodText);

      if (paymentMethod === 'cash') {
        await this.printLeftRight('Gegeben:', `${parseFloat(cashReceived).toFixed(2)} €`);
        await this.printLeftRight('Rückgeld:', `${parseFloat(change).toFixed(2)} €`);
      }

      await this.feed(1);

      // Footer
      await this.setAlignment('center');
      await this.printText('Vielen Dank für Ihren Einkauf!');
      await this.printText('Wir freuen uns auf Ihren nächsten Besuch.');
      await this.feed(3);
      await this.cut();

      return true;
    } catch (error) {
      console.error('Error printing receipt:', error);
      return false;
    }
  }

  /**
   * Print a test page to verify printer connection
   * @returns {Promise<boolean>} - Whether test printing was successful
   */
  async printTestPage() {
    try {
      const isConnected = await this.isPrinterConnected();
      if (!isConnected) {
        throw new Error('Drucker ist nicht verbunden');
      }

      await this.initializePrinter();
      await this.setAlignment('center');
      await this.setBold(true);
      await this.printText('DRUCKER-TESTSEITE');
      await this.setBold(false);
      await this.feed(1);
      await this.printText('EPOS Z58B Thermal Printer');
      await this.printText(new Date().toLocaleString('de-DE'));
      await this.printLine();
      await this.setAlignment('left');
      await this.printText('Normale Schrift');
      await this.setBold(true);
      await this.printText('Fett gedruckte Schrift');
      await this.setBold(false);
      await this.feed(1);
      await this.printLine();
      await this.setAlignment('center');
      await this.printText('Testdruck erfolgreich!');
      await this.feed(3);
      await this.cut();

      return true;
    } catch (error) {
      console.error('Error printing test page:', error);
      return false;
    }
  }
}

export default new PrinterService();
