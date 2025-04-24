import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to handle barcode scanner input.
 * @param {object} options - Configuration options.
 * @param {Function} options.onScan - Callback function invoked when a complete barcode is scanned. Receives the scanned barcode string as an argument.
 * @param {number} [options.timeout=100] - Time in milliseconds to determine if subsequent keystrokes belong to the same scan sequence.
 * @param {string} [options.endCharacter='Enter'] - The key value indicating the end of a barcode sequence (e.g., 'Enter').
 * @param {boolean} [options.isEnabled=true] - Flag to enable or disable the barcode scanner listener.
 * @param {React.RefObject<HTMLInputElement>} [options.inputRef=null] - Optional ref to an input element that should receive focus when the hook is enabled.
 * @returns {{barcode: string, isScanning: boolean, resetBarcode: Function}} An object containing the current barcode state, scanning status, and a function to manually reset the state.
 */
export function useBarcode({
  onScan,
  timeout = 100,
  endCharacter = 'Enter',
  isEnabled = true,
  inputRef = null,
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

  useEffect(() => {
    if (isEnabled && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEnabled, inputRef]);

  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = event => {
      const currentTime = new Date().getTime();

      if (
        (currentTime - lastScanTime > timeout && !isScanning) ||
        (isScanning && currentTime - lastScanTime > 500)
      ) {
        setBarcode(event.key);
        setIsScanning(true);
      } else if (isScanning) {
        if (event.key === endCharacter) {
          event.preventDefault();
          handleScan();
        } else {
          setBarcode(prev => prev + event.key);
        }
      }

      setLastScanTime(currentTime);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    barcode,
    isScanning,
    lastScanTime,
    timeout,
    endCharacter,
    handleScan,
    resetBarcode,
    isEnabled,
  ]);

  return {
    barcode,
    isScanning,
    resetBarcode,
  };
}
