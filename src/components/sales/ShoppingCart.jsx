import React from 'react';
import { Box, Paper, Typography, Divider, Stack } from '../../components/ui';
import { Button, Chip } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import SettingsIcon from '@mui/icons-material/Settings';
import ReceiptIcon from '@mui/icons-material/Receipt';

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
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ShoppingCartIcon sx={{ mr: 1 }} />
        <Typography variant="h5">Warenkorb</Typography>
        {cartItems.length > 0 && (
          <Chip
            label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
            color="primary"
            size="small"
            sx={{ ml: 1 }}
          />
        )}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Cart items */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
        {cartItems.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            Der Warenkorb ist leer
          </Typography>
        ) : (
          <Stack spacing={2}>
            {cartItems.map(item => (
              <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle1">{item.name}</Typography>
                  <Typography variant="subtitle1">
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
                    {item.price.toFixed(2)} € × {item.quantity}
                  </Typography>

                  <Box>
                    <Button
                      size="small"
                      onClick={() => onRemoveItem(item.id)}
                      sx={{ minWidth: '32px', p: 0.5 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </Button>

                    <Button
                      size="small"
                      onClick={() => onAddItem(item)}
                      sx={{ minWidth: '32px', p: 0.5 }}
                    >
                      <AddIcon fontSize="small" />
                    </Button>

                    <Button
                      size="small"
                      color="error"
                      onClick={() => onDeleteItem(item.id)}
                      sx={{ minWidth: '32px', p: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </Button>
                  </Box>
                </Box>
              </Paper>
            ))}

            {/* Applied vouchers */}
            {appliedVouchers.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Angewendete Gutscheine:
                </Typography>
                <Stack spacing={1}>
                  {appliedVouchers.map(voucher => (
                    <Paper
                      key={voucher.id}
                      variant="outlined"
                      sx={{ p: 1.5, bgcolor: 'background.default' }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CardGiftcardIcon
                            fontSize="small"
                            sx={{ mr: 1, color: 'primary.main' }}
                          />
                          <Typography variant="body2">{voucher.code}</Typography>
                        </Box>
                        <Typography variant="body2" color="error.main" fontWeight="medium">
                          -{voucher.value.toFixed(2)} €
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => onRemoveVoucher(voucher.id)}
                          sx={{ minWidth: '32px', p: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </Button>
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
      <Box>
        <Divider sx={{ mb: 2 }} />
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

        {/* Voucher buttons */}
        {!receiptReady && cartItems.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
              <Typography variant="body1" color="error.main">
                -{voucherDiscount.toFixed(2)} €
              </Typography>
            </Box>
          </>
        )}

        {/* Total */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Gesamtsumme:</Typography>
          <Typography variant="h6">{total.toFixed(2)} €</Typography>
        </Box>

        {receiptReady ? (
          <Stack spacing={2}>
            <Button
              variant="contained"
              color="success"
              fullWidth
              startIcon={<ReceiptIcon />}
              onClick={onPrintReceipt}
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
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="error"
              fullWidth
              startIcon={<DeleteIcon />}
              onClick={onClearCart}
              disabled={cartItems.length === 0}
            >
              Leeren
            </Button>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<PaymentIcon />}
              onClick={onPayment}
              disabled={cartItems.length === 0}
            >
              Bezahlen
            </Button>
          </Stack>
        )}
      </Box>
    </Paper>
  );
};

export default ShoppingCart;
