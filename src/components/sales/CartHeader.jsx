import React from 'react';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Box, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { Chip } from '../ui/feedback';

/**
 * Header component for the shopping cart with undo/redo functionality.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.cartItems - Array of items in the cart. Each item should have a `quantity` property.
 * @param {boolean} props.cartUndoEnabled - Flag indicating if undo is possible.
 * @param {boolean} props.cartRedoEnabled - Flag indicating if redo is possible.
 * @param {Function} props.onUndoCartState - Callback function to trigger undo.
 * @param {Function} props.onRedoCartState - Callback function to trigger redo.
 * @returns {React.ReactElement} The rendered CartHeader component.
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
