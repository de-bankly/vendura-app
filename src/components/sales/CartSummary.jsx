import { Box, Divider, Stack, Typography, alpha, useTheme, Paper } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DiscountIcon from '@mui/icons-material/Discount';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';

const CartSummary = ({
  subtotal,
  voucherDiscount,
  depositCredit,
  giftCardPayment,
  total,
  productDiscount = 0,
}) => {
  const theme = useTheme();

  // Calculate the original total before any discounts
  const originalTotal = subtotal + productDiscount;

  // Determine if we have any discounts at all
  const hasAnyDiscount =
    voucherDiscount > 0 || productDiscount > 0 || depositCredit > 0 || giftCardPayment > 0;

  // Calculate total savings
  const totalSavings = productDiscount + voucherDiscount + depositCredit + giftCardPayment;

  // Summary item component for consistent styling
  const SummaryItem = ({ label, value, color, icon: Icon, hideZero = false, bold = false }) => {
    // Don't render if value is zero and hideZero is true
    if (hideZero && value === 0) return null;

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 0.75,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {Icon && (
            <Box sx={{ mr: 1, display: 'flex', color: color || 'text.primary' }}>
              <Icon fontSize="small" />
            </Box>
          )}
          <Typography variant="body2" color={color || 'text.primary'} fontWeight={bold ? 600 : 400}>
            {label}
          </Typography>
        </Box>
        <Typography variant="body2" color={color || 'text.primary'} fontWeight={bold ? 600 : 400}>
          {typeof value === 'string' ? value : formatCurrency(value)}
        </Typography>
      </Box>
    );
  };

  return (
    <Stack spacing={3}>
      {/* Original subtotal and discounts */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: alpha(theme.palette.background.default, 0.6),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        }}
      >
        <SummaryItem label="Originalsumme" value={originalTotal} icon={ShoppingCartCheckoutIcon} />

        <SummaryItem
          label="Produktrabatte"
          value={-productDiscount}
          color="error.main"
          icon={DiscountIcon}
          hideZero
          bold
        />

        {hasAnyDiscount && (
          <SummaryItem label="Zwischensumme" value={subtotal} bold={hasAnyDiscount} />
        )}

        {/* Display in the correct order: 1. deposit, 2. giftcard amounts, 3. giftcard discount, 4. cash */}
        <SummaryItem
          label="Pfand-Guthaben"
          value={-depositCredit}
          color={depositCredit > 0 ? 'error.main' : 'text.primary'}
          icon={ReceiptIcon}
          hideZero
          bold
        />

        <SummaryItem
          label="Gutschein-Zahlung"
          value={-giftCardPayment}
          color="error.main"
          icon={CreditCardIcon}
          hideZero
          bold
        />

        <SummaryItem
          label="Gutschein-Rabatt"
          value={-voucherDiscount}
          color="error.main"
          icon={DiscountIcon}
          hideZero
          bold
        />

        {totalSavings > 0 && (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            sx={{
              mt: 1.5,
              pt: 1.5,
              borderTop: `1px dashed ${alpha(theme.palette.error.main, 0.3)}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" fontWeight={500} color="error.main">
              Gesamtersparnis:
            </Typography>
            <Typography variant="body2" fontWeight={600} color="error.main">
              {formatCurrency(totalSavings)}
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Total */}
      <Box
        component={motion.div}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Gesamtsumme:
        </Typography>
        <Typography
          variant="h5"
          fontWeight={700}
          color="primary.main"
          sx={{ letterSpacing: '-0.01em' }}
        >
          {formatCurrency(total)}
        </Typography>
      </Box>
    </Stack>
  );
};

CartSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number.isRequired,
  depositCredit: PropTypes.number,
  giftCardPayment: PropTypes.number,
  total: PropTypes.number.isRequired,
  productDiscount: PropTypes.number,
};

CartSummary.defaultProps = {
  depositCredit: 0,
  giftCardPayment: 0,
  productDiscount: 0,
};

export default CartSummary;
