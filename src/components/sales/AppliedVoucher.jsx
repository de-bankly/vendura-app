import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Paper, Typography, alpha, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../ui/buttons';
import { slideFromRightVariants } from '../../utils/animations';
import { formatCurrency } from '../../utils/formatters';

const AppliedVoucher = ({ voucher, onRemoveVoucher }) => {
  const theme = useTheme();

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideFromRightVariants}
      layout
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          bgcolor: alpha(theme.palette.info.light, 0.15),
          borderRadius: theme.shape.borderRadius,
          border: `1px solid ${alpha(theme.palette.info.light, 0.4)}`,
          transition: theme.transitions.create(['box-shadow', 'border-color']),
          '&:hover': {
            boxShadow: theme.shadows[1],
            borderColor: theme.palette.info.main,
          },
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <CardGiftcardIcon fontSize="small" sx={{ mr: 1, color: 'info.main' }} />
            <Typography variant="body2" fontWeight="medium">
              {voucher.code}
            </Typography>
          </Box>
          <Typography variant="body2" color="error.main" fontWeight="bold">
            -{formatCurrency(voucher.value)}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" color="info.dark">
            Restguthaben: {formatCurrency(voucher.balance)}
          </Typography>
          <Box sx={{ ml: 'auto' }}>
            <IconButton
              size="small"
              color="error"
              onClick={() => onRemoveVoucher(voucher.id)}
              sx={{ p: 0.5 }}
              aria-label={`Remove voucher ${voucher.code}`}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
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
};

export default AppliedVoucher;
