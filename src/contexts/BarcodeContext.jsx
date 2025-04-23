import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useBarcode } from '../hooks/useBarcode';
import { useToast } from '../components/ui/feedback/ToastProvider';

const BarcodeContext = createContext();

/**
 * Provider component for barcode scanning functionality
 */
export const BarcodeProvider = ({ children }) => {
  const [scannedValue, setScannedValue] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [activeField, setActiveField] = useState(null);
  const [pendingDepositItems, setPendingDepositItems] = useState([]);
  const inputRef = useRef(null);
  const { showToast } = useToast();

  const handleScan = useCallback(
    async barcode => {
      if (isProcessing) return;

      try {
        setIsProcessing(true);
        setError(null);
        setScannedValue(null);

        // If there's an active field, directly fill it with barcode value
        if (activeField && typeof activeField === 'function') {
          activeField(barcode);
          setIsProcessing(false);
          return;
        }

        // Set the raw scanned value for consumers to handle
        setScannedValue(barcode);
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
    setScannedValue(null);
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

  /**
   * Clear pending deposit items from the automaten
   */
  const clearPendingDepositItems = useCallback(() => {
    setPendingDepositItems([]);
  }, []);

  const value = {
    scannedValue,
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
    pendingDepositItems,
    clearPendingDepositItems,
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
