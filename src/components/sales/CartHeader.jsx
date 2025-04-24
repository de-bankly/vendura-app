import React from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { Chip } from '../ui/feedback';

/**
 * Header component for the shopping cart with undo/redo functionality
 */
const CartHeader = ({
  cartItems,
  cartUndoEnabled,
  cartRedoEnabled,
  onUndoCartState,
  onRedoCartState,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.palette.divider}`,
        background: theme.palette.background.paper,
      }}
    >
      <Typography variant="h6">Warenkorb</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Tooltip title="Rückgängig">
          <span>
            {' '}
            {/* Tooltip requires a wrapper when child is disabled */}
            <IconButton
              size="small"
              disabled={!cartUndoEnabled}
              onClick={onUndoCartState}
              sx={{ mr: 0.5 }}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Wiederherstellen">
          <span>
            {' '}
            {/* Tooltip requires a wrapper when child is disabled */}
            <IconButton
              size="small"
              disabled={!cartRedoEnabled}
              onClick={onRedoCartState}
              sx={{ mr: 0.5 }}
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Chip
          icon={<ShoppingCartIcon fontSize="small" />}
          label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          color="primary"
          size="small"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default CartHeader;
