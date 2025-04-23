import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Paper, Typography, alpha, useTheme, Chip, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../ui/buttons';
import { slideFromRightVariants } from '../../utils/animations';
import { formatCurrency } from '../../utils/formatters';

const AppliedVoucher = ({ voucher, onRemoveVoucher, disabled = false }) => {
  const theme = useTheme();

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
          bgcolor: alpha(theme.palette.info.main, 0.08),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
          transition: theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
          '&:hover': {
            boxShadow: disabled ? 'none' : theme.shadows[2],
            borderColor: theme.palette.info.main,
          },
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: alpha(theme.palette.info.main, 0.12),
                color: theme.palette.info.main,
                mr: 1.5,
              }}
            >
              <CardGiftcardIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {voucher.code}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Restguthaben: {formatCurrency(voucher.balance)}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
    value: PropTypes.number.isRequired,
    balance: PropTypes.number.isRequired,
  }).isRequired,
  onRemoveVoucher: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default AppliedVoucher;
