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
   * Validates an EAN-8 barcode
   * 
   * @param {string} barcode - The barcode to validate
   * @returns {boolean} Whether the barcode is valid
   */
  validateEAN8(barcode) {
    // EAN-8 must be 8 digits
    if (barcode.length !== 8 || !/^\d+$/.test(barcode)) {
      return false;
    }
    
    // Check digit validation
    let sum = 0;
    for (let i = 0; i < 7; i++) {
      sum += parseInt(barcode[i]) * (i % 2 === 0 ? 3 : 1);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return parseInt(barcode[7]) === checkDigit;
  },

  /**
   * Validates a UPC-A barcode
   * 
   * @param {string} barcode - The barcode to validate
   * @returns {boolean} Whether the barcode is valid
   */
  validateUPCA(barcode) {
    // UPC-A must be 12 digits
    if (barcode.length !== 12 || !/^\d+$/.test(barcode)) {
      return false;
    }
    
    // Check digit validation
    let sum = 0;
    for (let i = 0; i < 11; i++) {
      sum += parseInt(barcode[i]) * (i % 2 === 0 ? 3 : 1);
    }
    const checkDigit = (10 - (sum % 10)) % 10;
    
    return parseInt(barcode[11]) === checkDigit;
  },

  /**
   * Validates a barcode (supports multiple formats)
   * 
   * @param {string} barcode - The barcode to validate
   * @returns {boolean} Whether the barcode is valid in any supported format
   */
  validateBarcode(barcode) {
    if (!barcode || typeof barcode !== 'string') {
      return false;
    }
    
    // Remove any whitespace
    barcode = barcode.trim();
    
    // Check for different barcode formats
    if (barcode.length === 13) {
      return this.validateEAN13(barcode);
    } else if (barcode.length === 12) {
      return this.validateUPCA(barcode);
    } else if (barcode.length === 8) {
      return this.validateEAN8(barcode);
    }
    
    // If it's a different format, accept it (custom barcodes)
    return true;
  },
  
  /**
   * Gets country information from EAN-13 barcode
   * 
   * @param {string} barcode - The EAN-13 barcode
   * @returns {string|null} Country name or null if not recognized
   */
  getEANCountry(barcode) {
    if (!this.validateEAN13(barcode)) {
      return null;
    }
    
    const prefix = barcode.substring(0, 3);
    
    // Common EAN country codes
    const countryCodes = {
      '000': 'USA/Canada (UPC)',
      '300': 'France',
      '380': 'Bulgaria',
      '383': 'Slovenia',
      '385': 'Croatia',
      '400': 'Germany',
      '450': 'Japan',
      '460': 'Russia',
      '471': 'Taiwan',
      '489': 'Hong Kong',
      '500': 'United Kingdom',
      '520': 'Greece',
      '529': 'Cyprus',
      '539': 'Ireland',
      '560': 'Portugal',
      '590': 'Poland',
      '600': 'South Africa',
      '640': 'Finland',
      '690': 'China',
      '729': 'Israel',
      '760': 'Switzerland',
      '850': 'Cuba',
      '859': 'Czech Republic',
      '860': 'Serbia',
      '869': 'Turkey',
      '870': 'Netherlands',
      '880': 'South Korea',
      '890': 'India',
      '893': 'Vietnam'
    };
    
    // Check for exact match
    if (countryCodes[prefix]) {
      return countryCodes[prefix];
    }
    
    // Check for prefix range
    for (const [code, country] of Object.entries(countryCodes)) {
      if (prefix.startsWith(code.substring(0, 2))) {
        return country;
      }
    }
    
    return null;
  }
};

export default BarcodeService; 