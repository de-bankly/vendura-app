import React from 'react';
import { Box, Typography, Paper, Chip, IconButton, Divider, useTheme } from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import DeleteIcon from '@mui/icons-material/Delete';
import EuroIcon from '@mui/icons-material/Euro';
import PercentIcon from '@mui/icons-material/Percent';

/**
 * Component to display applied vouchers during checkout
 */
const AppliedVouchersDisplay = ({
  appliedVouchers = [],
  onRemoveVoucher,
  voucherDiscount = 0,
  giftCardPayment = 0,
}) => {
  const theme = useTheme();

  if (!appliedVouchers.length) {
    return null;
  }

  const discountVouchers = appliedVouchers.filter(voucher => voucher.type === 'DISCOUNT_CARD');
  const giftCardVouchers = appliedVouchers.filter(voucher => voucher.type === 'GIFT_CARD');

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        mb: 2,
        borderColor: theme.palette.success.light,
        bgcolor: theme.palette.success.light + '10',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CardGiftcardIcon color="success" sx={{ mr: 1 }} />
          <Typography variant="subtitle1" fontWeight="medium" color="success.main">
            Angewandte Gutscheine
          </Typography>
        </Box>

        {(voucherDiscount > 0 || giftCardPayment > 0) && (
          <Chip
            label={`${(voucherDiscount + giftCardPayment).toFixed(2)} € Gesamt`}
            color="success"
            variant="outlined"
          />
        )}
      </Box>

      {giftCardVouchers.length > 0 && (
        <>
          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
            Geschenkkarten
          </Typography>

          {giftCardVouchers.map(voucher => (
            <Box
              key={voucher.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
                py: 1,
                px: 1,
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <CardGiftcardIcon color="primary" sx={{ mr: 1, flexShrink: 0 }} />
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                      width: '85%',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {voucher.id}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Verwendet: {voucher.amount?.toFixed(2)} €
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Restguthaben: {(voucher.remainingBalance - (voucher.amount || 0)).toFixed(2)}{' '}
                      €
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={<EuroIcon fontSize="small" />}
                  label={voucher.amount?.toFixed(2)}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemoveVoucher(voucher.id)}
                  aria-label="Gutschein entfernen"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </>
      )}

      {discountVouchers.length > 0 && (
        <>
          {giftCardVouchers.length > 0 && <Divider sx={{ my: 2 }} />}

          <Typography variant="subtitle2" fontWeight="medium" sx={{ mb: 1 }}>
            Rabattgutscheine
          </Typography>

          {discountVouchers.map(voucher => (
            <Box
              key={voucher.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                mb: 1,
                py: 1,
                px: 1,
                borderRadius: 1,
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                <LocalOfferIcon color="secondary" sx={{ mr: 1, flexShrink: 0 }} />
                <Box>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    sx={{
                      width: '85%',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {voucher.id}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Rabatt: {voucher.discountPercentage}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Wert: {voucher.discountAmount?.toFixed(2) || voucherDiscount.toFixed(2)} €
                    </Typography>
                    {voucher.remainingUsages !== undefined && (
                      <Typography variant="caption" color="text.secondary">
                        Verbleibende Nutzungen: {voucher.remainingUsages}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={<EuroIcon fontSize="small" />}
                  label={`${voucher.discountAmount?.toFixed(2) || voucherDiscount.toFixed(2)} €`}
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip
                  icon={<PercentIcon fontSize="small" />}
                  label={`${voucher.discountPercentage}%`}
                  color="secondary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemoveVoucher(voucher.id)}
                  aria-label="Gutschein entfernen"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}
        </>
      )}

      {voucherDiscount > 0 && (
        <Box sx={{ mt: 2, textAlign: 'right' }}>
          <Chip
            icon={<PercentIcon />}
            label={`Rabatt: ${voucherDiscount.toFixed(2)} €`}
            color="secondary"
            size="small"
          />
        </Box>
      )}

      {giftCardPayment > 0 && (
        <Box sx={{ mt: voucherDiscount > 0 ? 1 : 2, textAlign: 'right' }}>
          <Chip
            icon={<CardGiftcardIcon />}
            label={`Gutscheinzahlung: ${giftCardPayment.toFixed(2)} €`}
            color="primary"
            size="small"
          />
        </Box>
      )}
    </Paper>
  );
};

export default AppliedVouchersDisplay;
