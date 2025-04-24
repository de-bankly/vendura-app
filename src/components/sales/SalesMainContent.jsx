import React from 'react';
import { Grid, Paper, Box, CircularProgress, Alert, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import ProductGrid from './ProductGrid';
import ShoppingCart from './ShoppingCart';

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
 * Main content component for the SalesScreen.
 * Contains the product grid and shopping cart.
 * @param {object} props - The component props.
 * @param {boolean} props.loading - Indicates if data is loading.
 * @param {string|null} props.error - Error message, if any.
 * @param {object} props.productsByCategory - Products grouped by category.
 * @param {Array<object>} props.cartItems - Items currently in the cart.
 * @param {Array<object>} props.appliedVouchers - Vouchers applied to the cart.
 * @param {number} props.subtotal - Cart subtotal before discounts/credits.
 * @param {number} props.voucherDiscount - Total discount from vouchers.
 * @param {number} props.depositCredit - Amount paid using deposit credit.
 * @param {number} props.giftCardPayment - Amount paid using gift cards.
 * @param {number} props.total - Final total after all deductions.
 * @param {boolean} props.receiptReady - Indicates if a receipt is ready for printing.
 * @param {boolean} props.cartUndoEnabled - Indicates if undo action is available for the cart.
 * @param {boolean} props.cartRedoEnabled - Indicates if redo action is available for the cart.
 * @param {boolean} props.cartLocked - Indicates if the cart is locked (e.g., during payment).
 * @param {Function} props.onAddToCart - Callback function to add a product to the cart.
 * @param {Function} props.onRemoveFromCart - Callback function to decrease quantity or remove an item.
 * @param {Function} props.onDeleteFromCart - Callback function to completely remove an item line.
 * @param {Function} props.onClearCart - Callback function to clear the entire cart.
 * @param {Function} props.onPayment - Callback function to initiate the payment process.
 * @param {Function} props.onPrintReceipt - Callback function to print the receipt.
 * @param {Function} props.onNewTransaction - Callback function to start a new transaction.
 * @param {Function} props.onRemoveVoucher - Callback function to remove an applied voucher.
 * @param {Function} props.onRedeemVoucher - Callback function to redeem a voucher.
 * @param {Function} props.onManageVouchers - Callback function to open voucher management.
 * @param {Function} props.onRedeemDeposit - Callback function to redeem deposit credit.
 * @param {Function} props.onUndoCartState - Callback function to undo the last cart action.
 * @param {Function} props.onRedoCartState - Callback function to redo the last undone cart action.
 * @param {number} props.productDiscount - Total discount from product-specific promotions.
 * @returns {React.ReactElement} The rendered SalesMainContent component.
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

      <Grid
        item
        xs={12}
        md={5} // Adjusted from md={4} to fill space better if lg={8} is used for product grid
        lg={4} // Keep lg={4}
        sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      >
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
