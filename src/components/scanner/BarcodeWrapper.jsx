import React from 'react';
import { BarcodeProvider } from '../../contexts/BarcodeContext';

/**
 * Component that wraps its children with BarcodeProvider
 * Use this to ensure barcode functionality is available
 */
function BarcodeWrapper({ children }) {
  return (
    <BarcodeProvider>
      {children}
    </BarcodeProvider>
  );
}

export default BarcodeWrapper; 