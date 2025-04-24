import { useState, useCallback, useEffect } from 'react';
import { PrinterService } from '../services';

/**
 * Hook for using the printer service
 * @param {Object} options - Configuration options
 * @param {boolean} [options.checkStatusOnMount=false] - Whether to check the printer status when the component mounts
 * @returns {Object} Printer state and functions
 */
const usePrinter = (options = {}) => {
  const { checkStatusOnMount = false } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusChecked, setStatusChecked] = useState(false);

  // Check printer status
  const checkStatus = useCallback(async () => {
    if (isLoading) return false; // Prevent multiple concurrent status checks

    setIsLoading(true);
    setError(null);

    try {
      const { connected } = await PrinterService.checkStatus();
      setIsConnected(connected);
      setStatusChecked(true);
      return connected;
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // Print basic content
  const print = useCallback(async (content, options) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await PrinterService.print(content, options);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Print receipt
  const printReceipt = useCallback(
    async receiptData => {
      // We'll check status only if it hasn't been checked yet, and only on actual usage
      if (!statusChecked && !isLoading) {
        // Silently check status without blocking or showing errors to avoid disrupting user flow
        try {
          const { connected } = await PrinterService.checkStatus();
          setIsConnected(connected);
          setStatusChecked(true);
        } catch (error) {
          // Silently fail - we'll still try to print
          console.warn('Silent printer check failed, continuing anyway');
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await PrinterService.printReceipt(receiptData);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [statusChecked, isLoading]
  );

  // Print deposit receipt with barcode
  const printDepositReceipt = useCallback(
    async depositData => {
      if (!statusChecked && !isLoading) {
        try {
          const { connected } = await PrinterService.checkStatus();
          setIsConnected(connected);
          setStatusChecked(true);
        } catch (error) {
          console.warn('Silent printer check failed, continuing anyway');
        }
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = await PrinterService.printDepositReceipt(depositData);
        return result;
      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [statusChecked, isLoading]
  );

  // Print simple text
  const printText = useCallback(async text => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await PrinterService.printText(text);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check status when the component mounts, only if checkStatusOnMount is true
  useEffect(() => {
    if (checkStatusOnMount) {
      checkStatus();
    }
  }, [checkStatusOnMount, checkStatus]);

  return {
    isConnected,
    isLoading,
    error,
    statusChecked,
    checkStatus,
    print,
    printReceipt,
    printDepositReceipt,
    printText,
  };
};

export default usePrinter;
