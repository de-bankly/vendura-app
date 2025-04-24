import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Container, useTheme, Button, Alert, Typography } from '@mui/material';

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
import { ProductService, CartService, DepositService } from '../services';
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
  const [lastTransactionId, setLastTransactionId] = useState(null);

  const [cartUndoEnabled, setCartUndoEnabled] = useState(CartStateManager.canUndoCartState());
  const [cartRedoEnabled, setCartRedoEnabled] = useState(CartStateManager.canRedoCartState());
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
    setCartUndoEnabled(CartStateManager.canUndoCartState());
    setCartRedoEnabled(CartStateManager.canRedoCartState());
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

  // Define the reset logic for screen-specific state
  const resetScreenState = useCallback(() => {
    setCartLocked(false);
    setReceiptReady(false);
    setLastTransactionId(null);
    // Reset payment method and cash for new transactions
    setPaymentMethod('cash');
    setCashReceived('');
    setError(null);
  }, []); // No dependencies needed as it only calls setters

  const handleClearCart = useCallback(() => {
    CartStateManager.clearCart(
      setCartItems,
      setAppliedVouchers,
      setAppliedDeposits,
      setVoucherDiscount,
      setDepositCredit,
      setCardDetails,
      resetScreenState // Pass the reset function here
    );
    // No need to set states here anymore, handled by resetScreenState
  }, [resetScreenState]); // Add resetScreenState to dependencies

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

  const printTransactionReceipt = useCallback(
    async (transactionIdOverride = null) => {
      const transactionIdToPrint =
        transactionIdOverride || lastTransactionId || `MANUAL-${Date.now().toString().slice(-6)}`;
      try {
        if (!printerStatusChecked || !isPrinterConnected) {
          const isConnectedNow = await checkPrinterStatus();
          if (!isConnectedNow) {
            showToast({
              severity: 'warning',
              message: 'Drucker ist nicht verbunden. Versuche trotzdem zu drucken...',
            });
          }
        }

        const receiptData = {
          cartItems,
          total,
          subtotal,
          voucherDiscount,
          giftCardPayment,
          depositCredit,
          paymentMethod,
          cashReceived,
          productDiscount,
          transactionId: transactionIdToPrint,
          date: new Date().toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };

        await printReceipt(receiptData);

        showToast({
          severity: 'success',
          message: 'Beleg wird gedruckt...',
        });
      } catch (err) {
        showToast({
          severity: 'error',
          message: `Fehler beim Drucken: ${err.message}`,
        });
      }
    },
    [
      cartItems,
      total,
      subtotal,
      voucherDiscount,
      giftCardPayment,
      depositCredit,
      paymentMethod,
      cashReceived,
      productDiscount,
      lastTransactionId,
      printReceipt,
      showToast,
      checkPrinterStatus,
      printerStatusChecked,
      isPrinterConnected,
    ]
  );

  const refetchProductsAfterSale = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await ProductService.getProducts({ page: 0, size: 100 });
      const allProducts = productData.content || [];
      setProducts(allProducts);
      setProductsByCategory(ProductService.groupByCategory(allProducts));
      setLoading(false);
      showToast({
        severity: 'info',
        message: 'Produktbestände wurden aktualisiert.',
      });
    } catch (fetchErr) {
      setError(fetchErr.message || 'Fehler beim Aktualisieren der Produkte.');
      setLoading(false);
      showToast({
        severity: 'error',
        message: 'Fehler beim Aktualisieren der Produktbestände.',
      });
    }
  }, [showToast]);

  const handlePaymentSubmit = useCallback(async () => {
    setPaymentLoading(true);
    let paymentResult = null;
    try {
      paymentResult = await processPayment({
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
        setPaymentLoading: () => {},
      });

      if (paymentResult && paymentResult.success) {
        const transactionId =
          paymentResult.transactionId ||
          paymentResult.id ||
          `TR-${Date.now().toString().slice(-6)}`;
        setLastTransactionId(transactionId);
        setCartLocked(true);
        setReceiptReady(true);

        await printTransactionReceipt(transactionId);
        setPaymentModalOpen(false);

        setTimeout(refetchProductsAfterSale, 500);
      } else {
        showToast({
          severity: 'warning',
          message: `Zahlung fehlgeschlagen: ${paymentResult?.error || 'Unbekannter Fehler'}`,
        });
      }
    } catch (error) {
      showToast({
        severity: 'error',
        message: `Zahlungsfehler: ${error.message || 'Unbekannter Fehler'}`,
      });
    } finally {
      setPaymentLoading(false);
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
    printTransactionReceipt,
    refetchProductsAfterSale,
    setReceiptReady,
    setPaymentModalOpen,
    setPaymentLoading,
    setCartLocked,
    setLastTransactionId,
  ]);

  const handlePrintReceipt = useCallback(async () => {
    await printTransactionReceipt();
  }, [printTransactionReceipt]);

  const handleNewTransaction = useCallback(() => {
    // Simply call handleClearCart, which now includes resetting screen state
    handleClearCart();
    // No need for additional resets here
  }, [handleClearCart]);

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
        setRedeemDepositDialogOpen,
        showToast,
      });
    },
    [appliedDeposits, cartLocked, showToast, handleDepositRedemption]
  );

  useEffect(() => {
    enableScanner();
  }, [enableScanner]);

  const handleProductLookup = useCallback(
    async code => {
      try {
        const product = await ProductService.getProductById(code, true);
        if (product && product.id) {
          handleAddToCart(product);
          return true;
        } else {
          showToast({
            severity: 'warning',
            message: `Produkt mit Code ${code} nicht gefunden.`,
          });
          return false;
        }
      } catch (err) {
        const errorMsg =
          err.response?.status === 404
            ? `Produkt mit Code ${code} nicht gefunden.`
            : `Fehler beim Abrufen des Produkts: ${err.message}`;
        showToast({ severity: 'error', message: errorMsg });
        return false;
      }
    },
    [ProductService, handleAddToCart, showToast]
  );

  useEffect(() => {
    if (scannedValue) {
      (async () => {
        let processed = false;
        try {
          const depositReceipt = await DepositService.getDepositReceiptById(scannedValue);
          if (depositReceipt && depositReceipt.id) {
            handleDepositRedeemed(depositReceipt);
            showToast({
              severity: 'success',
              message: `Pfandbon ${depositReceipt.id} erfolgreich gescannt und eingelöst.`,
            });
            processed = true;
          } else {
            await handleProductLookup(scannedValue);
            processed = true;
          }
        } catch (err) {
          if (
            err.response?.status === 404 ||
            err.message?.toLowerCase().includes('not found') ||
            err.message?.toLowerCase().includes('nicht gefunden')
          ) {
            try {
              await handleProductLookup(scannedValue);
              processed = true;
            } catch (productErr) {
              console.error(`SalesScreen: Product lookup failed:`, productErr);
              processed = true;
            }
          } else {
            console.error(`SalesScreen: Error checking deposit receipt ${scannedValue}:`, err);
            showToast({
              severity: 'error',
              message: `Fehler beim Überprüfen des Pfandbons: ${err.message}`,
            });
            try {
              await handleProductLookup(scannedValue);
              processed = true;
            } catch (productErr) {
              console.error(`SalesScreen: Product lookup also failed:`, productErr);
              processed = true;
            }
          }
        } finally {
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
