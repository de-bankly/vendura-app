import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EuroIcon from '@mui/icons-material/Euro';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
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
  Avatar,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

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

// Custom styled Radio component
const Radio = props => {
  return (
    <MuiRadio
      sx={{
        '& .MuiSvgIcon-root': {
          fontSize: 24,
        },
        '&.Mui-checked': {
          color: theme => theme.palette.primary.main,
        },
      }}
      {...props}
    />
  );
};

// Payment method option component
const PaymentMethodOption = ({ value, label, icon: Icon, description, checked, onChange }) => {
  const theme = useTheme();

  return (
    <Box
      component={motion.div}
      whileHover={{ y: -3 }}
      onClick={() => onChange(value)}
      sx={{
        cursor: 'pointer',
        border: `1px solid ${checked ? theme.palette.primary.main : theme.palette.divider}`,
        borderRadius: 2,
        p: 2,
        transition: theme.transitions.create(['border-color', 'box-shadow', 'background-color']),
        backgroundColor: checked
          ? alpha(theme.palette.primary.main, 0.05)
          : theme.palette.background.paper,
        boxShadow: checked ? theme.shadows[1] : 'none',
        '&:hover': {
          borderColor: theme.palette.primary.main,
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Radio
          checked={checked}
          value={value}
          name="payment-method"
          inputProps={{ 'aria-label': label }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: checked
              ? alpha(theme.palette.primary.main, 0.15)
              : alpha(theme.palette.text.primary, 0.05),
            color: checked ? theme.palette.primary.main : theme.palette.text.primary,
            ml: 1,
            mr: 2,
          }}
        >
          <Icon fontSize="medium" />
        </Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={600}>
            {label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

PaymentMethodOption.propTypes = {
  value: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  description: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
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
  depositCredit = 0,
}) => {
  const theme = useTheme();
  const [cardErrors, setCardErrors] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });

  // Calculate the amount to be paid in the correct order:
  // Start with total price
  // 1. Subtract deposit credits
  // 2. Subtract gift card payment
  // 3. Subtract voucher discounts
  // The result is what needs to be paid in cash or by card
  const totalBeforeDeductions = total + depositCredit + giftCardPayment + voucherDiscount;
  const remainingTotal = Math.max(0, total);

  const hasGiftCardPayment = giftCardPayment > 0;
  const hasDepositCredit = depositCredit > 0;
  const hasVoucherDiscount = voucherDiscount > 0;

  const giftCardVouchers = appliedVouchers.filter(v => v.type === 'GIFT_CARD');
  const discountVouchers = appliedVouchers.filter(v => v.type === 'DISCOUNT_CARD');

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

  // Check if deposit fully covers the payment
  const isFullyCoveredByDeposit = depositCredit >= totalBeforeDeductions;

  // Check if gift cards fully cover the remaining payment after deposit
  const remainingAfterDeposit = Math.max(0, totalBeforeDeductions - depositCredit);
  const isFullyCoveredByGiftCards = giftCardPayment >= remainingAfterDeposit;

  // Handle when the customer has no actual remaining payment to make
  useEffect(() => {
    if (open && remainingTotal <= 0.01) {
      // Auto-select the most relevant payment method when payment is fully covered
      if (isFullyCoveredByDeposit) {
        // If deposit covers everything, select deposit payment
        onPaymentMethodChange({ target: { value: 'deposit' } });
      } else if (isFullyCoveredByGiftCards) {
        // If gift cards cover everything after deposit, select gift card payment
        onPaymentMethodChange({ target: { value: 'giftcard' } });
      }
    }
  }, [
    open,
    remainingTotal,
    isFullyCoveredByDeposit,
    isFullyCoveredByGiftCards,
    onPaymentMethodChange,
  ]);

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

  const canCompletePayment = useCallback(() => {
    if (loading) return false;

    // Für Pfandbeleg-Zahlungsmethode prüfen, ob der Pfandwert ausreicht
    if (paymentMethod === 'deposit') {
      // Prüfen, ob das Pfandguthaben ausreicht (mit kleiner Toleranz für Rundungsfehler)
      return Math.abs(depositCredit - total) < 0.01 || depositCredit >= total;
    }

    // Für Barzahlung prüfen, ob genug Bargeld gegeben wurde
    if (paymentMethod === 'cash') {
      return parseFloat(cashReceived) >= total - 0.005;
    }

    // Für Kartenzahlung prüfen, ob alle erforderlichen Felder ausgefüllt sind
    if (paymentMethod === 'card') {
      return (
        cardDetails.cardNumber.replace(/\s/g, '').length >= 13 &&
        cardDetails.cardHolderName.trim().length > 3 &&
        cardDetails.expirationDate.length === 5 &&
        cardDetails.cvv.length >= 3
      );
    }

    return true;
  }, [paymentMethod, loading, cashReceived, total, cardDetails, depositCredit]);

  // Handle payment completion with validation
  const handleCompletePayment = () => {
    if (!canCompletePayment()) return;
    onComplete();
  };

  // Calculate change based on payment method and amount
  const calculateChange = () => {
    if (paymentMethod === 'cash' && parseFloat(cashReceived) >= total) {
      return parseFloat(cashReceived) - total;
    }
    return 0;
  };

  // Handle changing payment method
  const handlePaymentMethodChange = method => {
    onPaymentMethodChange({ target: { value: method } });
  };

  // Main content of the dialog based on payment method
  const renderPaymentMethodContent = () => {
    // If there's no remaining total, we don't need additional payment details
    if (remainingTotal <= 0.01) {
      return (
        <Box
          sx={{ my: 2, p: 2, bgcolor: alpha(theme.palette.success.light, 0.1), borderRadius: 2 }}
        >
          <Typography variant="subtitle1" color="success.main" fontWeight={600}>
            {isFullyCoveredByDeposit
              ? 'Der gesamte Betrag wird durch Pfandguthaben abgedeckt.'
              : 'Der gesamte Betrag wird durch Gutscheine abgedeckt.'}
          </Typography>
          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
            Keine zusätzliche Zahlung erforderlich.
          </Typography>
        </Box>
      );
    }

    if (paymentMethod === 'cash') {
      return (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Erhaltener Betrag"
            variant="outlined"
            fullWidth
            value={cashReceived}
            onChange={onCashReceivedChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EuroIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {parseFloat(cashReceived) >= remainingTotal && (
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.success.light, 0.1),
                borderColor: theme.palette.success.light,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  Rückgeld:
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight={700}>
                  {(Math.round(change * 100) / 100).toFixed(2)} €
                </Typography>
              </Box>
            </Paper>
          )}
        </Box>
      );
    }

    if (paymentMethod === 'card') {
      return (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Kartennummer"
            variant="outlined"
            fullWidth
            value={cardDetails.cardNumber}
            onChange={handleCardNumberChange}
            error={!!cardErrors.cardNumber}
            helperText={cardErrors.cardNumber}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CreditCardIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Karteninhaber"
            variant="outlined"
            fullWidth
            value={cardDetails.cardHolderName}
            onChange={e => onCardDetailsChange('cardHolderName', e.target.value)}
            error={!!cardErrors.cardHolderName}
            helperText={cardErrors.cardHolderName}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Gültig bis (MM/JJ)"
              variant="outlined"
              fullWidth
              value={cardDetails.expirationDate}
              onChange={handleExpirationDateChange}
              error={!!cardErrors.expirationDate}
              helperText={cardErrors.expirationDate}
              placeholder="MM/JJ"
              inputProps={{ maxLength: 5 }}
            />
            <TextField
              label="CVV"
              variant="outlined"
              fullWidth
              value={cardDetails.cvv}
              onChange={e => onCardDetailsChange('cvv', e.target.value)}
              error={!!cardErrors.cvv}
              helperText={cardErrors.cvv}
              inputProps={{ maxLength: 4 }}
            />
          </Box>
        </Box>
      );
    }

    if (paymentMethod === 'deposit') {
      return (
        <Box sx={{ mt: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.info.light, 0.1),
              borderColor: theme.palette.info.light,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={600}>
                Verfügbares Pfandguthaben:
              </Typography>
              <Typography variant="h5" color="info.main" fontWeight={700}>
                {(Math.round(depositCredit * 100) / 100).toFixed(2)} €
              </Typography>
            </Box>
          </Paper>
        </Box>
      );
    }

    if (paymentMethod === 'giftcard') {
      // Display gift card information
      return (
        <Box sx={{ mt: 2 }}>
          {giftCardVouchers.length > 0 ? (
            <List>
              {giftCardVouchers.map((voucher, index) => (
                <ListItem
                  key={index}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.light, 0.05),
                    mb: 1,
                    borderRadius: 1,
                  }}
                >
                  <ListItemIcon>
                    <CardGiftcardIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={`Gutschein: ${voucher.code || '—'}`}
                    secondary={`Wert: ${(Math.round(voucher.amount * 100) / 100).toFixed(2)} €`}
                  />
                  <Chip
                    label={`${(Math.round(voucher.amount * 100) / 100).toFixed(2)} €`}
                    color="primary"
                    variant="outlined"
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
              Keine Gutscheine angewendet
            </Typography>
          )}
        </Box>
      );
    }

    // Default empty state
    return null;
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
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.2),
                color: 'white',
                width: 42,
                height: 42,
                mr: 2,
                boxShadow: theme.shadows[3],
              }}
            >
              <PaymentIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Zahlung abschließen
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.5 }}>
                Gesamtbetrag: {total.toFixed(2)} € • {cartItemsCount} Artikel
              </Typography>
            </Box>
          </Box>
          <Button
            color="inherit"
            onClick={onClose}
            size="large"
            sx={{
              bgcolor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.common.white, 0.2),
              },
            }}
            aria-label="Schließen"
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Payment method selection */}
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2, mt: 1.5 }}>
          Zahlungsmethode
        </Typography>

        <Box
          component={FormControl}
          fullWidth
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <PaymentMethodOption
            value="cash"
            label="Barzahlung"
            icon={LocalAtmIcon}
            description="Zahlung mit Bargeld"
            checked={paymentMethod === 'cash'}
            onChange={handlePaymentMethodChange}
          />

          <PaymentMethodOption
            value="card"
            label="Kartenzahlung"
            icon={CreditCardIcon}
            description="Debit- oder Kreditkarte"
            checked={paymentMethod === 'card'}
            onChange={handlePaymentMethodChange}
          />
        </Box>

        {renderPaymentMethodContent()}

        {/* Applied gift cards/vouchers */}
        {hasGiftCardPayment && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Angewendete Gutscheine
            </Typography>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.info.main, 0.05),
                borderColor: alpha(theme.palette.info.main, 0.3),
              }}
            >
              <List disablePadding dense>
                {giftCardVouchers.map(voucher => (
                  <ListItem key={voucher.id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CardGiftcardIcon color="info" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Gutschein: ${voucher.code}`}
                      secondary={`Angewendet: ${voucher.value.toFixed(2)} €`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}

                {discountVouchers.map(voucher => (
                  <ListItem key={voucher.id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <LocalOfferIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Rabattgutschein: ${voucher.code}`}
                      secondary={`Angewendet: ${voucher.discountAmount?.toFixed(2) || voucherDiscount.toFixed(2)} € (${voucher.discountPercentage}%)`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
              </List>
              <Box
                sx={{
                  mt: 1.5,
                  pt: 1.5,
                  borderTop: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Typography variant="body2" fontWeight={500}>
                  Gesamtgutschriften:
                </Typography>
                <Typography variant="body2" fontWeight={600} color="info.main">
                  {giftCardPayment.toFixed(2)} €
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Payment summary */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ mb: 3 }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Zahlungsübersicht
          </Typography>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderColor: alpha(theme.palette.divider, 0.8),
            }}
          >
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                rowGap: 1.5,
                columnGap: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Zwischensumme ({cartItemsCount} Artikel):
              </Typography>
              <Typography variant="body2" fontWeight={500} textAlign="right">
                {(total + voucherDiscount + giftCardPayment).toFixed(2)} €
              </Typography>

              {voucherDiscount > 0 && (
                <>
                  <Typography variant="body2" color="error.main">
                    Gutschein-Rabatt:
                  </Typography>
                  <Typography variant="body2" fontWeight={500} color="error.main" textAlign="right">
                    -{voucherDiscount.toFixed(2)} €
                  </Typography>
                </>
              )}

              {giftCardPayment > 0 && (
                <>
                  <Typography variant="body2" color="info.main">
                    Geschenkkarten:
                  </Typography>
                  <Typography variant="body2" fontWeight={500} color="info.main" textAlign="right">
                    -{giftCardPayment.toFixed(2)} €
                  </Typography>
                </>
              )}

              {depositCredit > 0 && (
                <>
                  <Typography variant="body2" color="success.main">
                    Pfand-Guthaben:
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={500}
                    color="success.main"
                    textAlign="right"
                  >
                    -{depositCredit.toFixed(2)} €
                  </Typography>
                </>
              )}

              <Divider sx={{ gridColumn: '1 / -1', my: 0.5 }} />

              <Typography variant="subtitle2" fontWeight={600}>
                Zu zahlender Betrag:
              </Typography>
              <Typography
                variant="subtitle1"
                fontWeight={700}
                color="primary.main"
                textAlign="right"
              >
                {remainingTotal.toFixed(2)} €
              </Typography>
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: theme.palette.background.default,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          disabled={loading}
          startIcon={<CloseIcon />}
          sx={{
            borderRadius: 2,
            px: 2,
            py: 1,
          }}
        >
          Abbrechen
        </Button>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Button
            onClick={handleCompletePayment}
            variant="contained"
            color="primary"
            disabled={!canCompletePayment()}
            startIcon={loading ? null : <CheckCircleIcon />}
            sx={{
              px: 3,
              py: 1.2,
              borderRadius: 2,
              boxShadow: 3,
              minWidth: 200,
              '&:hover': {
                boxShadow: 5,
              },
            }}
          >
            {loading ? 'Verarbeitung...' : 'Zahlung bestätigen'}
          </Button>
        </motion.div>
      </DialogActions>
    </Dialog>
  );
};

PaymentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func,
  total: PropTypes.number.isRequired,
  cartItemsCount: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number.isRequired,
  appliedVouchers: PropTypes.array,
  giftCardPayment: PropTypes.number,
  paymentMethod: PropTypes.string.isRequired,
  onPaymentMethodChange: PropTypes.func.isRequired,
  cashReceived: PropTypes.string.isRequired,
  onCashReceivedChange: PropTypes.func.isRequired,
  cardDetails: PropTypes.object.isRequired,
  onCardDetailsChange: PropTypes.func.isRequired,
  change: PropTypes.string.isRequired,
  TransitionComponent: PropTypes.elementType,
  loading: PropTypes.bool,
  depositCredit: PropTypes.number,
};

PaymentDialog.defaultProps = {
  onComplete: () => {},
  appliedVouchers: [],
  giftCardPayment: 0,
  loading: false,
  depositCredit: 0,
};

export default PaymentDialog;
