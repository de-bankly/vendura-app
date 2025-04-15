// Import local components
// Other Icons
import AddIcon from '@mui/icons-material/Add';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RemoveIcon from '@mui/icons-material/Remove';
import SettingsIcon from '@mui/icons-material/Settings';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SummarizeIcon from '@mui/icons-material/Summarize';
import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  useTheme,
  Badge,
  Tooltip,
  alpha,
  Avatar,
  Grid,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion'; // Import AnimatePresence for exit animations
import PropTypes from 'prop-types';
import React from 'react';

import { Button, IconButton } from '../ui/buttons';
import { Chip } from '../ui/feedback';

// Animation variants
const listItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
};

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
  onManageVouchers,
  onPurchaseVoucher,
}) => {
  const theme = useTheme();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

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
          flexShrink: 0, // Prevent shrinking
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

        {cartItems.length > 0 && (
          <Tooltip title="Warenkorb leeren">
            {/* Use local IconButton */}
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
        {cartItems.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              opacity: 0.7,
            }}
          >
            <LocalMallIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Der Warenkorb ist leer
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            <AnimatePresence initial={false}>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id} // Ensure key is stable and unique
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={listItemVariants}
                  layout // Animate layout changes
                >
                  <Paper
                    elevation={0}
                    sx={{
                      overflow: 'hidden',
                      borderRadius: theme.shape.borderRadius, // Use theme token
                      transition: theme.transitions.create(['box-shadow', 'border-color']),
                      border: `1px solid ${theme.palette.divider}`,
                      '&:hover': {
                        boxShadow: theme.shadows[2],
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                  >
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(theme.palette.primary.main, 0.1), // Use alpha
                          color: theme.palette.primary.dark,
                          width: 40,
                          height: 40,
                        }}
                      >
                        {item.name.charAt(0)}
                      </Avatar>

                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {item.name}
                          </Typography>
                          <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                            {(item.price * item.quantity).toLocaleString('de-DE', {
                              style: 'currency',
                              currency: 'EUR',
                            })}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          {/* Use local Chip */}
                          <Chip
                            size="small"
                            label={`${(item.price ?? 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })} × ${item.quantity}`}
                            sx={{
                              fontSize: theme.typography.pxToRem(12), // Use theme token
                              bgcolor: alpha(theme.palette.primary.main, 0.1), // Use alpha
                              color: theme.palette.primary.dark,
                            }}
                          />

                          <Box sx={{ display: 'flex' }}>
                            {/* Use local IconButton */}
                            <IconButton
                              size="small"
                              onClick={() => onRemoveItem(item.id)}
                              sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                              aria-label={`Remove one ${item.name}`}
                            >
                              <RemoveIcon fontSize="inherit" />
                            </IconButton>
                            {/* Use local IconButton */}
                            <IconButton
                              size="small"
                              onClick={() => onAddItem(item)}
                              sx={{ color: 'success.main', '&:hover': { color: 'success.dark' } }}
                              aria-label={`Add one ${item.name}`}
                            >
                              <AddIcon fontSize="inherit" />
                            </IconButton>
                            {/* Use local IconButton */}
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => onDeleteItem(item.id)}
                              sx={{ '&:hover': { color: 'error.dark' } }}
                              aria-label={`Delete ${item.name}`}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </motion.div>
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
                      <motion.div
                        key={voucher.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        layout
                      >
                        <Paper
                          elevation={0}
                          sx={{
                            p: 1.5,
                            bgcolor: alpha(theme.palette.info.light, 0.15), // Use alpha
                            borderRadius: theme.shape.borderRadius, // Use theme token
                            border: `1px solid ${alpha(theme.palette.info.light, 0.4)}`,
                            transition: theme.transitions.create(['box-shadow', 'border-color']),
                            '&:hover': {
                              boxShadow: theme.shadows[1],
                              borderColor: theme.palette.info.main,
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <CardGiftcardIcon
                                fontSize="small"
                                sx={{ mr: 1, color: 'info.main' }}
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {voucher.code}
                              </Typography>
                            </Box>
                            <Typography variant="body2" color="error.main" fontWeight="bold">
                              -
                              {voucher.value.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                              })}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="caption" color="info.dark">
                              Restguthaben:{' '}
                              {voucher.balance.toLocaleString('de-DE', {
                                style: 'currency',
                                currency: 'EUR',
                              })}
                            </Typography>
                            <Box sx={{ ml: 'auto' }}>
                              {/* Use local IconButton */}
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onRemoveVoucher(voucher.id)}
                                sx={{ p: 0.5 }}
                                aria-label={`Remove voucher ${voucher.code}`}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Box>
                          </Box>
                        </Paper>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Stack>
              </Box>
            )}
          </Stack>
        )}
      </Box>

      {/* Cart summary */}
      <Box
        sx={{
          p: 3,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.paper,
          flexShrink: 0, // Prevent shrinking
        }}
      >
        {/* Voucher buttons */}
        {!receiptReady && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                {/* Use local Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CardGiftcardIcon />}
                  onClick={onPurchaseVoucher}
                  size="small"
                  fullWidth
                >
                  Gutschein kaufen
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                {/* Use local Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<CardGiftcardIcon />}
                  onClick={onRedeemVoucher}
                  size="small"
                  fullWidth
                  disabled={cartItems.length === 0}
                >
                  Einlösen
                </Button>
              </Grid>
              {/* Removed Manage Vouchers button for brevity, can be added back */}
            </Grid>
          </Box>
        )}

        {/* Divider moved outside conditional rendering for consistency */}
        <Divider sx={{ my: 2 }} />

        {/* Subtotal and discount */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Zwischensumme:</Typography>
            <Typography variant="body1">
              {subtotal.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
            </Typography>
          </Box>
          {voucherDiscount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" color="error.main">
                Gutschein-Rabatt:
              </Typography>
              <Typography variant="body1" color="error.main" fontWeight="medium">
                -{voucherDiscount.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Total */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: theme.shape.borderRadius, // Use theme token
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Gesamtsumme:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
          </Typography>
        </Box>

        {/* Action Buttons */}
        {receiptReady ? (
          <Stack spacing={2}>
            {/* Use local Button */}
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<ReceiptIcon />}
              onClick={onPrintReceipt}
              sx={{ py: 1.5 }}
            >
              Rechnung drucken
            </Button>
            {/* Use local Button */}
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              startIcon={<ShoppingCartIcon />}
              onClick={onNewTransaction}
              sx={{ py: 1.2 }}
            >
              Neuer Verkauf
            </Button>
          </Stack>
        ) : (
          /* Use local Button */
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<PaymentIcon />}
            onClick={onPayment}
            disabled={cartItems.length === 0}
            sx={{ py: 1.5 }}
          >
            Zahlung abschließen
          </Button>
        )}
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
