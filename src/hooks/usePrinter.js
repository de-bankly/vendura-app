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

  const checkStatus = useCallback(async () => {
    if (isLoading) return false;

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

  const printReceipt = useCallback(
    async receiptData => {
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
