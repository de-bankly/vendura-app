import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useBarcode } from '../hooks/useBarcode';
import { ProductService } from '../services';
import { useToast } from '../components/ui/feedback/ToastProvider';

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
  const { showToast } = useToast();

  const handleScan = useCallback(
    async barcode => {
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
        try {
          const product = await ProductService.getProductById(barcode, true);
          setScannedProduct(product);
        } catch (lookupError) {
          // Always use a specific product not found message for 404 errors
          const errorMsg = `Produkt nicht gefunden.`;
          setError(errorMsg);
          showToast({
            severity: 'error',
            message: errorMsg,
          });
        }
      } catch (err) {
        const errorMsg = `Fehler beim Scannen: ${err.message}`;
        setError(errorMsg);
        showToast({
          severity: 'error',
          message: errorMsg,
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, activeField, showToast]
  );

  // Barcode hook usage
  const { barcode, isScanning, resetBarcode } = useBarcode({
    onScan: handleScan,
    isEnabled,
    inputRef,
  });

  const resetScan = useCallback(() => {
    setScannedProduct(null);
    setError(null);
    resetBarcode();
    // Force a small delay to ensure state is updated before next scan
    setTimeout(() => {}, 10);
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
  const registerScanField = useCallback(callback => {
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
    inputRef,
  };

  return <BarcodeContext.Provider value={value}>{children}</BarcodeContext.Provider>;
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
