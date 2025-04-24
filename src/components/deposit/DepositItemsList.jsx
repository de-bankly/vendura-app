import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Paper,
  Divider,
  ButtonGroup,
  Button,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

/**
 * Renders a list of deposit items. Allows quantity adjustment and item removal
 * unless in read-only mode.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.items - Array of deposit items. Each item should have `product` (with `id`, `name`, `price`) and `quantity`.
 * @param {Function} [props.onRemoveItem] - Callback function triggered when an item is removed. Receives the item index.
 * @param {Function} [props.onUpdateQuantity] - Callback function triggered when an item's quantity is updated. Receives the item index and the new quantity.
 * @param {boolean} [props.readOnly=false] - If true, disables editing controls (quantity adjustment, removal).
 * @returns {React.ReactElement} The rendered list component.
 */
const DepositItemsList = ({ items, onRemoveItem, onUpdateQuantity, readOnly }) => {
  /**
   * Handles increasing the quantity for the item at the specified index.
   * Calls `onUpdateQuantity` if provided and not in read-only mode.
   * @param {number} index - The index of the item in the `items` array.
   */
  const handleIncreaseQuantity = index => {
    if (onUpdateQuantity && !readOnly) {
      onUpdateQuantity(index, items[index].quantity + 1);
    }
  };

  /**
   * Handles decreasing the quantity for the item at the specified index.
   * If the quantity is greater than 1 and `onUpdateQuantity` is provided, it decreases the quantity.
   * Otherwise (if quantity is 1 or less, or `onUpdateQuantity` is not provided),
   * and if `onRemoveItem` is provided, it removes the item.
   * Does nothing if in read-only mode.
   * @param {number} index - The index of the item in the `items` array.
   */
  const handleDecreaseQuantity = index => {
    if (readOnly) return;

    if (items[index].quantity > 1 && onUpdateQuantity) {
      onUpdateQuantity(index, items[index].quantity - 1);
    } else if (onRemoveItem) {
      onRemoveItem(index);
    }
  };

  if (!items || items.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, textAlign: 'center', backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      >
        <Typography variant="body1" color="textSecondary">
          Noch keine Flaschen gescannt
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
          Pfandprodukte werden automatisch hinzugefügt
        </Typography>
      </Paper>
    );
  }

  return (
    <List sx={{ maxHeight: '400px', overflow: 'auto' }}>
      {items.map((item, index) => (
        <React.Fragment key={`${item.product.id}-${index}`}>
          <ListItem
            secondaryAction={
              !readOnly && onRemoveItem ? (
                <IconButton edge="end" aria-label="delete" onClick={() => onRemoveItem(index)}>
                  <DeleteIcon />
                </IconButton>
              ) : null
            }
            sx={{ py: 2 }}
          >
            <ListItemText
              primary={item.product.name}
              secondary={`Pfand: ${(item.product.price || 0).toFixed(2)} €`}
            />
            {!readOnly && onUpdateQuantity ? (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <ButtonGroup size="small" aria-label="quantity button group">
                  <Button
                    aria-label="decrease"
                    onClick={() => handleDecreaseQuantity(index)}
                    disabled={item.quantity <= 0}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                  <Button disabled sx={{ minWidth: '40px' }}>
                    {item.quantity}
                  </Button>
                  <Button aria-label="increase" onClick={() => handleIncreaseQuantity(index)}>
                    <AddIcon fontSize="small" />
                  </Button>
                </ButtonGroup>
              </Box>
            ) : (
              <Typography variant="body2" sx={{ mr: 2, fontWeight: 'medium' }}>
                {item.quantity} Stk.
              </Typography>
            )}
          </ListItem>
          {index < items.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

DepositItemsList.propTypes = {
  items: PropTypes.array,
  onRemoveItem: PropTypes.func,
  onUpdateQuantity: PropTypes.func,
  readOnly: PropTypes.bool,
};

DepositItemsList.defaultProps = {
  items: [],
  readOnly: false,
};

export default DepositItemsList;
