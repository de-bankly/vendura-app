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

const DepositItemsList = ({ items, onRemoveItem, onUpdateQuantity }) => {
  // Handle increasing quantity
  const handleIncreaseQuantity = index => {
    onUpdateQuantity(index, items[index].quantity + 1);
  };

  // Handle decreasing quantity
  const handleDecreaseQuantity = index => {
    if (items[index].quantity > 1) {
      onUpdateQuantity(index, items[index].quantity - 1);
    } else {
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
          Scannen Sie Flaschen ein, um diese hier anzuzeigen
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
              <IconButton edge="end" aria-label="delete" onClick={() => onRemoveItem(index)}>
                <DeleteIcon />
              </IconButton>
            }
            sx={{ py: 2 }}
          >
            <ListItemText
              primary={item.product.name}
              secondary={`Pfand: ${(item.product.depositValue || item.product.price).toFixed(2)} €`}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
              <ButtonGroup size="small">
                <Button aria-label="decrease" onClick={() => handleDecreaseQuantity(index)}>
                  <RemoveIcon fontSize="small" />
                </Button>
                <Button disableRipple disableTouchRipple sx={{ pointerEvents: 'none', px: 2 }}>
                  {item.quantity}
                </Button>
                <Button aria-label="increase" onClick={() => handleIncreaseQuantity(index)}>
                  <AddIcon fontSize="small" />
                </Button>
              </ButtonGroup>
            </Box>
          </ListItem>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pr: 2, pb: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Summe:{' '}
              {((item.product.depositValue || item.product.price) * item.quantity).toFixed(2)} €
            </Typography>
          </Box>

          {index < items.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </List>
  );
};

DepositItemsList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      product: PropTypes.object.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ),
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
};

DepositItemsList.defaultProps = {
  items: [],
};

export default DepositItemsList;
