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
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import AppliedVoucher from './AppliedVoucher';
import CartSummary from './CartSummary';
import VoucherActionButtons from './VoucherActionButtons';
import CartActionButtons from './CartActionButtons';
import { DepositActionButtons } from './';

/**
 * @component CartHeader
 * @description Displays the header section of the shopping cart, including title, item count, lock status, and action buttons (undo, redo, clear).
 * @param {object} props - The component props.
 * @param {number} props.itemCount - The total number of items in the cart.
 * @param {boolean} props.cartLocked - Indicates if the cart is locked.
 * @param {boolean} props.cartIsEmpty - Indicates if the cart is empty.
 * @param {boolean} props.cartUndoEnabled - Indicates if the undo action is available.
 * @param {boolean} props.cartRedoEnabled - Indicates if the redo action is available.
 * @param {function} props.onUndoCartState - Callback function for the undo action.
 * @param {function} props.onRedoCartState - Callback function for the redo action.
 * @param {function} props.onClearCart - Callback function to clear the cart.
 * @returns {React.ReactElement} The rendered CartHeader component.
 */
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
 * @component ShoppingCart
 * @description Main component for displaying and managing the shopping cart, including items, vouchers, summary, and actions.
 * @param {object} props - The component props.
 * @param {Array<object>} props.cartItems - Array of items currently in the cart.
 * @param {Array<object>} props.appliedVouchers - Array of vouchers applied to the cart.
 * @param {number} props.subtotal - The subtotal amount before discounts and credits.
 * @param {number} props.voucherDiscount - The total discount amount from applied vouchers.
 * @param {number} [props.depositCredit=0] - The total credit amount from redeemed deposits.
 * @param {number} [props.giftCardPayment=0] - The amount paid using gift cards.
 * @param {number} props.total - The final total amount after all deductions.
 * @param {number} [props.productDiscount=0] - The total discount amount from product-specific promotions.
 * @param {boolean} props.receiptReady - Indicates if the receipt is ready for printing/finalization.
 * @param {boolean} props.cartUndoEnabled - Indicates if the undo action is available for the cart state.
 * @param {boolean} props.cartRedoEnabled - Indicates if the redo action is available for the cart state.
 * @param {boolean} props.cartLocked - Indicates if the cart is locked (e.g., during payment).
 * @param {function} props.onAddItem - Callback function to add an item quantity.
 * @param {function} props.onRemoveItem - Callback function to remove an item quantity.
 * @param {function} props.onDeleteItem - Callback function to delete an item completely.
 * @param {function} props.onClearCart - Callback function to clear all items from the cart.
 * @param {function} props.onPayment - Callback function to initiate the payment process.
 * @param {function} props.onPrintReceipt - Callback function to print the receipt.
 * @param {function} props.onNewTransaction - Callback function to start a new transaction.
 * @param {function} props.onRemoveVoucher - Callback function to remove an applied voucher.
 * @param {function} props.onRedeemVoucher - Callback function to redeem a voucher.
 * @param {function} props.onRedeemDeposit - Callback function to redeem deposit items.
 * @param {function} props.onUndoCartState - Callback function to undo the last cart state change.
 * @param {function} props.onRedoCartState - Callback function to redo the last undone cart state change.
 * @returns {React.ReactElement} The rendered ShoppingCart component.
 */
const ShoppingCart = React.memo(
  ({
    cartItems,
    appliedVouchers,
    subtotal,
    voucherDiscount,
    depositCredit,
    giftCardPayment,
    total,
    productDiscount,
    receiptReady,
    cartUndoEnabled,
    cartRedoEnabled,
    cartLocked,
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

        <Box
          sx={{
            p: 2.5,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            flexShrink: 0,
          }}
        >
          <Box sx={{ mb: 3 }}>
            {!receiptReady && (
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <VoucherActionButtons
                    onRedeemVoucher={onRedeemVoucher}
                    cartIsEmpty={cartIsEmpty}
                    disabled={cartLocked}
                  />
                </Grid>
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

          <CartSummary
            subtotal={subtotal}
            voucherDiscount={voucherDiscount}
            depositCredit={depositCredit}
            giftCardPayment={giftCardPayment}
            total={total}
            productDiscount={productDiscount || 0}
          />

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
  cartItems: PropTypes.array.isRequired,
  appliedVouchers: PropTypes.array.isRequired,
  subtotal: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number.isRequired,
  depositCredit: PropTypes.number,
  giftCardPayment: PropTypes.number,
  total: PropTypes.number.isRequired,
  productDiscount: PropTypes.number,
  receiptReady: PropTypes.bool.isRequired,
  cartUndoEnabled: PropTypes.bool.isRequired,
  cartRedoEnabled: PropTypes.bool.isRequired,
  cartLocked: PropTypes.bool.isRequired,
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

export default ShoppingCart;
