import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
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
import { ProductService, CartService } from '../services';
import { useToast } from '../components/ui/feedback';

// Animation variant
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

  // --- State ---
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

  // Cart state management
  const [cartUndoEnabled, setCartUndoEnabled] = useState(false);
  const [cartRedoEnabled, setCartRedoEnabled] = useState(false);
  const [receiptReady, setReceiptReady] = useState(false);

  // Payment related state
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

  // Dialog state
  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [redeemDepositDialogOpen, setRedeemDepositDialogOpen] = useState(false);

  // --- Data Fetching ---
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const productData = await ProductService.getProducts({ page: 0, size: 100 });
      // Show all products regardless of stock quantity
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
          // Show all products regardless of stock quantity
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

  // --- Calculations ---
  const cartService = useMemo(() => CartService, []);

  const subtotal = useMemo(() => {
    return cartService.calculateSubtotal(cartItems);
  }, [cartItems, cartService]);

  const productDiscount = useMemo(() => {
    return cartService.calculateTotalDiscount(cartItems);
  }, [cartItems, cartService]);

  useEffect(() => {
    const calculatedDiscount = calculateVoucherDiscount(subtotal, appliedVouchers);
    setVoucherDiscount(calculatedDiscount);

    const afterDiscountTotal = subtotal - calculatedDiscount;
    const calculatedGiftCardPayment = calculateGiftCardPayment(afterDiscountTotal, appliedVouchers);
    setGiftCardPayment(calculatedGiftCardPayment);
  }, [subtotal, appliedVouchers]);

  const total = useMemo(() => {
    const calculatedTotal = subtotal - voucherDiscount - depositCredit - giftCardPayment;
    return calculatedTotal > 0 ? calculatedTotal : 0;
  }, [subtotal, voucherDiscount, depositCredit, giftCardPayment]);

  const change = useMemo(() => {
    if (paymentMethod !== 'cash' || !cashReceived) return 0;
    const cashValue = parseFloat(cashReceived);
    const roundedTotal = Math.round(total * 100) / 100;
    return cashValue > roundedTotal ? Math.round((cashValue - roundedTotal) * 100) / 100 : 0;
  }, [paymentMethod, cashReceived, total]);

  // Monitor undo/redo availability
  useEffect(() => {
    const checkUndoRedoState = () => {
      setCartUndoEnabled(CartStateManager.canUndoCartState() || false);
      setCartRedoEnabled(CartStateManager.canRedoCartState() || false);
    };

    checkUndoRedoState();
    const interval = setInterval(checkUndoRedoState, 500);
    return () => clearInterval(interval);
  }, [cartItems, appliedVouchers]);

  // --- Handlers ---
  // Cart operations
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

  // Voucher operations
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

  // Payment operations
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
      showToast,
      setReceiptReady,
      setPaymentModalOpen,
      setPaymentLoading,
    });

    // Lock the cart after successful payment
    setCartLocked(true);

    // Reload product inventory after successful payment
    if (paymentResult && paymentResult.success) {
      // Short delay to ensure backend processing is complete
      setTimeout(() => {
        fetchProducts();
        showToast({
          severity: 'info',
          message: 'Produktbestände wurden aktualisiert.',
        });
      }, 500);
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
    showToast,
    fetchProducts,
  ]);

  const handlePrintReceipt = useCallback(() => {
    alert('Rechnung wird gedruckt...');
  }, []);

  const handleNewTransaction = useCallback(() => {
    handleClearCart();
    setReceiptReady(false);
    setPaymentMethod('cash');
    setCashReceived('');
    setError(null);
    setCartLocked(false);

    // Reload products for the new transaction
    fetchProducts();
  }, [handleClearCart, fetchProducts]);

  // Dialog handlers
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

  // Deposit handlers
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
      handleDepositRedemption({
        depositReceipt,
        appliedDeposits,
        setAppliedDeposits,
        setDepositCredit,
        setRedeemDepositDialogOpen,
        showToast,
      });
    },
    [appliedDeposits, cartLocked, showToast]
  );

  // --- Render ---
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
