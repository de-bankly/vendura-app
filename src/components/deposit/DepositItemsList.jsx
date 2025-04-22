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
              secondary={`Pfand: ${(item.product.price || 0).toFixed(2)} €`}
            />
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
          </ListItem>
          {index < items.length - 1 && <Divider component="li" />}
        </React.Fragment>
      ))}
    </List>
  );
};

DepositItemsList.propTypes = {
  items: PropTypes.array,
  onRemoveItem: PropTypes.func.isRequired,
  onUpdateQuantity: PropTypes.func.isRequired,
};

DepositItemsList.defaultProps = {
  items: [],
};

export default DepositItemsList;
