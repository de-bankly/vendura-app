import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Import components and utilities
import {
  SalesHeader,
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
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [redeemDepositDialogOpen, setRedeemDepositDialogOpen] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const productData = await ProductService.getProducts({ page: 0, size: 100 });
        if (isMounted) {
          const availableProducts = (productData.content || []).filter(
            product => product.stockQuantity > 0
          );
          setProducts(availableProducts);
          setProductsByCategory(ProductService.groupByCategory(availableProducts));
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

    fetchProducts();
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
      CartStateManager.addToCart(cartItems, appliedVouchers, product, setCartItems);
    },
    [cartItems, appliedVouchers]
  );

  const handleRemoveFromCart = useCallback(
    productId => {
      CartStateManager.removeFromCart(cartItems, appliedVouchers, productId, setCartItems);
    },
    [cartItems, appliedVouchers]
  );

  const handleDeleteFromCart = useCallback(
    productId => {
      CartStateManager.deleteFromCart(cartItems, appliedVouchers, productId, setCartItems);
    },
    [cartItems, appliedVouchers]
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
    CartStateManager.undoCartState(setCartItems, setAppliedVouchers);
  }, []);

  const handleRedoCartState = useCallback(() => {
    CartStateManager.redoCartState(setCartItems, setAppliedVouchers);
  }, []);

  // Voucher operations
  const handleApplyVoucher = useCallback(
    voucher => {
      CartStateManager.applyVoucher(cartItems, appliedVouchers, voucher, setAppliedVouchers);
      showToast({ severity: 'success', message: 'Gutschein erfolgreich angewendet!' });
    },
    [cartItems, appliedVouchers, showToast]
  );

  const handleRemoveVoucher = useCallback(
    voucherId => {
      CartStateManager.removeVoucher(cartItems, appliedVouchers, voucherId, setAppliedVouchers);
    },
    [cartItems, appliedVouchers]
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
    processPayment({
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
      setSuccessSnackbarOpen,
      setPaymentLoading,
    });
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
  ]);

  const handlePrintReceipt = useCallback(() => {
    alert('Rechnung wird gedruckt...');
  }, []);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSuccessSnackbarOpen(false);
  }, []);

  const handleNewTransaction = useCallback(() => {
    handleClearCart();
    setReceiptReady(false);
    setPaymentMethod('cash');
    setCashReceived('');
    setError(null);
  }, [handleClearCart]);

  // Dialog handlers
  const handleRedeemVoucherDialog = useCallback(() => {
    setRedeemVoucherDialogOpen(true);
  }, []);

  const handleRedeemVoucherDialogClose = useCallback(() => {
    setRedeemVoucherDialogOpen(false);
  }, []);

  const handleVoucherManagementDialog = useCallback(() => {
    setVoucherManagementDialogOpen(true);
  }, []);

  const handleVoucherManagementDialogClose = useCallback(() => {
    setVoucherManagementDialogOpen(false);
  }, []);

  // Deposit handlers
  const handleRedeemDepositDialogOpen = useCallback(() => {
    setRedeemDepositDialogOpen(true);
  }, []);

  const handleRedeemDepositDialogClose = useCallback(() => {
    setRedeemDepositDialogOpen(false);
  }, []);

  const handleDepositRedeemed = useCallback(
    depositReceipt => {
      handleDepositRedemption({
        depositReceipt,
        appliedDeposits,
        setAppliedDeposits,
        setDepositCredit,
        setRedeemDepositDialogOpen,
        showToast,
      });
    },
    [appliedDeposits, showToast]
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
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <SalesHeader />
        </motion.div>

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
            cartUndoEnabled={cartUndoEnabled}
            cartRedoEnabled={cartRedoEnabled}
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
        successSnackbarOpen={successSnackbarOpen}
        onSnackbarClose={handleSnackbarClose}
      />
    </Box>
  );
};

export default SalesScreen;
