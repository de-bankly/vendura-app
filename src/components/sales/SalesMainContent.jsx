import React from 'react';
import { Grid, Paper, Box, CircularProgress, Alert, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ProductGrid from './ProductGrid';
import ShoppingCart from './ShoppingCart';

// Animation variants
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
 * Main content component for the SalesScreen
 * Contains the product grid and shopping cart
 */
const SalesMainContent = ({
  loading,
  error,
  productsByCategory,
  cartItems,
  appliedVouchers,
  subtotal,
  voucherDiscount,
  depositCredit,
  giftCardPayment,
  total,
  receiptReady,
  cartUndoEnabled,
  cartRedoEnabled,
  cartLocked,
  onAddToCart,
  onRemoveFromCart,
  onDeleteFromCart,
  onClearCart,
  onPayment,
  onPrintReceipt,
  onNewTransaction,
  onRemoveVoucher,
  onRedeemVoucher,
  onManageVouchers,
  onRedeemDeposit,
  onUndoCartState,
  onRedoCartState,
  productDiscount,
}) => {
  const theme = useTheme();

  if (loading) {
    return (
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
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Grid container spacing={3} sx={{ height: '100%' }}>
      {/* Product Grid Section */}
      <Grid item xs={12} md={7} lg={8} sx={{ height: '100%' }}>
        <motion.div variants={itemVariants} style={{ height: '100%' }}>
          <Box
            component={Paper}
            elevation={1}
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              opacity: cartLocked ? 0.6 : 1,
              pointerEvents: cartLocked ? 'none' : 'auto',
              overflow: 'hidden',
            }}
          >
            <ProductGrid productsByCategory={productsByCategory} onProductSelect={onAddToCart} />
          </Box>
        </motion.div>
      </Grid>

      {/* Shopping Cart Section */}
      <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden',
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <ShoppingCart
            cartItems={cartItems}
            appliedVouchers={appliedVouchers}
            subtotal={subtotal}
            voucherDiscount={voucherDiscount}
            depositCredit={depositCredit}
            giftCardPayment={giftCardPayment}
            total={total}
            productDiscount={productDiscount}
            receiptReady={receiptReady}
            cartUndoEnabled={cartUndoEnabled}
            cartRedoEnabled={cartRedoEnabled}
            cartLocked={cartLocked}
            onAddItem={onAddToCart}
            onRemoveItem={onRemoveFromCart}
            onDeleteItem={onDeleteFromCart}
            onClearCart={onClearCart}
            onPayment={onPayment}
            onPrintReceipt={onPrintReceipt}
            onNewTransaction={onNewTransaction}
            onRemoveVoucher={onRemoveVoucher}
            onRedeemVoucher={onRedeemVoucher}
            onManageVouchers={onManageVouchers}
            onRedeemDeposit={onRedeemDeposit}
            onUndoCartState={onUndoCartState}
            onRedoCartState={onRedoCartState}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SalesMainContent;
