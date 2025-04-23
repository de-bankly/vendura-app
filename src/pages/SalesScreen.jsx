import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Container,
  useTheme,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Typography,
} from '@mui/material';
import { motion } from 'framer-motion';

// Import components and utilities
import {
  SalesMainContent,
  DialogManager,
  calculateVoucherDiscount,
  calculateGiftCardPayment,
  CartStateManager,
  processPayment,
  handleDepositRedemption,
} from '../components/sales';

// Import services
import { ProductService, CartService, printerService, DepositService } from '../services';
import { useToast } from '../components/ui/feedback';
import { useBarcodeScan } from '../contexts/BarcodeContext';
import usePrinter from '../hooks/usePrinter';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const SalesScreen = () => {
  const theme = useTheme();
  const { showToast } = useToast();
  const { scannedValue, error: scanError, resetScan, enableScanner } = useBarcodeScan();
  const {
    printReceipt,
    isLoading: isPrinterLoading,
    error: printerError,
    checkStatus: checkPrinterStatus,
    isConnected: isPrinterConnected,
    statusChecked: printerStatusChecked,
  } = usePrinter({ checkStatusOnMount: false });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const [appliedDeposits, setAppliedDeposits] = useState([]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [depositCredit, setDepositCredit] = useState(0);
  const [giftCardPayment, setGiftCardPayment] = useState(0);
  const [cartLocked, setCartLocked] = useState(false);

  const [cartUndoEnabled, setCartUndoEnabled] = useState(false);
  const [cartRedoEnabled, setCartRedoEnabled] = useState(false);
  const [receiptReady, setReceiptReady] = useState(false);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [redeemDepositDialogOpen, setRedeemDepositDialogOpen] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await ProductService.getProducts({ page: 0, size: 100 });
      const allProducts = productData.content || [];
      setProducts(allProducts);
      setProductsByCategory(ProductService.groupByCategory(allProducts));
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Fehler beim Laden der Produkte.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await ProductService.getProducts({ page: 0, size: 100 });
        if (isMounted) {
          const allProducts = productData.content || [];
          setProducts(allProducts);
          setProductsByCategory(ProductService.groupByCategory(allProducts));
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          setError(err.message || 'Fehler beim Laden der Produkte.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  const cartService = useMemo(() => CartService, []);

  const subtotal = useMemo(() => {
    return cartService.calculateSubtotal(cartItems);
  }, [cartItems, cartService]);

  const productDiscount = useMemo(() => {
    return cartService.calculateTotalDiscount(cartItems);
  }, [cartItems, cartService]);

  useEffect(() => {
    const afterProductDiscountTotal = subtotal - productDiscount;

    const calculatedDiscount = calculateVoucherDiscount(afterProductDiscountTotal, appliedVouchers);
    setVoucherDiscount(calculatedDiscount);

    const afterDiscountTotal = afterProductDiscountTotal - calculatedDiscount;
    const calculatedGiftCardPayment = calculateGiftCardPayment(afterDiscountTotal, appliedVouchers);
    setGiftCardPayment(calculatedGiftCardPayment);
  }, [subtotal, productDiscount, appliedVouchers]);

  const total = useMemo(() => {
    const calculatedTotal = subtotal - depositCredit - giftCardPayment - voucherDiscount;
    return calculatedTotal > 0 ? calculatedTotal : 0;
  }, [subtotal, depositCredit, giftCardPayment, voucherDiscount]);

  const change = useMemo(() => {
    if (paymentMethod !== 'cash' || !cashReceived) return 0;
    const cashValue = parseFloat(cashReceived);
    const roundedTotal = Math.round(total * 100) / 100;
    return cashValue > roundedTotal ? Math.round((cashValue - roundedTotal) * 100) / 100 : 0;
  }, [paymentMethod, cashReceived, total]);

  useEffect(() => {
    const checkUndoRedoState = () => {
      setCartUndoEnabled(CartStateManager.canUndoCartState() || false);
      setCartRedoEnabled(CartStateManager.canRedoCartState() || false);
    };

    checkUndoRedoState();
    const interval = setInterval(checkUndoRedoState, 500);
    return () => clearInterval(interval);
  }, [cartItems, appliedVouchers]);

  const handleAddToCart = useCallback(
    product => {
      if (cartLocked) {
        showToast({
          severity: 'warning',
          message:
            'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um weitere Produkte hinzuzufügen.',
        });
        return;
      }
      CartStateManager.addToCart(cartItems, appliedVouchers, product, setCartItems, showToast);
    },
    [cartItems, appliedVouchers, cartLocked, showToast]
  );

  const handleRemoveFromCart = useCallback(
    productId => {
      if (cartLocked) {
        showToast({
          severity: 'warning',
          message:
            'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Änderungen vorzunehmen.',
        });
        return;
      }
      CartStateManager.removeFromCart(cartItems, appliedVouchers, productId, setCartItems);
    },
    [cartItems, appliedVouchers, cartLocked, showToast]
  );

  const handleDeleteFromCart = useCallback(
    productId => {
      if (cartLocked) {
        showToast({
          severity: 'warning',
          message:
            'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Änderungen vorzunehmen.',
        });
        return;
      }
      CartStateManager.deleteFromCart(cartItems, appliedVouchers, productId, setCartItems);
    },
    [cartItems, appliedVouchers, cartLocked, showToast]
  );

  const handleClearCart = useCallback(() => {
    CartStateManager.clearCart(
      setCartItems,
      setAppliedVouchers,
      setAppliedDeposits,
      setVoucherDiscount,
      setDepositCredit,
      setCardDetails
    );
  }, []);

  const handleUndoCartState = useCallback(() => {
    if (cartLocked) {
      showToast({
        severity: 'warning',
        message:
          'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Änderungen vorzunehmen.',
      });
      return;
    }
    CartStateManager.undoCartState(setCartItems, setAppliedVouchers);
  }, [cartLocked, showToast]);

  const handleRedoCartState = useCallback(() => {
    if (cartLocked) {
      showToast({
        severity: 'warning',
        message:
          'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Änderungen vorzunehmen.',
      });
      return;
    }
    CartStateManager.redoCartState(setCartItems, setAppliedVouchers);
  }, [cartLocked, showToast]);

  const handleApplyVoucher = useCallback(
    voucher => {
      if (cartLocked) {
        showToast({
          severity: 'warning',
          message:
            'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Gutscheine anzuwenden.',
        });
        return;
      }
      CartStateManager.applyVoucher(cartItems, appliedVouchers, voucher, setAppliedVouchers);
      showToast({ severity: 'success', message: 'Gutschein erfolgreich angewendet!' });
    },
    [cartItems, appliedVouchers, cartLocked, showToast]
  );

  const handleRemoveVoucher = useCallback(
    voucherId => {
      if (cartLocked) {
        showToast({
          severity: 'warning',
          message:
            'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Änderungen vorzunehmen.',
        });
        return;
      }
      CartStateManager.removeVoucher(cartItems, appliedVouchers, voucherId, setAppliedVouchers);
    },
    [cartItems, appliedVouchers, cartLocked, showToast]
  );

  const handlePaymentModalOpen = useCallback(() => {
    setPaymentModalOpen(true);
    setCashReceived((Math.round(total * 100) / 100).toFixed(2));
  }, [total]);

  const handlePaymentModalClose = useCallback(() => {
    setPaymentModalOpen(false);
  }, []);

  const handlePaymentMethodChange = useCallback(event => {
    setPaymentMethod(event.target.value);
  }, []);

  const handleCashReceivedChange = useCallback(event => {
    setCashReceived(event.target.value);
  }, []);

  const handleCardDetailsChange = useCallback((field, value) => {
    setCardDetails(prev => ({ ...prev, [field]: value }));
  }, []);

  const handlePaymentSubmit = useCallback(async () => {
    try {
      const paymentResult = await processPayment({
        cartItems,
        total,
        subtotal,
        paymentMethod,
        cashReceived,
        cardDetails,
        appliedVouchers,
        voucherDiscount,
        appliedDeposits,
        depositCredit,
        productDiscount,
        showToast,
        setReceiptReady,
        setPaymentModalOpen,
        setPaymentLoading,
      });

      setCartLocked(true);
      console.log('Payment result received:', paymentResult);

      if (paymentResult && paymentResult.success) {
        console.log('Payment successful, preparing to print receipt');
        // Print receipt automatically
        try {
          // Only check status if it hasn't been checked yet
          if (!printerStatusChecked) {
            const isConnected = await checkPrinterStatus();
            if (!isConnected) {
              showToast({
                severity: 'warning',
                message: 'Drucker ist nicht verbunden. Versuche trotzdem den Beleg zu drucken...',
              });
            }
          }

          // Create receipt data with all necessary transaction information
          const receiptData = {
            cartItems,
            total,
            subtotal,
            voucherDiscount,
            giftCardPayment,
            depositCredit,
            paymentMethod,
            cashReceived,
            cardDetails,
            productDiscount,
            transactionId:
              paymentResult.transactionId ||
              paymentResult.id ||
              `TR-${Date.now().toString().slice(-6)}`,
            date: new Date().toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }),
          };

          console.log('Printing receipt with data:', JSON.stringify(receiptData));
          const printResult = await printReceipt(receiptData);
          console.log('Print result:', printResult);

          showToast({
            severity: 'success',
            message: 'Beleg wurde automatisch gedruckt.',
          });
        } catch (err) {
          console.error('Error printing receipt:', err);
          showToast({
            severity: 'error',
            message: `Fehler beim Drucken: ${err.message}`,
          });
        }

        setTimeout(() => {
          fetchProducts();
          showToast({
            severity: 'info',
            message: 'Produktbestände wurden aktualisiert.',
          });
        }, 500);
      } else {
        console.error('Payment failed or was cancelled:', paymentResult?.error || 'Unknown error');
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      showToast({
        severity: 'error',
        message: `Zahlungsfehler: ${error.message || 'Unbekannter Fehler'}`,
      });
    }
  }, [
    cartItems,
    total,
    subtotal,
    paymentMethod,
    cashReceived,
    cardDetails,
    appliedVouchers,
    voucherDiscount,
    giftCardPayment,
    appliedDeposits,
    depositCredit,
    productDiscount,
    showToast,
    fetchProducts,
    printReceipt,
    checkPrinterStatus,
    printerStatusChecked,
  ]);

  const handleCheckPrinterStatus = useCallback(async () => {
    try {
      const isConnected = await checkPrinterStatus();
      if (isConnected) {
        showToast({
          severity: 'success',
          message: 'Drucker ist verbunden und bereit.',
        });
      } else {
        showToast({
          severity: 'warning',
          message: 'Drucker ist nicht verbunden. Bitte überprüfen Sie die Verbindung.',
        });
      }
      return isConnected;
    } catch (err) {
      console.error('Error checking printer status:', err);
      showToast({
        severity: 'error',
        message: `Fehler bei der Druckerprüfung: ${err.message}`,
      });
      return false;
    }
  }, [checkPrinterStatus, showToast]);

  const handlePrintReceipt = useCallback(async () => {
    try {
      // Only check status if it hasn't been checked yet
      if (!printerStatusChecked) {
        console.log('Printer status not checked yet, checking now...');
        const isConnected = await checkPrinterStatus();
        if (!isConnected) {
          showToast({
            severity: 'warning',
            message: 'Drucker ist nicht verbunden. Versuche trotzdem zu drucken...',
          });
        } else {
          console.log('Printer is connected and ready');
        }
      } else {
        console.log(
          'Printer status already checked:',
          isPrinterConnected ? 'connected' : 'not connected'
        );
      }

      // Use the same format for manual receipt printing
      const receiptData = {
        cartItems,
        total,
        subtotal,
        voucherDiscount,
        giftCardPayment,
        depositCredit,
        paymentMethod,
        cashReceived,
        cardDetails,
        productDiscount,
        transactionId: `TR-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      console.log('Manually printing receipt with data:', JSON.stringify(receiptData));
      const printResult = await printReceipt(receiptData);
      console.log('Manual print result:', printResult);

      showToast({
        severity: 'success',
        message: 'Beleg wird gedruckt...',
      });
    } catch (err) {
      console.error('Error manually printing receipt:', err);
      showToast({
        severity: 'error',
        message: `Fehler beim Drucken: ${err.message}`,
      });
    }
  }, [
    cartItems,
    total,
    subtotal,
    voucherDiscount,
    giftCardPayment,
    depositCredit,
    paymentMethod,
    cashReceived,
    productDiscount,
    printReceipt,
    showToast,
    checkPrinterStatus,
    printerStatusChecked,
    isPrinterConnected,
  ]);

  const handleNewTransaction = useCallback(() => {
    handleClearCart();
    setReceiptReady(false);
    setPaymentMethod('cash');
    setCashReceived('');
    setError(null);
    setCartLocked(false);
    fetchProducts();
  }, [handleClearCart, fetchProducts]);

  const handleRedeemVoucherDialog = useCallback(() => {
    if (cartLocked) {
      showToast({
        severity: 'warning',
        message:
          'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Gutscheine einzulösen.',
      });
      return;
    }
    setRedeemVoucherDialogOpen(true);
  }, [cartLocked, showToast]);

  const handleRedeemVoucherDialogClose = useCallback(() => {
    setRedeemVoucherDialogOpen(false);
  }, []);

  const handleVoucherManagementDialog = useCallback(() => {
    if (cartLocked) {
      showToast({
        severity: 'warning',
        message:
          'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Gutscheine zu verwalten.',
      });
      return;
    }
    setVoucherManagementDialogOpen(true);
  }, [cartLocked, showToast]);

  const handleVoucherManagementDialogClose = useCallback(() => {
    setVoucherManagementDialogOpen(false);
  }, []);

  const handleRedeemDepositDialogOpen = useCallback(() => {
    if (cartLocked) {
      showToast({
        severity: 'warning',
        message:
          'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Pfand einzulösen.',
      });
      return;
    }
    setRedeemDepositDialogOpen(true);
  }, [cartLocked, showToast]);

  const handleRedeemDepositDialogClose = useCallback(() => {
    setRedeemDepositDialogOpen(false);
  }, []);

  const handleDepositRedeemed = useCallback(
    depositReceipt => {
      if (cartLocked) {
        showToast({
          severity: 'warning',
          message:
            'Der Warenkorb ist gesperrt. Starten Sie eine neue Transaktion, um Pfand einzulösen.',
        });
        return;
      }
      // Check if the deposit receipt is already applied
      if (appliedDeposits.some(d => d.id === depositReceipt.id)) {
        showToast({
          severity: 'info',
          message: 'Dieser Pfandbon wurde bereits eingelöst.',
        });
        return;
      }

      handleDepositRedemption({
        depositReceipt,
        appliedDeposits,
        setAppliedDeposits,
        setDepositCredit,
        setRedeemDepositDialogOpen, // This might not be needed here, but kept for consistency with manual redemption
        showToast,
      });
    },
    [appliedDeposits, cartLocked, showToast, handleDepositRedemption] // Added handleDepositRedemption dependency
  );

  useEffect(() => {
    enableScanner();
    // Optional: Disable scanner when component unmounts
    return () => {
      // Consider if disabling is always desired. Maybe only if it was enabled by this component?
      // disableScanner();
    };
  }, [enableScanner]);

  // Helper function for product lookup to avoid code duplication
  const handleProductLookup = useCallback(
    async code => {
      console.log(`SalesScreen: Fetching product with barcode ${code}.`);
      try {
        // Get product with stock calculation
        const product = await ProductService.getProductById(code, true);
        if (product && product.id) {
          console.log(`SalesScreen: Found product ${product.name || product.id}. Adding to cart.`);
          handleAddToCart(product);
          return true;
        } else {
          // API returned success but no product?
          console.warn(`SalesScreen: Product lookup for ${code} returned empty.`);
          showToast({
            severity: 'warning',
            message: `Produkt mit Code ${code} nicht gefunden.`,
          });
          return false;
        }
      } catch (err) {
        console.error(`SalesScreen: Error fetching product ${code}:`, err);
        // Handle product lookup errors
        const errorMsg =
          err.response?.status === 404
            ? `Produkt mit Code ${code} nicht gefunden.`
            : `Fehler beim Abrufen des Produkts: ${err.message}`;
        showToast({ severity: 'error', message: errorMsg });
        throw err; // Re-throw to handle in the calling function
      }
    },
    [ProductService, handleAddToCart, showToast]
  ); // Add dependencies

  // Add handleProductLookup to useEffect dependencies
  useEffect(() => {
    // Check if there is a new scanned value
    if (scannedValue) {
      // Use an async IIFE to handle the async checks
      (async () => {
        let processed = false; // Flag to ensure scan is processed only once
        try {
          // Attempt to fetch as deposit receipt
          console.log(`SalesScreen: Checking if ${scannedValue} is a deposit receipt.`);
          const depositReceipt = await DepositService.getDepositReceiptById(scannedValue);
          // Check if depositReceipt is valid (not null/undefined and has an id)
          if (depositReceipt && depositReceipt.id) {
            console.log(`SalesScreen: ${scannedValue} is a deposit receipt. Redeeming.`);
            handleDepositRedeemed(depositReceipt);
            showToast({
              severity: 'success',
              message: `Pfandbon ${depositReceipt.id} erfolgreich gescannt und eingelöst.`,
            });
            processed = true;
          } else {
            // This case might not be reachable if getDepositReceiptById throws 404
            console.log(
              `SalesScreen: ${scannedValue} is not a deposit receipt (API returned non-error empty). Checking as product.`
            );
            // Try as product if deposit receipt returned empty result
            await handleProductLookup(scannedValue);
            processed = true;
          }
        } catch (err) {
          console.log(`SalesScreen: Deposit receipt error:`, err);
          // Verbesserte Erkennung von 404 Fehlern
          // Check if the error indicates "Not Found", either by status code or message content
          if (
            err.response?.status === 404 ||
            err.message?.toLowerCase().includes('not found') ||
            err.message?.toLowerCase().includes('nicht gefunden')
          ) {
            console.log(
              `SalesScreen: ${scannedValue} is not a deposit receipt (404). Checking as product.`
            );
            // Not a deposit receipt, try fetching as a product
            try {
              await handleProductLookup(scannedValue);
              processed = true;
            } catch (productErr) {
              // Log this but don't show another toast - already handled in handleProductLookup
              console.error(`SalesScreen: Product lookup failed:`, productErr);
              processed = true;
            }
          } else {
            // Handle other potential errors during deposit check (e.g., network issues)
            console.error(`SalesScreen: Error checking deposit receipt ${scannedValue}:`, err);
            showToast({
              severity: 'error',
              message: `Fehler beim Überprüfen des Pfandbons: ${err.message}`,
            });
            // Auch bei anderen Fehlern Produkt versuchen
            try {
              console.log(`SalesScreen: Attempting product lookup after deposit error.`);
              await handleProductLookup(scannedValue);
              processed = true;
            } catch (productErr) {
              console.error(`SalesScreen: Product lookup also failed:`, productErr);
              processed = true; // Mark as processed even on error
            }
          }
        } finally {
          // Always reset the scan state in the context after processing
          console.log(
            `SalesScreen: Resetting scan state for ${scannedValue}. Processed: ${processed}`
          );
          resetScan();
        }
      })();
    }
  }, [
    scannedValue,
    handleDepositRedeemed,
    resetScan,
    showToast,
    DepositService,
    handleProductLookup,
  ]);

  useEffect(() => {
    if (scanError) {
      showToast({
        severity: 'error',
        message: scanError,
      });
      resetScan();
    }
  }, [scanError, showToast, resetScan]);

  return (
    <Box
      sx={{
        height: '100%',
        background: theme.palette.background.default,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        pt: 2,
      }}
    >
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2 }}>
          <SalesMainContent
            loading={loading}
            error={error}
            productsByCategory={productsByCategory}
            cartItems={cartItems}
            appliedVouchers={appliedVouchers}
            subtotal={subtotal}
            voucherDiscount={voucherDiscount}
            depositCredit={depositCredit}
            giftCardPayment={giftCardPayment}
            total={total}
            receiptReady={receiptReady}
            cartUndoEnabled={cartUndoEnabled && !cartLocked}
            cartRedoEnabled={cartRedoEnabled && !cartLocked}
            cartLocked={cartLocked}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onDeleteFromCart={handleDeleteFromCart}
            onClearCart={handleClearCart}
            onPayment={handlePaymentModalOpen}
            onPrintReceipt={handlePrintReceipt}
            onNewTransaction={handleNewTransaction}
            onRemoveVoucher={handleRemoveVoucher}
            onRedeemVoucher={handleRedeemVoucherDialog}
            onManageVouchers={handleVoucherManagementDialog}
            onRedeemDeposit={handleRedeemDepositDialogOpen}
            onUndoCartState={handleUndoCartState}
            onRedoCartState={handleRedoCartState}
            productDiscount={productDiscount}
          />
        </Box>
      </Container>

      <DialogManager
        paymentModalOpen={paymentModalOpen}
        onPaymentModalClose={handlePaymentModalClose}
        onPaymentSubmit={handlePaymentSubmit}
        total={total}
        cartItems={cartItems}
        voucherDiscount={voucherDiscount}
        depositCredit={depositCredit}
        giftCardPayment={giftCardPayment}
        appliedVouchers={appliedVouchers}
        paymentMethod={paymentMethod}
        cashReceived={cashReceived}
        cardDetails={cardDetails}
        onPaymentMethodChange={handlePaymentMethodChange}
        onCashReceivedChange={handleCashReceivedChange}
        onCardDetailsChange={handleCardDetailsChange}
        change={change}
        paymentLoading={paymentLoading}
        redeemVoucherDialogOpen={redeemVoucherDialogOpen}
        onRedeemVoucherDialogClose={handleRedeemVoucherDialogClose}
        onVoucherRedeemed={handleApplyVoucher}
        voucherManagementDialogOpen={voucherManagementDialogOpen}
        onVoucherManagementDialogClose={handleVoucherManagementDialogClose}
        redeemDepositDialogOpen={redeemDepositDialogOpen}
        onRedeemDepositDialogClose={handleRedeemDepositDialogClose}
        onDepositRedeemed={handleDepositRedeemed}
        appliedDepositIds={appliedDeposits.map(deposit => deposit.id)}
      />
    </Box>
  );
};

export default SalesScreen;
