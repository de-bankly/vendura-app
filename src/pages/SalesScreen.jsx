import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Box, Grid, Typography, Alert, CircularProgress } from '../components/ui';
import { Slide, Snackbar, useTheme } from '@mui/material';
import {
  RedeemVoucherDialog,
  VoucherManagementDialog,
  PurchaseVoucherDialog,
} from '../components/vouchers';
import { ProductGrid, ShoppingCart, PaymentDialog } from '../components/sales';
import { ProductService, CartService, GiftCardService } from '../services';
import StorefrontIcon from '@mui/icons-material/Storefront';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
    // For now, we'll just log the transaction details
    console.log('Transaction completed:', {
      items: cartItems,
      subtotal,
      appliedVouchers,
      voucherDiscount,
      total,
      paymentMethod,
      cashReceived: parseFloat(cashReceived),
      change: parseFloat(change),
    });
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
    console.log('Printing receipt for items:', cartItems);
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
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.primary.light}20 100%)`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          boxShadow: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <StorefrontIcon fontSize="large" />
        <Typography variant="h4" component="h1" fontWeight="bold">
          Verkaufsbildschirm
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ p: 3, flexGrow: 1, overflow: 'hidden' }}>
        {loading ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          <Grid container spacing={3} sx={{ height: '100%' }}>
            {/* Product selection area */}
            <Grid item xs={12} md={8} sx={{ height: '100%' }}>
              <ProductGrid productsByCategory={productsByCategory} onProductSelect={addToCart} />
            </Grid>

            {/* Cart area */}
            <Grid item xs={12} md={4} sx={{ height: '100%' }}>
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
            </Grid>
          </Grid>
        )}
      </Box>

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
