import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  Divider,
} from '../components/ui';
import { Slide, Snackbar, useTheme, alpha, Container } from '@mui/material';
import {
  RedeemVoucherDialog,
  VoucherManagementDialog,
  PurchaseVoucherDialog,
} from '../components/vouchers';
import { ProductGrid, ShoppingCart, PaymentDialog } from '../components/sales';
import { ProductService, CartService, GiftCardService } from '../services';
import { motion } from 'framer-motion';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

  // State for products and loading
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});

  // Load products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productData = await ProductService.getProducts({ page: 0, size: 100 });
        setProducts(productData.content || []);
        const groupedProducts = ProductService.groupByCategory(productData.content || []);
        setProductsByCategory(groupedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // State for cart items
  const [cartItems, setCartItems] = useState([]);

  // State for payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');

  // State for success notification
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [receiptReady, setReceiptReady] = useState(false);

  // State for voucher dialogs
  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [purchaseVoucherDialogOpen, setPurchaseVoucherDialogOpen] = useState(false);

  // State for applied vouchers
  const [appliedVouchers, setAppliedVouchers] = useState([]);

  // Add item to cart
  const addToCart = useCallback(product => {
    setCartItems(prevItems => CartService.addToCart(prevItems, product));
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(productId => {
    setCartItems(prevItems => CartService.removeFromCart(prevItems, productId));
  }, []);

  // Delete item from cart
  const deleteFromCart = useCallback(productId => {
    setCartItems(prevItems => CartService.deleteFromCart(prevItems, productId));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedVouchers([]);
  }, []);

  // Calculate subtotal (before vouchers)
  const subtotal = useMemo(() => CartService.calculateSubtotal(cartItems), [cartItems]);

  // Calculate voucher discount
  const voucherDiscount = useMemo(
    () => CartService.calculateVoucherDiscount(appliedVouchers),
    [appliedVouchers]
  );

  // Calculate total (after vouchers)
  const total = useMemo(
    () => CartService.calculateTotal(subtotal, voucherDiscount),
    [subtotal, voucherDiscount]
  );

  // Handle payment modal open
  const handlePaymentModalOpen = useCallback(() => {
    setPaymentModalOpen(true);
    setCashReceived(total.toFixed(2));
  }, [total]);

  // Handle payment modal close
  const handlePaymentModalClose = useCallback(() => {
    setPaymentModalOpen(false);
  }, []);

  // Handle payment method change
  const handlePaymentMethodChange = useCallback(event => {
    setPaymentMethod(event.target.value);
  }, []);

  // Handle cash received change
  const handleCashReceivedChange = useCallback(event => {
    setCashReceived(event.target.value);
  }, []);

  // Calculate change
  const change = useMemo(() => {
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - total).toFixed(2);
  }, [cashReceived, total]);

  // Handle payment completion
  const handlePaymentComplete = useCallback(() => {
    setPaymentModalOpen(false);
    setSuccessSnackbarOpen(true);
    setReceiptReady(true);

    // In a real app, you would send the transaction to a backend
  }, [
    cartItems,
    subtotal,
    appliedVouchers,
    voucherDiscount,
    total,
    paymentMethod,
    cashReceived,
    change,
  ]);

  // Handle print receipt
  const handlePrintReceipt = useCallback(() => {
    // In a real app, this would trigger receipt printing
    alert('Rechnung wird gedruckt...');
  }, [cartItems]);

  // Handle snackbar close
  const handleSnackbarClose = useCallback(() => {
    setSuccessSnackbarOpen(false);
  }, []);

  // Handle new transaction
  const handleNewTransaction = useCallback(() => {
    clearCart();
    setReceiptReady(false);
  }, [clearCart]);

  // Handle redeem voucher dialog open
  const handleRedeemVoucherDialogOpen = useCallback(() => {
    setRedeemVoucherDialogOpen(true);
  }, []);

  // Handle redeem voucher dialog close
  const handleRedeemVoucherDialogClose = useCallback(() => {
    setRedeemVoucherDialogOpen(false);
  }, []);

  // Handle voucher management dialog open
  const handleVoucherManagementDialogOpen = useCallback(() => {
    setVoucherManagementDialogOpen(true);
  }, []);

  // Handle voucher management dialog close
  const handleVoucherManagementDialogClose = useCallback(() => {
    setVoucherManagementDialogOpen(false);
  }, []);

  // Handle purchase voucher dialog open
  const handlePurchaseVoucherDialogOpen = useCallback(() => {
    setPurchaseVoucherDialogOpen(true);
  }, []);

  // Handle purchase voucher dialog close
  const handlePurchaseVoucherDialogClose = useCallback(() => {
    setPurchaseVoucherDialogOpen(false);
  }, []);

  // Handle voucher redeemed
  const handleVoucherRedeemed = useCallback(async voucherId => {
    try {
      // Get gift card data and balance from API
      const giftCard = await GiftCardService.getGiftCardById(voucherId);
      const giftCardBalance = await GiftCardService.getGiftCardBalance(voucherId);

      // Use balance from balance endpoint
      const voucher = {
        ...giftCard,
        balance: giftCardBalance.remainingBalance,
      };

      setAppliedVouchers(prev => [...prev, voucher]);
    } catch (err) {
      console.error('Error redeeming gift card:', err);
      // Show error message to user
      alert('Fehler beim Einlösen des Gutscheins. Bitte versuchen Sie es später erneut.');
    }
  }, []);

  // Handle remove applied voucher
  const handleRemoveVoucher = useCallback(voucherId => {
    setAppliedVouchers(prev => prev.filter(v => v.id !== voucherId));
  }, []);

  return (
    <Box
      sx={{
        height: '100%',
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        pt: 2,
      }}
    >
      <Container maxWidth="xl">
        {/* Page Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="sales-container"
        >
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
                  borderRadius: 2,
                }}
              />
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                Verkaufsbildschirm
              </Typography>
            </Box>
          </motion.div>

          {/* Sales Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card className="hover-card" sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Warenkorb
                      </Typography>
                      <Chip
                        size="small"
                        icon={<ShoppingCartIcon fontSize="small" />}
                        label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        color="primary"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {total.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>

                    {cartItems.length > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        {cartItems.length} Artikel im Warenkorb
                      </Typography>
                    )}

                    {cartItems.length === 0 && (
                      <Typography variant="body2" color="text.secondary">
                        Keine Artikel im Warenkorb
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card className="hover-card" sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Produkte
                      </Typography>
                      <Chip
                        size="small"
                        icon={<InventoryIcon fontSize="small" />}
                        label={products.length}
                        color="success"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {Object.keys(productsByCategory).length}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Kategorien verfügbar
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card className="hover-card" sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Gutscheine
                      </Typography>
                      <Chip
                        size="small"
                        icon={<CardGiftcardIcon fontSize="small" />}
                        label={appliedVouchers.length}
                        color="info"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
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

          {/* Main Content */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '400px',
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <Box sx={{ mb: 4 }}>
              <Grid container spacing={3}>
                {/* Product Grid */}
                <Grid item xs={12} md={8}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        height: '70vh',
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
                <Grid item xs={12} md={4}>
                  <motion.div variants={itemVariants}>
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        height: '70vh',
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
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Payment Dialog */}
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
      />

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%', boxShadow: 3 }}
        >
          Zahlung erfolgreich abgeschlossen!
        </Alert>
      </Snackbar>

      {/* Voucher Dialogs */}
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
