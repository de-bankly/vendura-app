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
 * Formats a card number string by adding spaces every 4 digits.
 * Only allows digits and limits length between 4 and 16.
 * @param {string} value - The card number string to format.
 * @returns {string} The formatted card number string (e.g., "1234 5678 1234 5678").
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
 * Formats an expiration date string into MM/YY format.
 * Removes non-digit characters and validates the month part (01-12).
 * @param {string} value - The expiration date string to format.
 * @returns {string} The formatted expiration date string (e.g., "12/25").
 */
const formatExpirationDate = value => {
  const cleanValue = value.replace(/[^\d]/g, '');

  if (cleanValue.length <= 2) {
    return cleanValue;
  }

  let month = cleanValue.substring(0, 2);
  const year = cleanValue.substring(2);

  if (parseInt(month) > 12) {
    month = '12';
  }

  return `${month}/${year}`;
};

/**
 * A custom styled Material UI Radio component.
 * @param {object} props - The props passed to the MuiRadio component.
 * @returns {React.ReactElement} The styled Radio component.
 */
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

/**
 * Renders a selectable payment method option with an icon, label, and description.
 * Applies visual styles based on whether it's checked and provides hover effects.
 * @param {object} props - The component props.
 * @param {string} props.value - The value associated with this payment option.
 * @param {string} props.label - The main label for the payment option.
 * @param {React.ElementType} props.icon - The icon component to display.
 * @param {string} props.description - A short description of the payment option.
 * @param {boolean} props.checked - Whether this option is currently selected.
 * @param {function} props.onChange - Callback function triggered when the option is clicked.
 * @returns {React.ReactElement} The PaymentMethodOption component.
 */
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
 * A dialog component for handling the payment process.
 * It allows selecting payment methods (cash, card), entering details,
 * applying discounts/gift cards/deposit credits, and summarizing the transaction.
 * @param {object} props - The component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {function} props.onClose - Callback function when the dialog is requested to close.
 * @param {function} [props.onComplete=()=>{}] - Callback function when the payment is confirmed.
 * @param {number} props.total - The final amount to be paid after all deductions.
 * @param {number} props.cartItemsCount - The number of items in the cart.
 * @param {number} props.voucherDiscount - The total discount amount from vouchers.
 * @param {Array} [props.appliedVouchers=[]] - An array of applied voucher objects.
 * @param {number} [props.giftCardPayment=0] - The total amount paid via gift cards.
 * @param {string} props.paymentMethod - The currently selected payment method ('cash', 'card', 'deposit', 'giftcard').
 * @param {function} props.onPaymentMethodChange - Callback function when the payment method changes.
 * @param {string} props.cashReceived - The amount of cash received (as a string).
 * @param {function} props.onCashReceivedChange - Callback function when the cash received amount changes.
 * @param {object} props.cardDetails - An object containing card details { cardNumber, cardHolderName, expirationDate, cvv }.
 * @param {function} props.onCardDetailsChange - Callback function to update card details.
 * @param {string} props.change - The calculated change amount (as a string).
 * @param {React.ElementType} [props.TransitionComponent] - The transition component for the dialog.
 * @param {boolean} [props.loading=false] - Indicates if the payment process is in progress.
 * @param {number} [props.depositCredit=0] - The amount of available deposit credit.
 * @returns {React.ReactElement} The PaymentDialog component.
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

  const totalBeforeDeductions = total + depositCredit + giftCardPayment + voucherDiscount;
  const remainingTotal = Math.max(0, total);

  const hasGiftCardPayment = giftCardPayment > 0;
  const hasDepositCredit = depositCredit > 0;
  const hasVoucherDiscount = voucherDiscount > 0;

  const giftCardVouchers = appliedVouchers.filter(v => v.type === 'GIFT_CARD');
  const discountVouchers = appliedVouchers.filter(v => v.type === 'DISCOUNT_CARD');

  const isFullyCoveredByDeposit = depositCredit >= totalBeforeDeductions;
  const remainingAfterDeposit = Math.max(0, totalBeforeDeductions - depositCredit);
  const isFullyCoveredByGiftCards = giftCardPayment >= remainingAfterDeposit;

  useEffect(() => {
    if (paymentMethod !== 'card') {
      setCardErrors({
        cardNumber: '',
        cardHolderName: '',
        expirationDate: '',
        cvv: '',
      });
    }
  }, [paymentMethod]);

  useEffect(() => {
    if (open && remainingTotal <= 0.01) {
      if (isFullyCoveredByDeposit) {
        onPaymentMethodChange({ target: { value: 'deposit' } });
      } else if (isFullyCoveredByGiftCards) {
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

  const handleCardNumberChange = e => {
    const formattedValue = formatCardNumber(e.target.value);
    onCardDetailsChange('cardNumber', formattedValue);
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

  const handleExpirationDateChange = e => {
    const formattedValue = formatExpirationDate(e.target.value);
    onCardDetailsChange('expirationDate', formattedValue);
    if (formattedValue.length > 0 && formattedValue.length < 5) {
      setCardErrors(prev => ({
        ...prev,
        expirationDate: 'Bitte geben Sie Monat/Jahr ein',
      }));
    } else {
      setCardErrors(prev => ({ ...prev, expirationDate: '' }));
    }
  };

  const validateCardDetails = () => {
    let hasErrors = false;
    const newErrors = {
      cardNumber: '',
      cardHolderName: '',
      expirationDate: '',
      cvv: '',
    };

    if (paymentMethod === 'card') {
      if (!cardDetails.cardNumber.trim()) {
        newErrors.cardNumber = 'Kartennummer ist erforderlich';
        hasErrors = true;
      } else if (cardDetails.cardNumber.replace(/\s+/g, '').length < 13) {
        newErrors.cardNumber = 'Kartennummer muss mindestens 13 Ziffern enthalten';
        hasErrors = true;
      }

      if (!cardDetails.cardHolderName.trim()) {
        newErrors.cardHolderName = 'Name ist erforderlich';
        hasErrors = true;
      }

      if (!cardDetails.expirationDate.trim()) {
        newErrors.expirationDate = 'Ablaufdatum ist erforderlich';
        hasErrors = true;
      } else if (cardDetails.expirationDate.length < 5) {
        newErrors.expirationDate = 'Ungültiges Ablaufdatum';
        hasErrors = true;
      }

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

    if (remainingTotal <= 0.01) return true;

    if (paymentMethod === 'deposit') {
      return Math.abs(depositCredit - total) < 0.01 || depositCredit >= total;
    }

    if (paymentMethod === 'cash') {
      return parseFloat(cashReceived) >= total - 0.005;
    }

    if (paymentMethod === 'card') {
      return (
        cardDetails.cardNumber.replace(/\s/g, '').length >= 13 &&
        cardDetails.cardHolderName.trim().length > 3 &&
        cardDetails.expirationDate.length === 5 &&
        cardDetails.cvv.length >= 3 &&
        !cardErrors.cardNumber &&
        !cardErrors.cardHolderName &&
        !cardErrors.expirationDate &&
        !cardErrors.cvv
      );
    }

    if (paymentMethod === 'giftcard') {
      return remainingTotal <= 0.01;
    }

    return false;
  }, [
    paymentMethod,
    loading,
    cashReceived,
    total,
    cardDetails,
    depositCredit,
    remainingTotal,
    cardErrors,
  ]);

  const handleCompletePayment = () => {
    if (paymentMethod === 'card' && !validateCardDetails()) {
      return;
    }
    if (!canCompletePayment()) return;
    onComplete();
  };

  const calculateChange = () => {
    if (paymentMethod === 'cash' && parseFloat(cashReceived) >= total) {
      return parseFloat(cashReceived) - total;
    }
    return 0;
  };

  const handlePaymentMethodChange = method => {
    onPaymentMethodChange({ target: { value: method } });
  };

  const renderPaymentMethodContent = () => {
    if (remainingTotal <= 0.01) {
      return (
        <Box
          sx={{
            my: 2,
            p: 2,
            bgcolor: alpha(theme.palette.success.light, 0.1),
            borderRadius: 2,
          }}
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
            type="number"
            inputProps={{ step: '0.01', min: '0' }}
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
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle1" fontWeight={600}>
                  Rückgeld:
                </Typography>
                <Typography variant="h5" color="success.main" fontWeight={700}>
                  {(Math.round(calculateChange() * 100) / 100).toFixed(2)} €
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
              inputProps={{ maxLength: 4, inputMode: 'numeric' }}
              type="number"
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
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
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

        {(hasGiftCardPayment || hasVoucherDiscount || hasDepositCredit) && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ mb: 3 }}
          >
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Angewendete Gutschriften & Rabatte
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
                      primary={`Geschenkkarte: ${voucher.code}`}
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
                      secondary={`Angewendet: ${
                        voucher.discountAmount?.toFixed(2) || voucherDiscount.toFixed(2)
                      } € (${voucher.discountPercentage}%)`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                ))}
                {hasDepositCredit && (
                  <ListItem disablePadding sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <ReceiptIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Pfandguthaben"
                      secondary={`Angewendet: ${depositCredit.toFixed(2)} €`}
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItem>
                )}
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
                  Gesamte Verrechnung:
                </Typography>
                <Typography variant="body2" fontWeight={600} color="info.main">
                  {(giftCardPayment + voucherDiscount + depositCredit).toFixed(2)} €
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}

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
                {totalBeforeDeductions.toFixed(2)} €
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
  cardDetails: PropTypes.shape({
    cardNumber: PropTypes.string,
    cardHolderName: PropTypes.string,
    expirationDate: PropTypes.string,
    cvv: PropTypes.string,
  }).isRequired,
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
