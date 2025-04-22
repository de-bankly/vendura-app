import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to handle barcode scanner input
 * @param {Object} options Configuration options
 * @param {Function} options.onScan Callback function when barcode is scanned
 * @param {number} options.timeout Time in ms to determine if keystrokes belong to same scan
 * @param {string} options.endCharacter Character that marks the end of a barcode (usually Enter)
 * @param {boolean} options.isEnabled Whether the scanner is currently enabled
 * @param {React.RefObject} options.inputRef Optional ref to input that should receive focus
 * @returns {Object} Barcode state and controls
 */
export function useBarcode({ 
  onScan, 
  timeout = 100, 
  endCharacter = 'Enter',
  isEnabled = true,
  inputRef = null
}) {
  const [barcode, setBarcode] = useState('');
  const [lastScanTime, setLastScanTime] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const resetBarcode = useCallback(() => {
    setBarcode('');
    setIsScanning(false);
  }, []);

  const handleScan = useCallback(() => {
    if (barcode) {
      onScan(barcode);
      resetBarcode();
    }
  }, [barcode, onScan, resetBarcode]);

  // Focus the input element if provided
  useEffect(() => {
    if (isEnabled && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEnabled, inputRef]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (event) => {
      const currentTime = new Date().getTime();
      
      // Typical barcode scanners send characters very quickly
      if (currentTime - lastScanTime > timeout && !isScanning) {
        // New scan is starting
        setBarcode(event.key);
        setIsScanning(true);
      } else if (isScanning) {
        if (event.key === endCharacter) {
          // End of barcode detected, process the scan
          event.preventDefault(); // Prevents Enter actions like form submits
          handleScan();
        } else {
          // Building barcode
          setBarcode(prev => prev + event.key);
        }
      }
      
      setLastScanTime(currentTime);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [barcode, isScanning, lastScanTime, timeout, endCharacter, handleScan, resetBarcode, isEnabled]);

  return { 
    barcode, 
    isScanning, 
    resetBarcode 
  };
} 