import React, { useState, useCallback, useMemo } from 'react';
import { Box, Grid, Typography, Alert } from '../components/ui';
import { Slide, Snackbar } from '@mui/material';
import {
  RedeemVoucherDialog,
  VoucherManagementDialog,
  PurchaseVoucherDialog,
} from '../components/vouchers';
import { ProductGrid, ShoppingCart, PaymentDialog } from '../components/sales';
import { ProductService, CartService } from '../services';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * SalesScreen component for the point-of-sale system
 * Displays products, cart, and payment options
 */
const SalesScreen = () => {
  // Get products from service
  const products = useMemo(() => ProductService.getProducts(), []);

  // Group products by category
  const productsByCategory = useMemo(() => ProductService.groupByCategory(products), [products]);

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
  }, []);

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
  const handleVoucherRedeemed = useCallback(voucher => {
    setAppliedVouchers(prev => [...prev, voucher]);
  }, []);

  // Handle remove applied voucher
  const handleRemoveVoucher = useCallback(voucherId => {
    setAppliedVouchers(prev => prev.filter(v => v.id !== voucherId));
  }, []);

  return (
    <Box sx={{ p: 2, height: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verkaufsbildschirm
      </Typography>

      <Grid container spacing={3} sx={{ height: 'calc(100% - 60px)' }}>
        {/* Product selection area */}
        <Grid item xs={12} md={8}>
          <ProductGrid productsByCategory={productsByCategory} onProductSelect={addToCart} />
        </Grid>

        {/* Cart area */}
        <Grid item xs={12} md={4}>
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
            onRemoveVoucher={handleRemoveVoucher}
            onRedeemVoucher={handleRedeemVoucherDialogOpen}
            onManageVouchers={handleVoucherManagementDialogOpen}
            onPurchaseVoucher={handlePurchaseVoucherDialogOpen}
          />
        </Grid>
      </Grid>

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
          sx={{ width: '100%' }}
        >
          Zahlung erfolgreich abgeschlossen!
        </Alert>
      </Snackbar>

      {/* Voucher Dialogs */}
      <RedeemVoucherDialog
        open={redeemVoucherDialogOpen}
        onClose={handleRedeemVoucherDialogClose}
        onVoucherRedeemed={handleVoucherRedeemed}
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
