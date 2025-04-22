import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
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

/**
 * ShoppingCart component for displaying and managing cart items
 */
const ShoppingCart = ({
  cartItems,
  appliedVouchers,
  subtotal,
  voucherDiscount,
  depositCredit,
  giftCardPayment,
  total,
  receiptReady,
  onAddItem,
  onRemoveItem,
  onDeleteItem,
  onClearCart,
  onPayment,
  onPrintReceipt,
  onNewTransaction,
  onRemoveVoucher,
  onRedeemVoucher,
  onManageVouchers,
  onRedeemDeposit,
}) => {
  const theme = useTheme();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartIsEmpty = cartItems.length === 0;

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
      {/* Header */}
      <Box
        component={motion.div}
        whileHover={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}
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
        </Box>

        {!cartIsEmpty && (
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
              <ClearAllIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>

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
                <VoucherActionButtons onRedeemVoucher={onRedeemVoucher} cartIsEmpty={cartIsEmpty} />
              </Grid>

              {/* Deposit button */}
              <Grid item xs={6}>
                <DepositActionButtons onRedeemDeposit={onRedeemDeposit} cartIsEmpty={cartIsEmpty} />
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
        />

        {/* Action Buttons */}
        <CartActionButtons
          receiptReady={receiptReady}
          cartIsEmpty={cartIsEmpty}
          onPayment={onPayment}
          onPrintReceipt={onPrintReceipt}
          onNewTransaction={onNewTransaction}
        />
      </Box>
    </Paper>
  );
};

ShoppingCart.propTypes = {
  cartItems: PropTypes.array.isRequired,
  appliedVouchers: PropTypes.array.isRequired,
  subtotal: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number.isRequired,
  depositCredit: PropTypes.number,
  giftCardPayment: PropTypes.number,
  total: PropTypes.number.isRequired,
  receiptReady: PropTypes.bool.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  onClearCart: PropTypes.func.isRequired,
  onPayment: PropTypes.func.isRequired,
  onPrintReceipt: PropTypes.func.isRequired,
  onNewTransaction: PropTypes.func.isRequired,
  onRemoveVoucher: PropTypes.func.isRequired,
  onRedeemVoucher: PropTypes.func.isRequired,
  onManageVouchers: PropTypes.func.isRequired,
  onRedeemDeposit: PropTypes.func.isRequired,
};

ShoppingCart.defaultProps = {
  depositCredit: 0,
  giftCardPayment: 0,
};

export default ShoppingCart;
