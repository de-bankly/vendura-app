import { Box, Divider, Stack, Typography, alpha, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { formatCurrency } from '../../utils/formatters';

const CartSummary = ({ subtotal, voucherDiscount, total }) => {
  const theme = useTheme();

  return (
    <>
      <Divider sx={{ my: 2 }} />

      {/* Subtotal and discount */}
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body1">Zwischensumme:</Typography>
          <Typography variant="body1">{formatCurrency(subtotal)}</Typography>
        </Box>
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
};

export default CartSummary;
