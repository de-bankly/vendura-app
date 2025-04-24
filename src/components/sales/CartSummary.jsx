import { Box, Stack, Typography, alpha, useTheme, Paper } from '@mui/material';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import DiscountIcon from '@mui/icons-material/Discount';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { motion } from 'framer-motion';

/**
 * Displays a summary of the cart totals, including subtotal, discounts, credits, and the final total.
 *
 * @param {object} props - The component props.
 * @param {number} props.subtotal - The subtotal after product discounts but before other deductions.
 * @param {number} props.voucherDiscount - The amount discounted via vouchers.
 * @param {number} [props.depositCredit=0] - The amount credited from deposits.
 * @param {number} [props.giftCardPayment=0] - The amount paid using gift cards.
 * @param {number} props.total - The final total amount to be paid.
 * @param {number} [props.productDiscount=0] - The total amount discounted directly from products.
 * @returns {React.ReactElement} The rendered cart summary component.
 */
const CartSummary = ({
  subtotal,
  voucherDiscount,
  depositCredit,
  giftCardPayment,
  total,
  productDiscount = 0,
}) => {
  const theme = useTheme();

  const originalTotal = subtotal + productDiscount;
  const hasAnyDiscount =
    voucherDiscount > 0 || productDiscount > 0 || depositCredit > 0 || giftCardPayment > 0;
  const totalSavings = productDiscount + voucherDiscount + depositCredit + giftCardPayment;

  const SummaryItem = ({ label, value, color, icon: Icon, hideZero = false, bold = false }) => {
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
