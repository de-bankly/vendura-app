import { Box, Divider, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const CartSummary = ({ subtotal, voucherDiscount, total, productDiscount = 0 }) => {
  const theme = useTheme();

  // Calculate the original total before any discounts
  const originalTotal = subtotal + productDiscount;

  // Determine if we have any discounts at all
  const hasAnyDiscount = voucherDiscount > 0 || productDiscount > 0;

  return (
    <>
      <Divider sx={{ my: 2 }} />

      {/* Subtotal and discount */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1">Originalsumme:</Typography>
          <Typography variant="body1">{formatCurrency(originalTotal)}</Typography>
        </Box>

        {productDiscount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" color="error.main">
              Produktrabatte:
            </Typography>
            <Typography variant="body1" color="error.main" fontWeight="medium">
              -{formatCurrency(productDiscount)}
            </Typography>
          </Box>
        )}

        {hasAnyDiscount && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1">Zwischensumme:</Typography>
            <Typography variant="body1">{formatCurrency(subtotal)}</Typography>
          </Box>
        )}

        {voucherDiscount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body1" color="error.main">
              Gutschein-Rabatt:
            </Typography>
            <Typography variant="body1" color="error.main" fontWeight="medium">
              -{formatCurrency(voucherDiscount)}
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
          borderRadius: theme.shape.borderRadius,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Gesamtsumme:
        </Typography>
        <Typography variant="h6" fontWeight="bold" color="primary.main">
          {formatCurrency(total)}
        </Typography>
      </Box>
    </>
  );
};

CartSummary.propTypes = {
  subtotal: PropTypes.number.isRequired,
  voucherDiscount: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  productDiscount: PropTypes.number,
};

export default CartSummary;
