import React, { useState } from 'react';
import { useBarcodeScan } from '../../contexts/BarcodeContext';

/**
 * Component for manual barcode input when scanner fails
 */
function ManualBarcodeInput() {
  const [inputBarcode, setInputBarcode] = useState('');
  const { manualScan, isProcessing } = useBarcodeScan();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputBarcode && !isProcessing) {
      manualScan(inputBarcode);
      setInputBarcode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="manual-barcode-form">
      <div className="manual-barcode-form__container">
        <input
          type="text"
          value={inputBarcode}
          onChange={(e) => setInputBarcode(e.target.value)}
          placeholder="Barcode manuell eingeben"
          disabled={isProcessing}
          className="manual-barcode-form__input"
        />
        <button 
          type="submit" 
          disabled={!inputBarcode || isProcessing}
          className="manual-barcode-form__button"
        >
          {isProcessing ? 'Suche...' : 'Suchen'}
        </button>
      </div>
    </form>
  );
}

export default ManualBarcodeInput; 