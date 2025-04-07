import React from 'react';
import { Box, Paper, Typography, Divider, Stack, LinearProgress } from '../../components/ui';
import {
  Button,
  Chip,
  IconButton,
  useTheme,
  Badge,
  Tooltip,
  alpha,
  Avatar,
  Grid,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import SummarizeIcon from '@mui/icons-material/Summarize';
import { motion } from 'framer-motion';

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
            <IconButton
              size="small"
              color="error"
              onClick={onClearCart}
              sx={{
                transition: 'all 0.2s',
                '&:hover': { transform: 'scale(1.1)' },
              }}
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
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={listItemVariants}
                custom={index}
              >
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    overflow: 'hidden',
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      boxShadow: 2,
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    {/* Product Avatar */}
                    <Avatar
                      sx={{
                        bgcolor: `${theme.palette.primary.light}30`,
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
                          {(item.price * item.quantity).toFixed(2)} €
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Chip
                          size="small"
                          label={`${(item.price ?? 0).toFixed(2)} € × ${item.quantity}`}
                          sx={{
                            fontSize: '0.75rem',
                            bgcolor: `${theme.palette.primary.light}15`,
                            color: theme.palette.primary.dark,
                          }}
                        />

                        <Box sx={{ display: 'flex' }}>
                          <IconButton
                            size="small"
                            onClick={() => onRemoveItem(item.id)}
                            sx={{
                              color: theme.palette.text.secondary,
                              '&:hover': { color: theme.palette.primary.main },
                            }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={() => onAddItem(item)}
                            sx={{
                              color: theme.palette.success.main,
                              '&:hover': { color: theme.palette.success.dark },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDeleteItem(item.id)}
                            sx={{ '&:hover': { color: theme.palette.error.dark } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </motion.div>
            ))}

            {/* Applied vouchers */}
            {appliedVouchers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  sx={{ fontWeight: 'medium', color: theme.palette.primary.main }}
                >
                  Angewendete Gutscheine:
                </Typography>
                <Stack spacing={1}>
                  {appliedVouchers.map(voucher => (
                    <Paper
                      key={voucher.id}
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: `${theme.palette.info.light}15`,
                        borderRadius: 2,
                        border: `1px solid ${alpha(theme.palette.info.light, 0.4)}`,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 1,
                          borderColor: theme.palette.info.main,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardGiftcardIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
                          <Typography variant="body2" fontWeight="medium">
                            {voucher.code}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="error.main" fontWeight="bold">
                          -{voucher.value.toFixed(2)} €
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        {voucher.remainingValue > 0 && (
                          <Typography variant="caption" color="info.main">
                            Restguthaben: {voucher.remainingValue.toFixed(2)} €
                          </Typography>
                        )}
                        <Box sx={{ ml: 'auto' }}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onRemoveVoucher(voucher.id)}
                            sx={{ p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
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
        }}
      >
        {/* Voucher buttons */}
        {!receiptReady && (
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
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

              <Grid item xs={12}>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<SettingsIcon />}
                  onClick={onManageVouchers}
                  size="small"
                  sx={{ width: 'auto' }}
                >
                  Gutscheine verwalten
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Subtotal and discount */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Zwischensumme:</Typography>
            <Typography variant="body1">{subtotal.toFixed(2)} €</Typography>
          </Box>

          {voucherDiscount > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" color="error.main">
                Gutschein-Rabatt:
              </Typography>
              <Typography variant="body1" color="error.main" fontWeight="medium">
                -{voucherDiscount.toFixed(2)} €
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Total */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 3,
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Gesamtsumme:
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            {total.toFixed(2)} €
          </Typography>
        </Box>

        {receiptReady ? (
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<ReceiptIcon />}
              onClick={onPrintReceipt}
              sx={{
                py: 1.5,
                boxShadow: 3,
                '&:hover': { boxShadow: 5 },
              }}
            >
              Rechnung drucken
            </Button>

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
          <Button
            variant="contained"
            color="primary"
            fullWidth
            startIcon={<PaymentIcon />}
            onClick={onPayment}
            disabled={cartItems.length === 0}
            sx={{
              py: 1.5,
              boxShadow: 3,
              '&:hover': { boxShadow: 5 },
            }}
          >
            Zahlung abschließen
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default ShoppingCart;
