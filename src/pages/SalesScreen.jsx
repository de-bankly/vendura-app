import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Alert as MuiAlert,
  CardContent,
 Slide, Snackbar, useTheme, alpha, Container } from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useCallback, useMemo, useEffect } from 'react';

// Import local components
import { Button } from '../../components/ui/buttons';
import { Card } from '../../components/ui/cards';
import { Chip } from '../../components/ui/feedback';
import { useToast } from '../../components/ui/feedback'; // Import useToast
import { ProductGrid, ShoppingCart, PaymentDialog } from '../components/sales';
import {
  RedeemVoucherDialog,
  VoucherManagementDialog,
  PurchaseVoucherDialog,
} from '../components/vouchers';
import {
  ProductService,
  CartService,
  GiftCardService,
  // Assume TransactionService exists for payment completion
  // TransactionService
} from '../services';
import { getUserFriendlyErrorMessage } from '../utils/errorUtils'; // Import error helper


// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition'; // Add display name

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
  const [paymentLoading, setPaymentLoading] = useState(false); // Loading state for payment submission
  const [receiptReady, setReceiptReady] = useState(false);
  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [purchaseVoucherDialogOpen, setPurchaseVoucherDialogOpen] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState([]);

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
  const voucherDiscount = useMemo(
    () => CartService.calculateVoucherDiscount(appliedVouchers),
    [appliedVouchers]
  );
  const total = useMemo(
    () => CartService.calculateTotal(subtotal, voucherDiscount),
    [subtotal, voucherDiscount]
  );
  const change = useMemo(() => {
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - total).toFixed(2);
  }, [cashReceived, total]);

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

  const handlePaymentComplete = useCallback(async () => {
    setPaymentLoading(true); // Indicate loading
    try {
      // TODO: Send transaction to backend API
      const transactionData = {
        cartItems,
        subtotal,
        appliedVouchers,
        voucherDiscount,
        total,
        paymentMethod,
        cashReceived: paymentMethod === 'cash' ? cashReceived : undefined,
        change: paymentMethod === 'cash' ? change : undefined,
      };
      console.log('Submitting Transaction:', transactionData);
      // Example: await TransactionService.createTransaction(transactionData);

      // --- If successful: ---
      setPaymentModalOpen(false);
      setReceiptReady(true);
      showToast({ severity: 'success', message: 'Zahlung erfolgreich abgeschlossen!' });
      // Don't clear cart automatically, let user press "New Transaction"
    } catch (error) {
      console.error('Payment failed:', error);
      showToast({
        severity: 'error',
        message: getUserFriendlyErrorMessage(error, 'Zahlung fehlgeschlagen'),
      });
      // Keep payment modal open on error?
    } finally {
      setPaymentLoading(false); // Reset loading state
    }
  }, [
    cartItems,
    subtotal,
    appliedVouchers,
    voucherDiscount,
    total,
    paymentMethod,
    cashReceived,
    change,
    showToast,
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

  const handleVoucherRedeemed = useCallback(
    async voucherId => {
      try {
        const giftCard = await GiftCardService.getGiftCardById(voucherId);
        const giftCardBalance = await GiftCardService.getGiftCardBalance(voucherId);
        const voucher = {
          ...giftCard,
          balance: giftCardBalance.remainingBalance,
        };
        setAppliedVouchers(prev => [...prev, voucher]);
        showToast({ severity: 'success', message: 'Gutschein erfolgreich angewendet!' });
        handleRedeemVoucherDialogClose();
      } catch (err) {
        console.error('Error redeeming gift card:', err);
        showToast({
          severity: 'error',
          message: getUserFriendlyErrorMessage(err, 'Fehler beim Einlösen des Gutscheins'),
        });
      }
    },
    [showToast, handleRedeemVoucherDialogClose]
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
                      {total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
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
        paymentMethod={paymentMethod}
        onPaymentMethodChange={handlePaymentMethodChange}
        cashReceived={cashReceived}
        onCashReceivedChange={handleCashReceivedChange}
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
        onVoucherRedeemed={handleVoucherRedeemed}
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
    </Box>
  );
};

export default SalesScreen;
