import ClearAllIcon from '@mui/icons-material/ClearAll';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Typography, Stack, useTheme, Badge, Tooltip, alpha, IconButton } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import CartItem from './CartItem';
import EmptyCart from './EmptyCart';
import AppliedVoucher from './AppliedVoucher';
import CartSummary from './CartSummary';
import VoucherActionButtons from './VoucherActionButtons';
import CartActionButtons from './CartActionButtons';

/**
 * ShoppingCart component for displaying and managing cart items
 */
const ShoppingCart = ({
  cartItems,
  appliedVouchers,
  subtotal,
  voucherDiscount,
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
  onPurchaseVoucher,
}) => {
  const theme = useTheme();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartIsEmpty = cartItems.length === 0;

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={itemCount} color="primary" showZero sx={{ mr: 1.5 }}>
            <ShoppingCartIcon color="primary" />
          </Badge>
          <Typography variant="h6" fontWeight="medium">
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
                transition: theme.transitions.create('transform'),
                '&:hover': { transform: 'scale(1.1)' },
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
          p: 2,
          bgcolor: alpha(theme.palette.background.default, 0.5),
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
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 'medium', color: 'primary.main' }}
                >
                  Angewendete Gutscheine:
                </Typography>
                <Stack spacing={1}>
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
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        {/* Voucher buttons */}
        {!receiptReady && (
          <Box sx={{ mb: 3 }}>
            <VoucherActionButtons
              onPurchaseVoucher={onPurchaseVoucher}
              onRedeemVoucher={onRedeemVoucher}
              cartIsEmpty={cartIsEmpty}
            />
          </Box>
        )}

        {/* Cart summary */}
        <CartSummary subtotal={subtotal} voucherDiscount={voucherDiscount} total={total} />

        {/* Action Buttons */}
        <CartActionButtons
          receiptReady={receiptReady}
          cartIsEmpty={cartIsEmpty}
          onPayment={onPayment}
          onPrintReceipt={onPrintReceipt}
          onNewTransaction={onNewTransaction}
        />
      </Box>
    </Box>
  );
};

ShoppingCart.propTypes = {
  cartItems: PropTypes.array.isRequired,
  appliedVouchers: PropTypes.array.isRequired,
  subtotal: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number.isRequired,
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
  onPurchaseVoucher: PropTypes.func.isRequired,
};

export default ShoppingCart;
