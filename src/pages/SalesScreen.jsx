import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Alert as MuiAlert,
  CardContent,
  Slide,
  Snackbar,
  useTheme,
  alpha,
  Container,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { useToast, Chip } from '../components/ui/feedback';
import { ProductGrid, ShoppingCart, PaymentDialog, VoucherInputField } from '../components/sales';
import {
  RedeemVoucherDialog,
  VoucherManagementDialog,
  PurchaseVoucherDialog,
} from '../components/vouchers';
import { ProductService, CartService, SaleService } from '../services';
import { getUserFriendlyErrorMessage } from '../utils/errorUtils';
import TransactionService from '../services/TransactionService';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * SalesScreen component for the point-of-sale system
 * Displays products, cart, and payment options
 */
const SalesScreen = () => {
  const theme = useTheme();
  const { showToast } = useToast();

  // --- State Declarations ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // For initial product load
  const [error, setError] = useState(null); // For product load error
  const [productsByCategory, setProductsByCategory] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false); // Loading state for payment submission
  const [receiptReady, setReceiptReady] = useState(false);
  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [purchaseVoucherDialogOpen, setPurchaseVoucherDialogOpen] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [giftCardPayment, setGiftCardPayment] = useState(0);

  // --- Data Fetching ---
  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const productData = await ProductService.getProducts({ page: 0, size: 100 }); // Consider pagination/infinite load
        if (isMounted) {
          const products = productData.content || [];
          setProducts(products);
          const groupedProducts = ProductService.groupByCategory(products);
          setProductsByCategory(groupedProducts);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          // Use error message from service if available
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
    }; // Cleanup function
  }, []);

  // --- Memoized Calculations ---
  const subtotal = useMemo(() => CartService.calculateSubtotal(cartItems), [cartItems]);

  // Calculate product discount
  const productDiscount = useMemo(() => CartService.calculateTotalDiscount(cartItems), [cartItems]);

  // Calculate voucher discount
  const calculateVoucherDiscount = useCallback((subtotal, vouchers) => {
    if (!vouchers || vouchers.length === 0) return 0;

    // Get discount vouchers
    const discountVouchers = vouchers.filter(v => v.type === 'DISCOUNT_CARD');
    if (discountVouchers.length === 0) return 0;

    // For simplicity, we'll just use the first discount voucher
    // In a real implementation, you might want to stack discounts or use the highest one
    const discountVoucher = discountVouchers[0];
    const discountPercentage = parseFloat(discountVoucher.discountPercentage) || 0;

    // Calculate the actual discount amount, ensuring it's a valid number
    return subtotal * (discountPercentage / 100);
  }, []);

  // Calculate gift card payment
  const calculateGiftCardPayment = useCallback((afterDiscountTotal, vouchers) => {
    if (!vouchers || vouchers.length === 0) return 0;

    // Get gift card vouchers
    const giftCardVouchers = vouchers.filter(v => v.type === 'GIFT_CARD');
    if (giftCardVouchers.length === 0) return 0;

    // We now sum up the pre-specified amounts for each gift card
    let totalGiftCardPayment = 0;

    for (const voucher of giftCardVouchers) {
      // Only add gift cards with a specified amount
      const voucherAmount = parseFloat(voucher.amount) || 0;
      if (voucherAmount > 0) {
        totalGiftCardPayment += voucherAmount;
      }
    }

    // Make sure the total doesn't exceed the amount due
    return Math.min(totalGiftCardPayment, afterDiscountTotal);
  }, []);

  useEffect(() => {
    const calculatedDiscount = calculateVoucherDiscount(subtotal, appliedVouchers);
    setVoucherDiscount(calculatedDiscount);

    const afterDiscountTotal = subtotal - calculatedDiscount;
    const calculatedGiftCardPayment = calculateGiftCardPayment(afterDiscountTotal, appliedVouchers);
    setGiftCardPayment(calculatedGiftCardPayment);
  }, [subtotal, appliedVouchers, calculateVoucherDiscount, calculateGiftCardPayment]);

  const total = useMemo(
    () => Math.max(0, subtotal - voucherDiscount - giftCardPayment),
    [subtotal, voucherDiscount, giftCardPayment]
  );

  // Calculate change for cash payment
  const change = useMemo(() => {
    if (paymentMethod !== 'cash' || !cashReceived) {
      return 0;
    }
    const cashValue = parseFloat(cashReceived);
    return cashValue > total ? cashValue - total : 0;
  }, [paymentMethod, cashReceived, total]);

  // --- Callback Handlers ---
  const addToCart = useCallback(product => {
    setCartItems(prevItems => CartService.addToCart(prevItems, product));
  }, []);

  const removeFromCart = useCallback(productId => {
    setCartItems(prevItems => CartService.removeFromCart(prevItems, productId));
  }, []);

  const deleteFromCart = useCallback(productId => {
    setCartItems(prevItems => CartService.deleteFromCart(prevItems, productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedVouchers([]);
    setVoucherDiscount(0);
    setGiftCardPayment(0);
    setCardDetails({
      cardNumber: '',
      cardHolderName: '',
      expirationDate: '',
      cvv: '',
    });
  }, []);

  const handlePaymentModalOpen = useCallback(() => {
    setPaymentModalOpen(true);
    setCashReceived(total.toFixed(2));
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
    setCardDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePaymentComplete = useCallback(async () => {
    setPaymentLoading(true); // Indicate loading
    try {
      // Round the total for payment processing
      const roundedTotal = Math.round(total * 100) / 100;

      // Prepare transaction data for the backend
      const transactionData = {
        items: cartItems.map(item => {
          const itemData = {
            id: item.id,
            quantity: item.quantity,
            price: Math.round(item.price * 100) / 100,
          };

          // Add discount information if product has a discount
          if (item.hasDiscount && item.discountAmount) {
            itemData.discountEuro = Math.round(item.discountAmount * 100) / 100;
          }

          return itemData;
        }),
        subtotal: Math.round(subtotal * 100) / 100,
        totalProductDiscount: Math.round(productDiscount * 100) / 100,
        giftCards: appliedVouchers.filter(v => v.type === 'GIFT_CARD'),
        discountCards: appliedVouchers.filter(v => v.type === 'DISCOUNT_CARD'),
        voucherDiscount: Math.round(voucherDiscount * 100) / 100,
        giftCardPayment: Math.round(giftCardPayment * 100) / 100,
        total: roundedTotal,
        paymentMethod,
        cashReceived:
          paymentMethod === 'cash' ? Math.round(parseFloat(cashReceived) * 100) / 100 : undefined,
        change: paymentMethod === 'cash' ? Math.round(change * 100) / 100 : undefined,
        // If using card payment, we would include card details here
        cardDetails:
          paymentMethod === 'card'
            ? {
                cardNumber: cardDetails.cardNumber,
                cardHolderName: cardDetails.cardHolderName,
                expirationDate: cardDetails.expirationDate,
                cvv: cardDetails.cvv,
              }
            : undefined,
      };

      // Call the SaleService to process the sale
      const result = await SaleService.createSale(transactionData);
      console.log('Transaction complete:', result);

      // If successful, update UI and show success message
      setPaymentModalOpen(false);
      setReceiptReady(true);
      setSuccessSnackbarOpen(true);

      // Store the transaction result for receipt printing or future reference
      // This could be used to display a receipt or order confirmation
    } catch (error) {
      console.error('Payment failed:', error);
      showToast({
        severity: 'error',
        message: getUserFriendlyErrorMessage(error, 'Zahlung fehlgeschlagen'),
      });
      // Keep the payment dialog open so the user can try again
    } finally {
      setPaymentLoading(false); // Reset loading state
    }
  }, [
    cartItems,
    subtotal,
    appliedVouchers,
    voucherDiscount,
    giftCardPayment,
    total,
    paymentMethod,
    cashReceived,
    change,
    cardDetails,
    showToast,
    productDiscount,
  ]);

  const handlePrintReceipt = useCallback(() => {
    alert('Rechnung wird gedruckt...'); // Placeholder
  }, []);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessSnackbarOpen(false);
  }, []);

  const handleNewTransaction = useCallback(() => {
    clearCart();
    setReceiptReady(false);
    setPaymentMethod('cash');
    setCashReceived('');
    setError(null); // Clear any previous product load errors
    // Potentially refetch products if needed
  }, [clearCart]);

  const handleRedeemVoucherDialogOpen = useCallback(() => {
    setRedeemVoucherDialogOpen(true);
  }, []);

  const handleRedeemVoucherDialogClose = useCallback(() => {
    setRedeemVoucherDialogOpen(false);
  }, []);

  const handleVoucherManagementDialogOpen = useCallback(() => {
    setVoucherManagementDialogOpen(true);
  }, []);

  const handleVoucherManagementDialogClose = useCallback(() => {
    setVoucherManagementDialogOpen(false);
  }, []);

  const handlePurchaseVoucherDialogOpen = useCallback(() => {
    setPurchaseVoucherDialogOpen(true);
  }, []);

  const handlePurchaseVoucherDialogClose = useCallback(() => {
    setPurchaseVoucherDialogOpen(false);
  }, []);

  const handleVoucherApplied = useCallback(
    voucherData => {
      setAppliedVouchers(prev => [...prev, voucherData]);
      showToast({ severity: 'success', message: 'Gutschein erfolgreich angewendet!' });
    },
    [showToast]
  );

  const handleRemoveVoucher = useCallback(voucherId => {
    setAppliedVouchers(prev => prev.filter(v => v.id !== voucherId));
  }, []);

  // --- Render Logic ---
  return (
    <Box
      sx={{
        height: '100%', // Consider using calc(100vh - AppBarHeight) if needed
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(
          theme.palette.primary.light,
          0.1
        )} 100%)`,
        overflow: 'hidden', // Prevent outer scroll, inner components should scroll
        display: 'flex',
        flexDirection: 'column',
        pt: 2, // Add padding top
      }}
    >
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Page Header */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              }}
            >
              <PointOfSaleIcon
                sx={{
                  fontSize: 40,
                  mr: 2,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  p: 1,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                Verkaufsbildschirm
              </Typography>
            </Box>
          </motion.div>

          {/* Sales Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Cart Summary Card */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Warenkorb</Typography>
                      <Chip
                        size="small"
                        icon={<ShoppingCartIcon fontSize="small" />}
                        label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        color="primary"
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}
                    >
                      {(parseFloat(total) || 0).toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cartItems.length} Artikel
                      {cartItems.length !== 1 ? '' : ''} {/* Adjust grammar if needed */}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Product Summary Card */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Produkte</Typography>
                      <Chip
                        size="small"
                        icon={<InventoryIcon fontSize="small" />}
                        label={products.length}
                        color="success"
                      />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {Object.keys(productsByCategory).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kategorien
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Voucher Summary Card */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Gutscheine</Typography>
                      <Chip
                        size="small"
                        icon={<CardGiftcardIcon fontSize="small" />}
                        label={appliedVouchers.length}
                        color="info"
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}
                    >
                      {voucherDiscount.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rabatt angewendet
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2 }}>
          {' '}
          {/* Allow this box to grow and hide overflow */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <MuiAlert severity="error" sx={{ m: 2 }}>
              {error}
            </MuiAlert>
          ) : (
            <Grid container spacing={3} sx={{ height: '100%' }}>
              {/* Product Grid */}
              <Grid item xs={12} md={7} lg={8} sx={{ height: '100%' }}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%', // Take full height of grid item
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ProductGrid
                      productsByCategory={productsByCategory}
                      onProductSelect={addToCart}
                    />
                  </Paper>
                </motion.div>
              </Grid>

              {/* Shopping Cart */}
              <Grid item xs={12} md={5} lg={4} sx={{ height: '100%' }}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%', // Take full height of grid item
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ShoppingCart
                      cartItems={cartItems}
                      appliedVouchers={appliedVouchers}
                      subtotal={subtotal}
                      voucherDiscount={voucherDiscount}
                      total={total}
                      productDiscount={productDiscount}
                      receiptReady={receiptReady}
                      onAddItem={addToCart}
                      onRemoveItem={removeFromCart}
                      onDeleteItem={deleteFromCart}
                      onClearCart={clearCart}
                      onPayment={handlePaymentModalOpen}
                      onPrintReceipt={handlePrintReceipt}
                      onNewTransaction={handleNewTransaction}
                      onRedeemVoucher={handleRedeemVoucherDialogOpen}
                      onManageVouchers={handleVoucherManagementDialogOpen}
                      onPurchaseVoucher={handlePurchaseVoucherDialogOpen}
                      onRemoveVoucher={handleRemoveVoucher}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>

      {/* Dialogs and Snackbar */}
      <PaymentDialog
        open={paymentModalOpen}
        onClose={handlePaymentModalClose}
        onComplete={handlePaymentComplete}
        total={total}
        cartItemsCount={cartItems.length}
        voucherDiscount={voucherDiscount}
        appliedVouchers={appliedVouchers}
        giftCardPayment={giftCardPayment}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={handlePaymentMethodChange}
        cashReceived={cashReceived}
        onCashReceivedChange={handleCashReceivedChange}
        cardDetails={cardDetails}
        onCardDetailsChange={handleCardDetailsChange}
        change={change}
        TransitionComponent={Transition}
        loading={paymentLoading} // Pass loading state
      />

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          elevation={6} // Add elevation for visibility
          sx={{ width: '100%' }}
        >
          Zahlung erfolgreich abgeschlossen!
        </MuiAlert>
      </Snackbar>

      <RedeemVoucherDialog
        open={redeemVoucherDialogOpen}
        onClose={handleRedeemVoucherDialogClose}
        onVoucherRedeemed={handleVoucherApplied}
        cartTotal={total}
      />

      <VoucherManagementDialog
        open={voucherManagementDialogOpen}
        onClose={handleVoucherManagementDialogClose}
      />

      <PurchaseVoucherDialog
        open={purchaseVoucherDialogOpen}
        onClose={handlePurchaseVoucherDialogClose}
        onAddToCart={addToCart}
      />

      {/* Redeem Voucher Dialog */}
      <Dialog
        open={redeemVoucherDialogOpen}
        onClose={handleRedeemVoucherDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Gutschein einlösen</DialogTitle>
        <DialogContent dividers>
          <VoucherInputField
            onVoucherApplied={handleVoucherApplied}
            appliedVouchers={appliedVouchers}
            currentTotal={subtotal - voucherDiscount}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRedeemVoucherDialogClose}>Schließen</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SalesScreen;
