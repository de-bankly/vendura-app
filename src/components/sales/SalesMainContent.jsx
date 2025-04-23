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
      {/* Product Grid */}
      <Grid item xs={12} md={7} lg={8} sx={{ height: '100%' }}>
        <motion.div variants={itemVariants} style={{ height: '100%' }}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              opacity: cartLocked ? 0.6 : 1,
              pointerEvents: cartLocked ? 'none' : 'auto',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: theme.shadows[1],
              border: `1px solid ${theme.palette.divider}`,
            }}
          >
            <ProductGrid productsByCategory={productsByCategory} onProductSelect={onAddToCart} />
          </Box>
        </motion.div>
      </Grid>

      {/* Shopping Cart with undo/redo pattern */}
      <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Paper
          elevation={3}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default',
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
            receiptReady={receiptReady}
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
            cartUndoEnabled={cartUndoEnabled}
            cartRedoEnabled={cartRedoEnabled}
            cartLocked={cartLocked}
            onUndoCartState={onUndoCartState}
            onRedoCartState={onRedoCartState}
            productDiscount={productDiscount}
          />
        </Paper>
      </Grid>
    </Grid>
  );
};

export default SalesMainContent;
