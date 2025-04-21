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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormHelperText,
} from '@mui/material';
import React, { useState, useEffect } from 'react';

/**
 * Format card number with spaces (4 digits groups)
 * @param {string} value - Card number to format
 * @returns {string} Formatted card number
 */
const formatCardNumber = value => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

/**
 * Format expiration date (MM/YY)
 * @param {string} value - Expiration date to format
 * @returns {string} Formatted expiration date
 */
const formatExpirationDate = value => {
  const cleanValue = value.replace(/[^\d]/g, '');

  if (cleanValue.length <= 2) {
    return cleanValue;
  }

  let month = cleanValue.substring(0, 2);
  const year = cleanValue.substring(2);

  // Validate month (01-12)
  if (parseInt(month) > 12) {
    month = '12';
  }

  return `${month}/${year}`;
};

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
  cardDetails,
  onCardDetailsChange,
  change,
  TransitionComponent,
  loading = false,
}) => {
  const theme = useTheme();
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });

  // Calculate the amount still to be paid after applying gift cards
  const remainingTotal = total - giftCardPayment;
  const hasGiftCardPayment = giftCardPayment > 0;
  const giftCardVouchers = appliedVouchers.filter(v => v.type === 'GIFT_CARD');

  // Validate card details when payment method is card
  useEffect(() => {
    if (paymentMethod !== 'card') {
      setCardErrors({
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: '',
      });
      return;
    }
  }, [paymentMethod]);

  // Handle formatted card number input
  const handleCardNumberChange = e => {
    const formattedValue = formatCardNumber(e.target.value);
    onCardDetailsChange('cardNumber', formattedValue);

    // Validate card number
    const cleanValue = formattedValue.replace(/\s+/g, '');
    if (cleanValue.length > 0 && cleanValue.length < 13) {
      setCardErrors(prev => ({
        ...prev,
        cardNumber: 'Kartennummer muss mindestens 13 Ziffern enthalten',
      }));
    } else {
      setCardErrors(prev => ({ ...prev, cardNumber: '' }));
    }
  };

  // Handle formatted expiration date input
  const handleExpirationDateChange = e => {
    const formattedValue = formatExpirationDate(e.target.value);
    onCardDetailsChange('expirationDate', formattedValue);

    // Validate expiration date
    if (formattedValue.length > 0 && formattedValue.length < 5) {
      setCardErrors(prev => ({ ...prev, expirationDate: 'Bitte geben Sie Monat/Jahr ein' }));
    } else {
      setCardErrors(prev => ({ ...prev, expirationDate: '' }));
    }
  };

  // Validate all card fields
  const validateCardDetails = () => {
    let hasErrors = false;
    const newErrors = { ...cardErrors };

    if (paymentMethod === 'card') {
      // Card number validation
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Kartennummer ist erforderlich';
        hasErrors = true;
      } else if (cardDetails.cardNumber.replace(/\s+/g, '').length < 13) {
        newErrors.cardNumber = 'Kartennummer muss mindestens 13 Ziffern enthalten';
        hasErrors = true;
      }

      // Card holder validation
      if (!cardDetails.cardHolderName.trim()) {
        newErrors.cardHolderName = 'Name ist erforderlich';
        hasErrors = true;
      }

      // Expiration date validation
      if (!cardDetails.expirationDate.trim()) {
        newErrors.expirationDate = 'Ablaufdatum ist erforderlich';
        hasErrors = true;
      } else if (cardDetails.expirationDate.length < 5) {
        newErrors.expirationDate = 'Ungültiges Ablaufdatum';
        hasErrors = true;
      }

      // CVV validation
      if (!cardDetails.cvv.trim()) {
        newErrors.cvv = 'CVV ist erforderlich';
        hasErrors = true;
      } else if (cardDetails.cvv.length < 3) {
        newErrors.cvv = 'CVV muss 3 Ziffern enthalten';
        hasErrors = true;
      }
    }

    setCardErrors(newErrors);
    return !hasErrors;
  };

  // Handle payment completion with validation
  const handleCompletePayment = () => {
    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }
    onComplete();
  };

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
                  {paymentMethod === 'card' && (
                    <Box sx={{ p: 2, pt: 0 }}>
                      <TextField
                        fullWidth
                        label="Kartennummer"
                        variant="outlined"
                        placeholder="1234 5678 9012 3456"
                        inputProps={{ maxLength: 19 }}
                        value={cardDetails.cardNumber}
                        onChange={handleCardNumberChange}
                        error={!!cardErrors.cardNumber}
                        helperText={cardErrors.cardNumber}
                        sx={{ mt: 2, mb: 2 }}
                      />
                      <TextField
                        fullWidth
                        label="Karteninhaber"
                        variant="outlined"
                        placeholder="Name des Karteninhabers"
                        value={cardDetails.cardHolderName}
                        onChange={e => onCardDetailsChange('cardHolderName', e.target.value)}
                        error={!!cardErrors.cardHolderName}
                        helperText={cardErrors.cardHolderName}
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                          label="Ablaufdatum"
                          variant="outlined"
                          placeholder="MM/JJ"
                          inputProps={{ maxLength: 5 }}
                          value={cardDetails.expirationDate}
                          onChange={handleExpirationDateChange}
                          error={!!cardErrors.expirationDate}
                          helperText={cardErrors.expirationDate}
                          sx={{ flex: 1 }}
                        />
                        <TextField
                          label="CVC/CVV"
                          variant="outlined"
                          placeholder="123"
                          type="password"
                          inputProps={{ maxLength: 3 }}
                          value={cardDetails.cvv}
                          onChange={e => onCardDetailsChange('cvv', e.target.value)}
                          error={!!cardErrors.cvv}
                          helperText={cardErrors.cvv}
                          sx={{ flex: 1 }}
                        />
                      </Box>
                    </Box>
                  )}
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
        <Button
          onClick={onClose}
          color="inherit"
          variant="outlined"
          startIcon={<CloseIcon />}
          disabled={loading}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleCompletePayment}
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          disabled={loading}
          sx={{
            px: 3,
            py: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          {loading ? 'Verarbeitung...' : 'Zahlung abschließen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
