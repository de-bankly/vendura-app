import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LinkIcon from '@mui/icons-material/Link';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import {
  Box,
  Paper,
  Typography,
  alpha,
  Avatar,
  useTheme,
  Tooltip,
  ButtonGroup,
} from '@mui/material';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../ui/buttons';
import { Chip } from '../ui/feedback';
import { listItemVariants } from '../../utils/animations';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item, onAddItem, onRemoveItem, onDeleteItem, disabled = false }) => {
  const theme = useTheme();

  // Determine if we should show discount information
  const hasDiscount = item.hasDiscount && item.discountPercentage > 0;

  // Determine if this is a connected product
  const isConnectedProduct = item.isConnectedProduct === true;

  // Determine if this is a pfand (deposit) product
  const isPfandProduct = item.isPfandProduct === true || item.category?.name === 'Pfand';

  // Calculate the effective price (with discount if applicable)
  const effectivePrice = hasDiscount ? item.discountedPrice : item.price;

  // Calculate total for this item
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
          {/* Left: Product avatar */}
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

          {/* Middle: Product information */}
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                mb: 0.5,
                alignItems: 'flex-start',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
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

            {/* Product price information */}
            <Box sx={{ mt: 0.5 }}>
              {hasDiscount ? (
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
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

          {/* Right: Action buttons */}
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
  item: PropTypes.object.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  onDeleteItem: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default CartItem;
