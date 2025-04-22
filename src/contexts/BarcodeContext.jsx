import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useBarcode } from '../hooks/useBarcode';
import { ProductService } from '../services';

const BarcodeContext = createContext();

/**
 * Provider component for barcode scanning functionality
 */
export const BarcodeProvider = ({ children }) => {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const inputRef = useRef(null);

  const handleScan = useCallback(async (barcode) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setError(null);
      
      // If there's an active field, directly fill it with barcode value
      if (activeField && typeof activeField === 'function') {
        activeField(barcode);
        setIsProcessing(false);
        return;
      }
      
      // Otherwise look up product by barcode
      const product = await ProductService.getProductByBarcode(barcode);
      
      if (product) {
        setScannedProduct(product);
      } else {
        setError(`Produkt mit Barcode ${barcode} nicht gefunden.`);
      }
    } catch (err) {
      setError(`Fehler beim Scannen: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, activeField]);

  // Barcode hook usage
  const { barcode, isScanning, resetBarcode } = useBarcode({ 
    onScan: handleScan, 
    isEnabled,
    inputRef
  });

  const resetScan = useCallback(() => {
    setScannedProduct(null);
    setError(null);
    resetBarcode();
  }, [resetBarcode]);

  const enableScanner = useCallback(() => {
    setIsEnabled(true);
  }, []);

  const disableScanner = useCallback(() => {
    setIsEnabled(false);
  }, []);

  /**
   * Register a field to receive barcode scan value
   * @param {Function} callback Function to call with barcode value
   */
  const registerScanField = useCallback((callback) => {
    setActiveField(() => callback);
    return () => setActiveField(null);
  }, []);

  /**
   * Unregister the active scan field
   */
  const unregisterScanField = useCallback(() => {
    setActiveField(null);
  }, []);

  const value = {
    scannedProduct,
    isProcessing,
    error,
    resetScan,
    manualScan: handleScan,
    barcode,
    isScanning,
    isEnabled,
    enableScanner,
    disableScanner,
    registerScanField,
    unregisterScanField,
    inputRef
  };

  return (
    <BarcodeContext.Provider value={value}>
      {children}
    </BarcodeContext.Provider>
  );
};

/**
 * Hook to use the barcode context
 */
export const useBarcodeScan = () => {
  const context = useContext(BarcodeContext);
  if (context === undefined) {
    throw new Error('useBarcodeScan must be used within a BarcodeProvider');
  }
  return context;
};

export default BarcodeContext; 