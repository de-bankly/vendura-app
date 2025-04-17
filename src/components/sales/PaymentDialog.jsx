import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EuroIcon from '@mui/icons-material/Euro';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio as MuiRadio,
  InputAdornment,
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  Divider,
  Zoom,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from '@mui/material';
import React from 'react';

/**
 * PaymentDialog component for processing payments
 */
const PaymentDialog = ({
  open,
  onClose,
  onComplete,
  total,
  cartItemsCount,
  voucherDiscount,
  appliedVouchers = [],
  giftCardPayment = 0,
  paymentMethod,
  onPaymentMethodChange,
  cashReceived,
  onCashReceivedChange,
  change,
  TransitionComponent,
}) => {
  const theme = useTheme();

  // Calculate the amount still to be paid after applying gift cards
  const remainingTotal = total - giftCardPayment;
  const hasGiftCardPayment = giftCardPayment > 0;
  const giftCardVouchers = appliedVouchers.filter(v => v.type === 'GIFT_CARD');

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionComponent}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: theme.shape.borderRadius * 1.5,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Zahlung abschließen
            </Typography>
          </Box>
          <Button color="inherit" onClick={onClose} sx={{ minWidth: 'auto', p: 1 }}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.primary.main + '15',
            border: `1px solid ${theme.palette.primary.light}`,
          }}
        >
          <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
            {total.toFixed(2)} €
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {cartItemsCount} Artikel im Warenkorb
          </Typography>

          {voucherDiscount > 0 && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 'medium' }}>
              Gutschein-Rabatt: {voucherDiscount.toFixed(2)} €
            </Typography>
          )}
        </Box>

        {/* Applied Gift Cards Section */}
        {hasGiftCardPayment && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              bgcolor: theme.palette.success.light + '15',
              border: `1px solid ${theme.palette.success.light}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <CardGiftcardIcon sx={{ mr: 1.5, color: theme.palette.success.main }} />
              <Typography variant="subtitle1" fontWeight="medium" color="success.main">
                Angewandte Geschenkkarten
              </Typography>
            </Box>

            <List dense disablePadding>
              {giftCardVouchers.map(voucher => (
                <ListItem key={voucher.id} sx={{ px: 1, py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <CardGiftcardIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Geschenkkarte: ${voucher.id.substring(0, 4)}...${voucher.id.substring(voucher.id.length - 4)}`}
                    secondary={
                      <>
                        <Typography component="span" variant="caption" display="block">
                          Verwendet: {(voucher.amount || 0).toFixed(2)} €
                        </Typography>
                        {voucher.remainingBalance !== undefined && (
                          <Typography component="span" variant="caption" display="block">
                            Restguthaben nach Transaktion:{' '}
                            {(voucher.remainingBalance - (voucher.amount || 0)).toFixed(2)} €
                          </Typography>
                        )}
                      </>
                    }
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ component: 'div' }}
                  />
                  <Chip
                    label={`${(voucher.amount || 0).toFixed(2)} €`}
                    size="small"
                    color="primary"
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 1 }} />

            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}
            >
              <Typography variant="body2" fontWeight="medium">
                Gesamtbetrag durch Geschenkkarten:
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary.main">
                {giftCardPayment.toFixed(2)} €
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 0.5,
              }}
            >
              <Typography variant="body2" fontWeight="medium">
                Verbleibender Betrag:
              </Typography>
              <Typography
                variant="body1"
                fontWeight="bold"
                color={remainingTotal > 0 ? 'text.primary' : 'success.main'}
              >
                {remainingTotal.toFixed(2)} €
              </Typography>
            </Box>
          </Box>
        )}

        {/* Payment Method Selection */}
        {remainingTotal > 0 ? (
          <>
            <Typography variant="h6" gutterBottom>
              Zahlungsmethode für {remainingTotal.toFixed(2)} €
            </Typography>
            <FormControl component="fieldset" sx={{ width: '100%', mb: 3 }}>
              <RadioGroup
                aria-label="payment-method"
                name="payment-method"
                value={paymentMethod}
                onChange={onPaymentMethodChange}
              >
                <Paper variant="outlined" sx={{ mb: 2, overflow: 'hidden' }}>
                  <FormControlLabel
                    value="cash"
                    control={<MuiRadio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocalAtmIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Barzahlung</Typography>
                      </Box>
                    }
                    sx={{
                      m: 0,
                      p: 2,
                      width: '100%',
                      borderBottom:
                        paymentMethod === 'cash' ? 'none' : `1px solid ${theme.palette.divider}`,
                    }}
                  />

                  {paymentMethod === 'cash' && (
                    <Box sx={{ p: 2, pt: 0 }}>
                      <TextField
                        fullWidth
                        label="Erhaltener Betrag"
                        variant="outlined"
                        value={cashReceived}
                        onChange={onCashReceivedChange}
                        type="number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EuroIcon />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ mt: 2 }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mt: 2,
                        }}
                      >
                        <Typography variant="body1">Rückgeld:</Typography>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          {parseFloat(change).toFixed(2)} €
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>

                <Paper variant="outlined">
                  <FormControlLabel
                    value="card"
                    control={<MuiRadio />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CreditCardIcon sx={{ mr: 1 }} />
                        <Typography variant="body1">Kartenzahlung</Typography>
                      </Box>
                    }
                    sx={{ m: 0, p: 2, width: '100%' }}
                  />
                </Paper>
              </RadioGroup>
            </FormControl>
          </>
        ) : (
          // If amount is fully covered by gift cards
          <Box
            sx={{
              p: 2,
              mb: 3,
              textAlign: 'center',
              borderRadius: theme.shape.borderRadius,
              bgcolor: theme.palette.success.light + '20',
            }}
          >
            <CheckCircleIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              Vollständig mit Geschenkkarten bezahlt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Der gesamte Betrag wurde mit Geschenkkarten abgedeckt. Keine weitere Zahlung
              erforderlich.
            </Typography>
          </Box>
        )}

        {/* Summary */}
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            mb: 1,
            borderColor: theme.palette.primary.main,
            bgcolor: theme.palette.primary.main + '05',
          }}
        >
          <Typography variant="subtitle1" gutterBottom fontWeight="medium">
            Zahlungszusammenfassung
          </Typography>

          <Box sx={{ '& > div': { py: 0.5 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Zwischensumme ({cartItemsCount} Artikel):
              </Typography>
              <Typography variant="body2">
                {(total + voucherDiscount + giftCardPayment).toFixed(2)} €
              </Typography>
            </Box>

            {voucherDiscount > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Rabatt:
                </Typography>
                <Typography variant="body2" color="error.main">
                  -{voucherDiscount.toFixed(2)} €
                </Typography>
              </Box>
            )}

            {giftCardPayment > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Geschenkkartenzahlung:
                </Typography>
                <Typography variant="body2" color="primary.main">
                  -{giftCardPayment.toFixed(2)} €
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 1 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1" fontWeight="bold">
                Zu zahlender Betrag:
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {total.toFixed(2)} €
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: theme.palette.background.default }}>
        <Button onClick={onClose} color="inherit" variant="outlined" startIcon={<CloseIcon />}>
          Abbrechen
        </Button>
        <Button
          onClick={onComplete}
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          sx={{
            px: 3,
            py: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          Zahlung abschließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
