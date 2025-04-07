import React from 'react';
import { Box, Paper, Typography, Divider, Stack } from '../../components/ui';
import { Button, Chip, IconButton, useTheme, Badge, Tooltip } from '@mui/material';
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
    <Paper
      elevation={4}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease',
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
          background: theme.palette.background.default,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={itemCount} color="primary" showZero sx={{ mr: 1.5 }}>
            <ShoppingCartIcon color="primary" />
          </Badge>
          <Typography variant="h5" fontWeight="medium">
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
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
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
            {cartItems.map(item => (
              <Paper
                key={item.id}
                variant="outlined"
                sx={{
                  p: 0,
                  overflow: 'hidden',
                  borderRadius: 1.5,
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: 2,
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Box sx={{ p: 1.5 }}>
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
                    <Typography variant="body2" color="text.secondary">
                      {(item.price ?? 0).toFixed(2)} € × {item.quantity}
                    </Typography>

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
              </Paper>
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
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        bgcolor: theme.palette.primary.light + '15',
                        borderRadius: 1.5,
                        borderColor: theme.palette.primary.light,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 2,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardGiftcardIcon
                            fontSize="small"
                            sx={{ mr: 1, color: 'primary.main' }}
                          />
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
                          <Typography variant="caption" color="primary.main">
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
          p: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
        }}
      >
        {/* Voucher buttons */}
        <Box sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CardGiftcardIcon />}
            onClick={onPurchaseVoucher}
            size="small"
            fullWidth
            sx={{ mb: 1 }}
          >
            Gutschein kaufen
          </Button>

          {!receiptReady && cartItems.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CardGiftcardIcon />}
                onClick={onRedeemVoucher}
                size="small"
                fullWidth
              >
                Gutschein einlösen
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SettingsIcon />}
                onClick={onManageVouchers}
                size="small"
              >
                Verwalten
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Subtotal and discount */}
        {voucherDiscount > 0 && (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Zwischensumme:</Typography>
              <Typography variant="body1">{subtotal.toFixed(2)} €</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1" color="error.main">
                Gutschein-Rabatt:
              </Typography>
              <Typography variant="body1" color="error.main" fontWeight="medium">
                -{voucherDiscount.toFixed(2)} €
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
          </>
        )}

        {/* Total */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2,
            p: 1.5,
            bgcolor: theme.palette.primary.main + '15',
            borderRadius: 1.5,
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
                py: 1.2,
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
              py: 1.2,
              boxShadow: 3,
              '&:hover': { boxShadow: 5 },
            }}
          >
            Zahlung abschließen
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default ShoppingCart;
