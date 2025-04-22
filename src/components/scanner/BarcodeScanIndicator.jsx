import React from 'react';
import { useBarcodeScan } from '../../contexts/BarcodeContext';

/**
 * Component to display barcode scanning status
 */
function BarcodeScanIndicator() {
  const { barcode, isScanning, isEnabled, error } = useBarcodeScan();

  if (!isEnabled) {
    return null;
  }

  return (
    <div className="barcode-indicator">
      {isScanning && (
        <div className="barcode-indicator__scanning">
          <span className="barcode-indicator__label">Scanning: </span>
          <span className="barcode-indicator__value">{barcode}</span>
        </div>
      )}
      {error && (
        <div className="barcode-indicator__error">
          {error}
        </div>
      )}
    </div>
  );
}

export default BarcodeScanIndicator; 