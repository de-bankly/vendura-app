import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DeleteIcon from '@mui/icons-material/Delete';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import PercentIcon from '@mui/icons-material/Percent';
import { Box, Chip, Paper, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../ui/buttons';
import { slideFromRightVariants } from '../../utils/animations';
import { formatCurrency } from '../../utils/formatters';

/**
 * Displays an applied voucher with its details and an option to remove it.
 * Handles different visual styles for discount cards vs. gift cards.
 *
 * @component
 * @param {object} props - The component props.
 * @param {object} props.voucher - The voucher object containing details.
 * @param {string} props.voucher.id - The unique identifier of the voucher.
 * @param {string} props.voucher.code - The voucher code.
 * @param {string} props.voucher.type - The type of the voucher (e.g., 'DISCOUNT_CARD').
 * @param {number} [props.voucher.value] - The monetary value applied by the voucher (used for non-discount types).
 * @param {number} [props.voucher.balance] - The remaining balance of the voucher (e.g., for gift cards).
 * @param {number} [props.voucher.discountPercentage] - The discount percentage (for discount card types).
 * @param {number} [props.voucher.remainingUsages] - The number of remaining usages for the voucher.
 * @param {function} props.onRemoveVoucher - Callback function invoked when the remove button is clicked. Passes the voucher id.
 * @param {boolean} [props.disabled=false] - If true, the remove functionality is disabled and the component appears faded.
 * @returns {React.ReactElement} The rendered AppliedVoucher component.
 */
const AppliedVoucher = ({ voucher, onRemoveVoucher, disabled = false }) => {
  const theme = useTheme();
  const isDiscountVoucher = voucher.type === 'DISCOUNT_CARD';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideFromRightVariants}
      layout
      whileHover={{ y: disabled ? 0 : -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2,
          bgcolor: alpha(
            isDiscountVoucher ? theme.palette.secondary.main : theme.palette.info.main,
            0.08
          ),
          borderRadius: 2,
          border: `1px solid ${alpha(isDiscountVoucher ? theme.palette.secondary.main : theme.palette.info.main, 0.3)}`,
          transition: theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
          '&:hover': {
            boxShadow: disabled ? 'none' : theme.shadows[2],
            borderColor: isDiscountVoucher ? theme.palette.secondary.main : theme.palette.info.main,
          },
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha(
                  isDiscountVoucher ? theme.palette.secondary.main : theme.palette.info.main,
                  0.12
                ),
                color: isDiscountVoucher ? theme.palette.secondary.main : theme.palette.info.main,
                mr: 1.5,
              }}
            >
              {isDiscountVoucher ? (
                <LocalOfferIcon fontSize="small" />
              ) : (
                <CardGiftcardIcon fontSize="small" />
              )}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {voucher.code}
              </Typography>
              {isDiscountVoucher ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Rabatt: {voucher.discountPercentage}%
                  </Typography>
                  {voucher.remainingUsages !== undefined && (
                    <Typography variant="caption" color="text.secondary">
                      Nutzungen: {voucher.remainingUsages}
                    </Typography>
                  )}
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Restguthaben: {formatCurrency(voucher.balance)}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {isDiscountVoucher ? (
              <Chip
                size="small"
                icon={<PercentIcon fontSize="small" />}
                label={`${voucher.discountPercentage}%`}
                sx={{
                  mr: 1,
                  fontWeight: 600,
                  fontSize: theme.typography.pxToRem(12),
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  color: theme.palette.secondary.main,
                }}
              />
            ) : (
              <Chip
                size="small"
                label={`-${formatCurrency(voucher.value)}`}
                sx={{
                  mr: 1,
                  fontWeight: 600,
                  fontSize: theme.typography.pxToRem(12),
                  bgcolor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                }}
              />
            )}

            {!disabled && (
              <Tooltip title="Gutschein entfernen" arrow placement="top">
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onRemoveVoucher(voucher.id)}
                  sx={{
                    p: 0.5,
                    '&:hover': {
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                    },
                  }}
                  aria-label={`Remove voucher ${voucher.code}`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

AppliedVoucher.propTypes = {
  voucher: PropTypes.shape({
    id: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.number,
    balance: PropTypes.number,
    discountPercentage: PropTypes.number,
    remainingUsages: PropTypes.number,
  }).isRequired,
  onRemoveVoucher: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default AppliedVoucher;
