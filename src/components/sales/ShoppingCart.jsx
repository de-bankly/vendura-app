import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import LockIcon from '@mui/icons-material/Lock';
import {
  Box,
  Typography,
  Stack,
  useTheme,
  Badge,
  Tooltip,
  alpha,
  IconButton,
  Paper,
  Divider,
  Grid,
  Chip,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import AppliedVoucher from './AppliedVoucher';
import CartSummary from './CartSummary';
import VoucherActionButtons from './VoucherActionButtons';
import CartActionButtons from './CartActionButtons';
import { DepositActionButtons } from './';

// Extracted Cart Header Component
const CartHeader = React.memo(
  ({
    itemCount,
    cartLocked,
    cartIsEmpty,
    cartUndoEnabled,
    cartRedoEnabled,
    onUndoCartState,
    onRedoCartState,
    onClearCart,
  }) => {
    const theme = useTheme();
    return (
      <Box
        sx={{
          p: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge
            badgeContent={itemCount}
            color="primary"
            showZero
            sx={{
              mr: 2,
              '& .MuiBadge-badge': {
                fontSize: 12,
                height: 20,
                minWidth: 20,
                padding: '0 6px',
              },
            }}
          >
            <ShoppingCartIcon color="primary" fontSize="medium" />
          </Badge>
          <Typography variant="h6" fontWeight="600">
            Warenkorb
          </Typography>
          {cartLocked && (
            <Chip
              icon={<LockIcon fontSize="small" />}
              label="Gesperrt"
              size="small"
              color="warning"
              variant="outlined"
              sx={{ ml: 1.5 }}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Rückgängig">
            <span>
              <IconButton
                size="small"
                disabled={!cartUndoEnabled || cartLocked}
                onClick={onUndoCartState}
                sx={{ mr: 0.5 }}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Wiederherstellen">
            <span>
              <IconButton
                size="small"
                disabled={!cartRedoEnabled || cartLocked}
                onClick={onRedoCartState}
                sx={{ mr: 0.5 }}
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>

          {!cartIsEmpty && !cartLocked && (
            <Tooltip title="Warenkorb leeren">
              <IconButton
                size="small"
                color="error"
                onClick={onClearCart}
                sx={{
                  transition: theme.transitions.create(['transform', 'background-color'], {
                    duration: theme.transitions.duration.shorter,
                  }),
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                  },
                }}
                aria-label="Clear cart"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    );
  }
);

CartHeader.propTypes = {
  itemCount: PropTypes.number.isRequired,
  cartLocked: PropTypes.bool.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
  cartUndoEnabled: PropTypes.bool.isRequired,
  cartRedoEnabled: PropTypes.bool.isRequired,
  onUndoCartState: PropTypes.func.isRequired,
  onRedoCartState: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
};

CartHeader.displayName = 'CartHeader';

/**
 * ShoppingCart component for displaying and managing cart items
 */
const ShoppingCart = React.memo(
  ({
    // Cart State
    cartItems,
    appliedVouchers,
    // Calculated Values
    subtotal,
    voucherDiscount,
    depositCredit,
    giftCardPayment,
    total,
    productDiscount,
    // UI State
    receiptReady,
    cartUndoEnabled,
    cartRedoEnabled,
    cartLocked,
    // Callbacks
    onAddItem,
    onRemoveItem,
    onDeleteItem,
    onClearCart,
    onPayment,
    onPrintReceipt,
    onNewTransaction,
    onRemoveVoucher,
    onRedeemVoucher,
    onRedeemDeposit,
    onUndoCartState,
    onRedoCartState,
  }) => {
    const theme = useTheme();
    const itemCount = React.useMemo(
      () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
      [cartItems]
    );
    const cartIsEmpty = React.useMemo(() => cartItems.length === 0, [cartItems]);

    return (
      <Paper
        elevation={2}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Use extracted CartHeader component */}
        <CartHeader
          itemCount={itemCount}
          cartLocked={cartLocked}
          cartIsEmpty={cartIsEmpty}
          cartUndoEnabled={cartUndoEnabled}
          cartRedoEnabled={cartRedoEnabled}
          onUndoCartState={onUndoCartState}
          onRedoCartState={onRedoCartState}
          onClearCart={onClearCart}
        />

        {/* Cart items */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: 'auto',
            p: 2.5,
            bgcolor: alpha(theme.palette.background.default, 0.6),
          }}
        >
          {cartIsEmpty ? (
            <EmptyCart />
          ) : (
            <Stack spacing={2}>
              <AnimatePresence initial={false}>
                {cartItems.map(item => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onAddItem={onAddItem}
                    onRemoveItem={onRemoveItem}
                    onDeleteItem={onDeleteItem}
                    disabled={cartLocked}
                  />
                ))}
              </AnimatePresence>

              {/* Applied vouchers */}
              {appliedVouchers.length > 0 && (
                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      color: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      '&::before': {
                        content: '""',
                        display: 'block',
                        width: 3,
                        height: 20,
                        backgroundColor: 'primary.main',
                        marginRight: 1.5,
                        borderRadius: 1,
                      },
                    }}
                  >
                    Angewendete Gutscheine
                  </Typography>
                  <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                    <AnimatePresence>
                      {appliedVouchers.map(voucher => (
                        <AppliedVoucher
                          key={voucher.id}
                          voucher={voucher}
                          onRemoveVoucher={onRemoveVoucher}
                          disabled={cartLocked}
                        />
                      ))}
                    </AnimatePresence>
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>

        {/* Cart summary and actions */}
        <Box
          sx={{
            p: 2.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            flexShrink: 0,
          }}
        >
          {/* Action Buttons Section */}
          <Box sx={{ mb: 3 }}>
            {!receiptReady && (
              <Grid container spacing={2}>
                {/* Voucher button */}
                <Grid item xs={6}>
                  <VoucherActionButtons
                    onRedeemVoucher={onRedeemVoucher}
                    cartIsEmpty={cartIsEmpty}
                    disabled={cartLocked}
                  />
                </Grid>

                {/* Deposit button */}
                <Grid item xs={6}>
                  <DepositActionButtons
                    onRedeemDeposit={onRedeemDeposit}
                    cartIsEmpty={cartIsEmpty}
                    disabled={cartLocked}
                  />
                </Grid>
              </Grid>
            )}
          </Box>

          <Divider />

          {/* Cart summary */}
          <CartSummary
            subtotal={subtotal}
            voucherDiscount={voucherDiscount}
            depositCredit={depositCredit}
            giftCardPayment={giftCardPayment}
            total={total}
            productDiscount={productDiscount || 0}
          />

          {/* Action Buttons */}
          <CartActionButtons
            receiptReady={receiptReady}
            cartIsEmpty={cartIsEmpty}
            cartLocked={cartLocked}
            onPayment={onPayment}
            onPrintReceipt={onPrintReceipt}
            onNewTransaction={onNewTransaction}
          />
        </Box>
      </Paper>
    );
  }
);

ShoppingCart.propTypes = {
  // Cart State
  cartItems: PropTypes.array.isRequired,
  appliedVouchers: PropTypes.array.isRequired,
  // Calculated Values
  subtotal: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number.isRequired,
  depositCredit: PropTypes.number,
  giftCardPayment: PropTypes.number,
  total: PropTypes.number.isRequired,
  productDiscount: PropTypes.number,
  // UI State
  receiptReady: PropTypes.bool.isRequired,
  cartUndoEnabled: PropTypes.bool.isRequired,
  cartRedoEnabled: PropTypes.bool.isRequired,
  cartLocked: PropTypes.bool.isRequired,
  // Callbacks
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onPayment: PropTypes.func.isRequired,
  onPrintReceipt: PropTypes.func.isRequired,
  onNewTransaction: PropTypes.func.isRequired,
  onRemoveVoucher: PropTypes.func.isRequired,
  onRedeemVoucher: PropTypes.func.isRequired,
  onRedeemDeposit: PropTypes.func.isRequired,
  onUndoCartState: PropTypes.func.isRequired,
  onRedoCartState: PropTypes.func.isRequired,
};

ShoppingCart.defaultProps = {
  depositCredit: 0,
  giftCardPayment: 0,
  productDiscount: 0,
};

ShoppingCart.displayName = 'ShoppingCart';

export default ShoppingCart;
