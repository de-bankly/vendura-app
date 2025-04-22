/**
 * Service for barcode validation and processing
 */
export const BarcodeService = {
  /**
   * Validates an EAN-13 barcode
   * 
   * @param {string} barcode - The barcode to validate
   * @returns {boolean} Whether the barcode is valid
   */
  validateEAN13(barcode) {
    // EAN-13 must be 13 digits
    if (barcode.length !== 13 || !/^\d+$/.test(barcode)) {
      return false;
    }
    
    // Check digit validation
    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(barcode[i]) * (i % 2 === 0 ? 1 : 3);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return parseInt(barcode[12]) === checkDigit;
  },

  /**
   * Validates a barcode (only supports EAN-13 format)
   * 
   * @param {string} barcode - The barcode to validate
   * @returns {boolean} Whether the barcode is valid in EAN-13 format
   */
  validateBarcode(barcode) {
    if (!barcode || typeof barcode !== 'string') {
      return false;
    }
    
    // Remove any whitespace
    barcode = barcode.trim();
    
    // Only validate EAN-13 format
    return this.validateEAN13(barcode);
  },
  
};

export default BarcodeService; 