import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { Box, Paper, Typography, alpha, Avatar, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../ui/buttons';
import { Chip } from '../ui/feedback';
import { listItemVariants } from '../../utils/animations';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item, onAddItem, onRemoveItem, onDeleteItem }) => {
  const theme = useTheme();

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={listItemVariants} layout>
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: theme.shape.borderRadius,
          transition: theme.transitions.create(['box-shadow', 'border-color']),
          border: `1px solid ${theme.palette.divider}`,
          '&:hover': {
            boxShadow: theme.shadows[2],
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.dark,
              width: 40,
              height: 40,
            }}
          >
            {item.name.charAt(0)}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" fontWeight="medium">
                {item.name}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Chip
                size="small"
                label={`${formatCurrency(item.price)} × ${item.quantity}`}
                sx={{
                  fontSize: theme.typography.pxToRem(12),
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.dark,
                }}
              />

              <Box sx={{ display: 'flex' }}>
                <IconButton
                  size="small"
                  onClick={() => onRemoveItem(item.id)}
                  sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                  aria-label={`Remove one ${item.name}`}
                >
                  <RemoveIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onAddItem(item)}
                  sx={{ color: 'success.main', '&:hover': { color: 'success.dark' } }}
                  aria-label={`Add one ${item.name}`}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDeleteItem(item.id)}
                  sx={{ '&:hover': { color: 'error.dark' } }}
                  aria-label={`Delete ${item.name}`}
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
};

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default CartItem;
