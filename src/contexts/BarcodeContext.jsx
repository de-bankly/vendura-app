import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useBarcode } from '../hooks/useBarcode';
import { useToast } from '../components/ui/feedback/ToastProvider';

const BarcodeContext = createContext();

/**
 * Provider component for barcode scanning functionality.
 * Manages scanner state, handles scan events, and provides context values.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
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

  /**
   * Handles the barcode scan event.
   * Sets processing state, updates scanned value or active field, and handles errors.
   * @param {string} barcode - The scanned barcode value.
   */
  const handleScan = useCallback(
    async barcode => {
      if (isProcessing) return;

      try {
        setIsProcessing(true);
        setError(null);
        setScannedValue(null);

        if (activeField && typeof activeField === 'function') {
          activeField(barcode);
          setIsProcessing(false);
          return;
        }

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

  const { barcode, isScanning, resetBarcode } = useBarcode({
    onScan: handleScan,
    isEnabled,
    inputRef,
  });

  /**
   * Resets the current scan state, clearing scanned value and errors.
   */
  const resetScan = useCallback(() => {
    setScannedValue(null);
    setError(null);
    resetBarcode();
    setTimeout(() => {}, 10);
  }, [resetBarcode]);

  /**
   * Enables the barcode scanner.
   */
  const enableScanner = useCallback(() => {
    setIsEnabled(true);
  }, []);

  /**
   * Disables the barcode scanner.
   */
  const disableScanner = useCallback(() => {
    setIsEnabled(false);
  }, []);

  /**
   * Registers a callback function to be invoked when a barcode is scanned
   * and no other specific handler is active. Primarily used for input fields.
   * @param {Function} callback - The function to call with the scanned barcode value.
   * @returns {Function} A cleanup function to unregister the field.
   */
  const registerScanField = useCallback(callback => {
    setActiveField(() => callback);
    return () => setActiveField(null);
  }, []);

  /**
   * Unregisters the currently active scan field callback.
   */
  const unregisterScanField = useCallback(() => {
    setActiveField(null);
  }, []);

  /**
   * Clears the list of pending deposit items.
   */
  const clearPendingDepositItems = useCallback(() => {
    setPendingDepositItems([]);
  }, []);

  const value = {
    scannedValue,
    isProcessing,
    error,
    resetScan,
    manualScan: handleScan, // Expose handleScan for manual triggering
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
 * Custom hook to access the barcode scanning context.
 * Provides access to scanner state, control functions, and scanned values.
 * Must be used within a BarcodeProvider.
 * @returns {object} The barcode context value.
 * @throws {Error} If used outside of a BarcodeProvider.
 */
export const useBarcodeScan = () => {
  const context = useContext(BarcodeContext);
  if (context === undefined) {
    throw new Error('useBarcodeScan must be used within a BarcodeProvider');
  }
  return context;
};

export default BarcodeContext;
