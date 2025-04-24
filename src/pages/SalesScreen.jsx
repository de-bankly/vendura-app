import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';

import {
  SalesMainContent,
  DialogManager,
  calculateVoucherDiscount,
  calculateGiftCardPayment,
  CartStateManager,
  processPayment,
  handleDepositRedemption,
} from '../components/sales';
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

/**
 * @component SalesScreen
 * @description Manages the point of sale interface, including product display,
 * cart management, payment processing, voucher/deposit redemption, and receipt printing.
 */
const SalesScreen = () => {
  // Hooks
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

  // Product State
  const [products, setProducts] = useState([]);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart State
  const [cartItems, setCartItems] = useState([]);
  const [cartLocked, setCartLocked] = useState(false);
  const [cartUndoEnabled, setCartUndoEnabled] = useState(CartStateManager.canUndoCartState());
  const [cartRedoEnabled, setCartRedoEnabled] = useState(CartStateManager.canRedoCartState());

  // Voucher State
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const [voucherDiscount, setVoucherDiscount] = useState(0);

  // Deposit State
  const [appliedDeposits, setAppliedDeposits] = useState([]);
  const [depositCredit, setDepositCredit] = useState(0);

  // Gift Card State (derived from vouchers)
  const [giftCardPayment, setGiftCardPayment] = useState(0);

  // Payment State
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

  // Dialog State
  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [redeemDepositDialogOpen, setRedeemDepositDialogOpen] = useState(false);

  // Transaction State
  const [lastTransactionId, setLastTransactionId] = useState(null);
  const [receiptReady, setReceiptReady] = useState(false);

  // Memoized Calculations
  const cartService = useMemo(() => CartService, []);

  const subtotal = useMemo(() => {
    return cartService.calculateSubtotal(cartItems);
  }, [cartItems, cartService]);

  const productDiscount = useMemo(() => {
    return cartService.calculateTotalDiscount(cartItems);
  }, [cartItems, cartService]);

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

  // Callbacks - Utility
  /**
   * @function resetScreenState
   * @description Resets state specific to a single transaction lifecycle.
   */
  const resetScreenState = useCallback(() => {
    setCartLocked(false);
    setReceiptReady(false);
    setLastTransactionId(null);
    setPaymentMethod('cash');
    setCashReceived('');
    setError(null);
  }, []);

  /**
   * @function refetchProductsAfterSale
   * @description Fetches updated product data (e.g., stock levels) after a sale.
   */
  const refetchProductsAfterSale = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await ProductService.getProducts({
        page: 0,
        size: 100,
      });
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

  // Callbacks - Cart Management
  /**
   * @function handleAddToCart
   * @description Adds a product to the cart or increments its quantity.
   * @param {object} product - The product object to add.
   */
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

  /**
   * @function handleRemoveFromCart
   * @description Decrements the quantity of a product in the cart.
   * @param {string|number} productId - The ID of the product to remove.
   */
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

  /**
   * @function handleDeleteFromCart
   * @description Completely removes a product from the cart, regardless of quantity.
   * @param {string|number} productId - The ID of the product to delete.
   */
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

  /**
   * @function handleClearCart
   * @description Clears the entire cart, applied vouchers/deposits, and resets transaction state.
   */
  const handleClearCart = useCallback(() => {
    CartStateManager.clearCart(
      setCartItems,
      setAppliedVouchers,
      setAppliedDeposits,
      setVoucherDiscount,
      setDepositCredit,
      setCardDetails,
      resetScreenState // Resets screen-specific state
    );
  }, [resetScreenState]);

  /**
   * @function handleUndoCartState
   * @description Reverts the cart and applied vouchers to the previous state.
   */
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

  /**
   * @function handleRedoCartState
   * @description Re-applies the previously undone cart state change.
   */
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

  // Callbacks - Voucher Management
  /**
   * @function handleApplyVoucher
   * @description Applies a voucher to the current cart state.
   * @param {object} voucher - The voucher object to apply.
   */
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
      showToast({
        severity: 'success',
        message: 'Gutschein erfolgreich angewendet!',
      });
    },
    [cartItems, appliedVouchers, cartLocked, showToast]
  );

  /**
   * @function handleRemoveVoucher
   * @description Removes an applied voucher from the cart state.
   * @param {string|number} voucherId - The ID of the voucher to remove.
   */
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

  // Callbacks - Deposit Management
  /**
   * @function handleDepositRedeemed
   * @description Processes a redeemed deposit receipt, updating applied deposits and credit.
   * @param {object} depositReceipt - The deposit receipt object.
   */
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
    [appliedDeposits, cartLocked, showToast] // handleDepositRedemption is imported, assumed stable
  );

  // Callbacks - Payment
  /**
   * @function handlePaymentModalOpen
   * @description Opens the payment modal and pre-fills cash received with the total amount.
   */
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

  /**
   * @function printTransactionReceipt
   * @description Prints the receipt for the current or a specified transaction.
   * @param {string|null} [transactionIdOverride=null] - Optional transaction ID to print. Defaults to lastTransactionId.
   */
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

  /**
   * @function handlePaymentSubmit
   * @description Processes the payment, locks the cart, prints the receipt, and updates product stock.
   */
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
        setPaymentLoading: () => {}, // Internal state handled by paymentLoading state
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

        setTimeout(refetchProductsAfterSale, 500); // Refetch products after a short delay
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
    appliedDeposits,
    depositCredit,
    productDiscount,
    showToast,
    printTransactionReceipt,
    refetchProductsAfterSale,
    // Setters:
    setReceiptReady,
    setPaymentModalOpen,
    setCartLocked,
    setLastTransactionId,
  ]);

  /**
   * @function handlePrintReceipt
   * @description Manually triggers printing the receipt for the last completed transaction.
   */
  const handlePrintReceipt = useCallback(async () => {
    await printTransactionReceipt();
  }, [printTransactionReceipt]);

  /**
   * @function handleNewTransaction
   * @description Clears the cart and resets the screen state to start a new transaction.
   */
  const handleNewTransaction = useCallback(() => {
    handleClearCart(); // Clears cart and resets screen state via resetScreenState
  }, [handleClearCart]);

  // Callbacks - Dialog Openers
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

  // Callbacks - Dialog Closers
  const handleRedeemVoucherDialogClose = useCallback(() => {
    setRedeemVoucherDialogOpen(false);
  }, []);

  const handleVoucherManagementDialogClose = useCallback(() => {
    setVoucherManagementDialogOpen(false);
  }, []);

  const handleRedeemDepositDialogClose = useCallback(() => {
    setRedeemDepositDialogOpen(false);
  }, []);

  // Callbacks - Scanner / Lookup
  /**
   * @function handleProductLookup
   * @description Looks up a product by its code (ID/barcode) and adds it to the cart if found.
   * @param {string} code - The product code to look up.
   * @returns {Promise<boolean>} True if the product was found and added, false otherwise.
   */
  const handleProductLookup = useCallback(
    async code => {
      try {
        const product = await ProductService.getProductById(code, true); // Assume true means lookup by barcode/ID
        if (product && product.id) {
          handleAddToCart(product);
          return true;
        } else {
          // ProductService might return null/undefined if not found without throwing
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
    [handleAddToCart, showToast] // ProductService is assumed stable
  );

  // Effects
  /**
   * Effect for initial product loading.
   */
  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await ProductService.getProducts({
          page: 0,
          size: 100,
        });
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
  }, []); // Empty dependency array ensures this runs only once on mount

  /**
   * Effect to calculate voucher and gift card impacts when cart or vouchers change.
   */
  useEffect(() => {
    const afterProductDiscountTotal = subtotal - productDiscount;

    const calculatedDiscount = calculateVoucherDiscount(afterProductDiscountTotal, appliedVouchers);
    setVoucherDiscount(calculatedDiscount);

    const afterDiscountTotal = afterProductDiscountTotal - calculatedDiscount;
    const calculatedGiftCardPayment = calculateGiftCardPayment(afterDiscountTotal, appliedVouchers);
    setGiftCardPayment(calculatedGiftCardPayment);
  }, [subtotal, productDiscount, appliedVouchers]);

  /**
   * Effect to update undo/redo button states based on CartStateManager.
   */
  useEffect(() => {
    setCartUndoEnabled(CartStateManager.canUndoCartState());
    setCartRedoEnabled(CartStateManager.canRedoCartState());
  }, [cartItems, appliedVouchers]); // Re-check whenever cart or vouchers change

  /**
   * Effect to enable the barcode scanner on component mount.
   */
  useEffect(() => {
    enableScanner();
  }, [enableScanner]);

  /**
   * Effect to handle scanned barcode values.
   * Attempts to redeem as deposit first, then looks up as product.
   */
  useEffect(() => {
    if (scannedValue) {
      (async () => {
        let handled = false;
        try {
          // 1. Try to get deposit receipt
          const depositReceipt = await DepositService.getDepositReceiptById(scannedValue);

          if (depositReceipt && depositReceipt.data?.id) {
            handleDepositRedeemed(depositReceipt.data);
            handled = true;
          } else {
            // API returned success but no valid receipt data
            console.warn(
              `SalesScreen: Deposit check for ${scannedValue} returned no receipt data. Assuming not a deposit.`
            );
          }
        } catch (err) {
          const isNotFound =
            err.response?.status === 404 ||
            err.message?.toLowerCase().includes('not found') ||
            err.message?.toLowerCase().includes('nicht gefunden');

          if (!isNotFound) {
            // Unexpected error during deposit check
            console.error(`SalesScreen: Error checking deposit receipt ${scannedValue}:`, err);
            showToast({
              severity: 'error',
              message: `Fehler beim Überprüfen des Codes ${scannedValue}: ${err.message}`,
            });
            handled = true; // Mark as handled to prevent product lookup after error
          }
          // If it IS a 404 Not Found, we proceed to product lookup below
        }

        // 2. If not handled as deposit (or deposit check resulted in 404), try product lookup
        if (!handled) {
          console.log(
            `SalesScreen: Code ${scannedValue} not redeemed as deposit, trying product lookup.`
          );
          await handleProductLookup(scannedValue);
          // handleProductLookup shows its own toasts for success/failure
        }

        resetScan(); // Reset scanner state regardless of outcome
      })();
    }
  }, [
    scannedValue,
    handleDepositRedeemed,
    handleProductLookup,
    showToast,
    resetScan,
    // DepositService is assumed stable
  ]);

  /**
   * Effect to display scanner errors.
   */
  useEffect(() => {
    if (scanError) {
      showToast({
        severity: 'error',
        message: scanError,
      });
      resetScan();
    }
  }, [scanError, showToast, resetScan]);

  // Render JSX
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
