import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LinkIcon from '@mui/icons-material/Link';
import { Box, Paper, Typography, alpha, Avatar, useTheme, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../ui/buttons';
import { Chip } from '../ui/feedback';
import { listItemVariants } from '../../utils/animations';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item, onAddItem, onRemoveItem, onDeleteItem }) => {
  const theme = useTheme();

  // Determine if we should show discount information
  const hasDiscount = item.hasDiscount && item.discountPercentage > 0;

  // Determine if this is a connected product
  const isConnectedProduct = item.isConnectedProduct === true;

  // Calculate the effective price (with discount if applicable)
  const effectivePrice = hasDiscount ? item.discountedPrice : item.price;

  // Calculate total for this item
  const itemTotal = effectivePrice * item.quantity;

  return (
    <motion.div initial="hidden" animate="visible" exit="exit" variants={listItemVariants} layout>
      <Paper
        elevation={0}
        sx={{
          overflow: 'hidden',
          borderRadius: theme.shape.borderRadius,
          transition: theme.transitions.create(['box-shadow', 'border-color']),
          border: isConnectedProduct
            ? `1px dashed ${theme.palette.primary.main}`
            : `1px solid ${theme.palette.divider}`,
          backgroundColor: isConnectedProduct ? alpha(theme.palette.primary.main, 0.05) : 'inherit',
          '&:hover': {
            boxShadow: theme.shadows[2],
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: hasDiscount
                ? alpha(theme.palette.error.main, 0.1)
                : isConnectedProduct
                  ? alpha(theme.palette.primary.main, 0.2)
                  : alpha(theme.palette.primary.main, 0.1),
              color: hasDiscount
                ? theme.palette.error.dark
                : isConnectedProduct
                  ? theme.palette.primary.dark
                  : theme.palette.primary.dark,
              width: 40,
              height: 40,
            }}
          >
            {hasDiscount ? (
              <LocalOfferIcon fontSize="small" />
            ) : isConnectedProduct ? (
              <LinkIcon fontSize="small" />
            ) : (
              item.name.charAt(0)
            )}
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="subtitle1" fontWeight="medium">
                  {item.name}
                </Typography>
                {isConnectedProduct && (
                  <Tooltip title="Automatisch mit Hauptprodukt hinzugefügt" arrow>
                    <Chip
                      size="small"
                      label="Bundle"
                      sx={{
                        ml: 1,
                        fontSize: theme.typography.pxToRem(10),
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: theme.palette.primary.dark,
                        height: 18,
                      }}
                    />
                  </Tooltip>
                )}
              </Box>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                color={hasDiscount ? 'error.main' : 'primary.main'}
              >
                {formatCurrency(itemTotal)}
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {hasDiscount ? (
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                      mr: 1,
                    }}
                  >
                    {formatCurrency(item.originalPrice)}
                  </Typography>
                  <Chip
                    size="small"
                    label={`${formatCurrency(effectivePrice)} × ${item.quantity}`}
                    sx={{
                      fontSize: theme.typography.pxToRem(12),
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.dark,
                    }}
                  />
                  <Chip
                    size="small"
                    label={`${item.discountPercentage}% Rabatt`}
                    sx={{
                      ml: 1,
                      fontSize: theme.typography.pxToRem(12),
                      bgcolor: alpha(theme.palette.error.main, 0.1),
                      color: theme.palette.error.dark,
                    }}
                  />
                </Box>
              ) : (
                <Chip
                  size="small"
                  label={`${formatCurrency(item.price)} × ${item.quantity}`}
                  sx={{
                    fontSize: theme.typography.pxToRem(12),
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.dark,
                  }}
                />
              )}

              <Box sx={{ display: 'flex' }}>
                {isConnectedProduct ? (
                  <Tooltip title="Verbundene Produkte können nicht einzeln entfernt werden" arrow>
                    <span>
                      <IconButton
                        size="small"
                        disabled
                        sx={{ color: alpha(theme.palette.text.disabled, 0.5) }}
                        aria-label={`Cannot remove ${item.name}`}
                      >
                        <RemoveIcon fontSize="inherit" />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <IconButton
                    size="small"
                    onClick={() => onRemoveItem(item.id)}
                    sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                    aria-label={`Remove one ${item.name}`}
                  >
                    <RemoveIcon fontSize="inherit" />
                  </IconButton>
                )}

                <IconButton
                  size="small"
                  onClick={() => onAddItem(item)}
                  sx={{ color: 'success.main', '&:hover': { color: 'success.dark' } }}
                  aria-label={`Add one ${item.name}`}
                >
                  <AddIcon fontSize="inherit" />
                </IconButton>

                {isConnectedProduct ? (
                  <Tooltip title="Verbundene Produkte können nicht einzeln gelöscht werden" arrow>
                    <span>
                      <IconButton
                        size="small"
                        disabled
                        sx={{ color: alpha(theme.palette.text.disabled, 0.5) }}
                        aria-label={`Cannot delete ${item.name}`}
                      >
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteItem(item.id)}
                    sx={{ '&:hover': { color: 'error.dark' } }}
                    aria-label={`Delete ${item.name}`}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                )}
              </Box>
            </Box>

            {isConnectedProduct && (
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  color: theme.palette.text.secondary,
                  fontStyle: 'italic',
                }}
              >
                Teil des Produkt-Bundles
              </Typography>
            )}
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
    hasDiscount: PropTypes.bool,
    originalPrice: PropTypes.number,
    discountedPrice: PropTypes.number,
    discountPercentage: PropTypes.number,
    isConnectedProduct: PropTypes.bool,
    parentProductId: PropTypes.string,
  }).isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
};

export default CartItem;
