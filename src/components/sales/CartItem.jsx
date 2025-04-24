import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import {
  Avatar,
  Box,
  ButtonGroup,
  Paper,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../ui/buttons';
import { Chip } from '../ui/feedback';
import { listItemVariants } from '../../utils/animations';
import { formatCurrency } from '../../utils/formatters';

/**
 * Renders a single item within the shopping cart.
 * Displays product details, price, quantity, and action buttons (add, remove, delete).
 * Handles special styling and behavior for discounted, connected (bundle), and pfand (deposit) items.
 *
 * @param {object} props - The component props.
 * @param {object} props.item - The cart item object.
 * @param {string} props.item.id - Unique identifier for the item.
 * @param {string} props.item.name - Name of the product.
 * @param {number} props.item.price - Original price per unit.
 * @param {number} props.item.quantity - Number of units in the cart.
 * @param {boolean} [props.item.hasDiscount=false] - Whether the item has a discount.
 * @param {number} [props.item.discountPercentage=0] - The discount percentage.
 * @param {number} [props.item.discountedPrice] - The price after discount.
 * @param {number} [props.item.originalPrice] - The price before discount (if applicable).
 * @param {boolean} [props.item.isConnectedProduct=false] - Whether the item is part of a bundle.
 * @param {boolean} [props.item.isPfandProduct=false] - Whether the item is a deposit item.
 * @param {object} [props.item.category] - The item's category information.
 * @param {string} [props.item.category.name] - The name of the category.
 * @param {Function} props.onAddItem - Callback function when the add button is clicked. Receives the item object.
 * @param {Function} props.onRemoveItem - Callback function when the remove button is clicked. Receives the item id.
 * @param {Function} props.onDeleteItem - Callback function when the delete button is clicked. Receives the item id.
 * @param {boolean} [props.disabled=false] - If true, disables interaction with the item.
 * @returns {React.ReactElement} The rendered CartItem component.
 */
const CartItem = ({ item, onAddItem, onRemoveItem, onDeleteItem, disabled = false }) => {
  const theme = useTheme();

  const hasDiscount = item.hasDiscount && item.discountPercentage > 0;
  const isConnectedProduct = item.isConnectedProduct === true;
  const isPfandProduct = item.isPfandProduct === true || item.category?.name === 'Pfand';
  const effectivePrice = hasDiscount ? item.discountedPrice : item.price;
  const itemTotal = effectivePrice * item.quantity;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={listItemVariants}
      layout
      whileHover={{ y: -3 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: 2,
          transition: theme.transitions.create(['box-shadow', 'border-color', 'transform'], {
            duration: theme.transitions.duration.short,
          }),
          border: isPfandProduct
            ? `1px dashed ${theme.palette.success.main}`
            : isConnectedProduct
              ? `1px dashed ${theme.palette.primary.main}`
              : `1px solid ${alpha(theme.palette.divider, 0.8)}`,
          backgroundColor: isPfandProduct
            ? alpha(theme.palette.success.main, 0.04)
            : isConnectedProduct
              ? alpha(theme.palette.primary.main, 0.04)
              : theme.palette.background.paper,
          '&:hover': {
            boxShadow: disabled ? 'none' : theme.shadows[3],
            borderColor: isPfandProduct
              ? theme.palette.success.main
              : isConnectedProduct
                ? theme.palette.primary.main
                : theme.palette.primary.light,
          },
          opacity: disabled ? 0.7 : 1,
        }}
      >
        <Box sx={{ p: 2, display: 'flex', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: hasDiscount
                ? alpha(theme.palette.error.main, 0.12)
                : isPfandProduct
                  ? alpha(theme.palette.success.main, 0.12)
                  : isConnectedProduct
                    ? alpha(theme.palette.primary.main, 0.12)
                    : alpha(theme.palette.primary.main, 0.08),
              color: hasDiscount
                ? theme.palette.error.main
                : isPfandProduct
                  ? theme.palette.success.main
                  : theme.palette.primary.main,
              width: 44,
              height: 44,
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            {hasDiscount ? (
              <LocalOfferIcon />
            ) : isPfandProduct ? (
              <ShoppingBagIcon />
            ) : isConnectedProduct ? (
              <LinkIcon />
            ) : (
              item.name.charAt(0).toUpperCase()
            )}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 0.5,
                alignItems: 'flex-start',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} sx={{ mr: 1 }}>
                  {item.name}
                </Typography>

                {isPfandProduct && (
                  <Tooltip title="Pfand wird automatisch mit dem Produkt berechnet" arrow>
                    <Chip
                      size="small"
                      label="Pfand"
                      sx={{
                        fontSize: theme.typography.pxToRem(10),
                        bgcolor: alpha(theme.palette.success.main, 0.12),
                        color: theme.palette.success.dark,
                        height: 20,
                        fontWeight: 500,
                      }}
                    />
                  </Tooltip>
                )}

                {isConnectedProduct && !isPfandProduct && (
                  <Tooltip title="Automatisch mit Hauptprodukt hinzugefügt" arrow>
                    <Chip
                      size="small"
                      label="Bundle"
                      sx={{
                        fontSize: theme.typography.pxToRem(10),
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        color: theme.palette.primary.dark,
                        height: 20,
                        fontWeight: 500,
                      }}
                    />
                  </Tooltip>
                )}
              </Box>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={
                  isPfandProduct ? 'success.main' : hasDiscount ? 'error.main' : 'primary.main'
                }
              >
                {formatCurrency(itemTotal)}
              </Typography>
            </Box>

            <Box sx={{ mt: 0.5 }}>
              {hasDiscount ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    {formatCurrency(item.originalPrice)}
                  </Typography>

                  <Chip
                    size="small"
                    label={`${formatCurrency(effectivePrice)} × ${item.quantity}`}
                    sx={{
                      fontSize: theme.typography.pxToRem(11),
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      color: theme.palette.error.main,
                      height: 18,
                      fontWeight: 500,
                    }}
                  />

                  <Chip
                    size="small"
                    label={`${item.discountPercentage}% Rabatt`}
                    sx={{
                      fontSize: theme.typography.pxToRem(11),
                      bgcolor: alpha(theme.palette.error.main, 0.08),
                      color: theme.palette.error.main,
                      height: 18,
                      fontWeight: 500,
                    }}
                  />
                </Box>
              ) : (
                <Chip
                  size="small"
                  label={`${formatCurrency(item.price)} × ${item.quantity}`}
                  sx={{
                    fontSize: theme.typography.pxToRem(11),
                    bgcolor: isPfandProduct
                      ? alpha(theme.palette.success.main, 0.08)
                      : alpha(theme.palette.primary.main, 0.08),
                    color: isPfandProduct ? theme.palette.success.main : theme.palette.primary.main,
                    height: 18,
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
          </Box>

          {!disabled && (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ButtonGroup
                orientation="vertical"
                size="small"
                variant="outlined"
                sx={{
                  '.MuiButtonGroup-grouped': {
                    minWidth: '32px',
                    minHeight: '32px',
                  },
                  borderColor: alpha(theme.palette.divider, 0.5),
                }}
              >
                {isConnectedProduct || isPfandProduct ? (
                  <Tooltip
                    title={
                      isPfandProduct
                        ? 'Pfand kann nicht einzeln gelöscht werden'
                        : 'Verbundene Produkte können nicht einzeln gelöscht werden'
                    }
                    arrow
                  >
                    <span>
                      <IconButton
                        size="medium"
                        color="primary"
                        disabled={true}
                        sx={{ width: '32px', height: '32px' }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <IconButton
                    size="medium"
                    color="primary"
                    onClick={() => onAddItem(item)}
                    disabled={disabled}
                    sx={{ width: '32px', height: '32px' }}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                )}

                {isConnectedProduct || isPfandProduct ? (
                  <Tooltip
                    title={
                      isPfandProduct
                        ? 'Pfand kann nicht einzeln gelöscht werden'
                        : 'Verbundene Produkte können nicht einzeln gelöscht werden'
                    }
                    arrow
                  >
                    <span>
                      <IconButton
                        size="medium"
                        color="primary"
                        disabled={true}
                        sx={{ width: '32px', height: '32px' }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <IconButton
                    size="medium"
                    color="primary"
                    onClick={() => onRemoveItem(item.id)}
                    disabled={disabled}
                    sx={{ width: '32px', height: '32px' }}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                )}
              </ButtonGroup>

              {isConnectedProduct || isPfandProduct ? (
                <Tooltip
                  title={
                    isPfandProduct
                      ? 'Pfand kann nicht einzeln gelöscht werden'
                      : 'Verbundene Produkte können nicht einzeln gelöscht werden'
                  }
                  arrow
                >
                  <span>
                    <IconButton
                      size="medium"
                      color="error"
                      disabled={true}
                      sx={{ ml: 1, width: '32px', height: '32px' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <IconButton
                  size="medium"
                  color="error"
                  onClick={() => onDeleteItem(item.id)}
                  disabled={disabled}
                  sx={{ ml: 1, width: '32px', height: '32px' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          )}
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
    hasDiscount: PropTypes.bool,
    discountPercentage: PropTypes.number,
    discountedPrice: PropTypes.number,
    originalPrice: PropTypes.number,
    isConnectedProduct: PropTypes.bool,
    isPfandProduct: PropTypes.bool,
    category: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CartItem;
