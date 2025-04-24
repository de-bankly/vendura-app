import { Info as InfoIcon, Store as StoreIcon, Link as LinkIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Formats a price number into a German currency string.
 * @param {number} price - The price to format.
 * @returns {string} The formatted price string (e.g., "19,99 €").
 */
const formatPrice = price => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

/**
 * InventoryProductCard displays product information in a card format.
 * @param {object} props - The component props.
 * @param {object} props.product - The product data object.
 * @param {string} props.product.id - The product's unique identifier.
 * @param {string} props.product.name - The product's name.
 * @param {string} [props.product.description] - The product's description.
 * @param {number} props.product.price - The product's price.
 * @param {string} [props.product.imageUrl] - The URL of the product's image.
 * @param {number} [props.product.stockQuantity] - The general stock quantity (fallback).
 * @param {number} [props.product.currentStock] - The most current stock quantity (preferred).
 * @param {number} [props.product.lowStockThreshold] - The threshold for low stock warning.
 * @param {string} [props.product.sku] - The product's Stock Keeping Unit.
 * @param {object} [props.product.category] - The product's category.
 * @param {string} [props.product.category.id] - The category's ID.
 * @param {string} [props.product.category.name] - The category's name.
 * @param {object} [props.product.brand] - The product's brand.
 * @param {string} [props.product.brand.id] - The brand's ID.
 * @param {string} [props.product.brand.name] - The brand's name.
 * @param {boolean} [props.product.standalone] - Whether the product can be sold individually.
 * @param {Array<object>} [props.product.connectedProducts] - Products connected in a bundle.
 * @param {string} props.product.connectedProducts[].id - Connected product's ID.
 * @param {string} props.product.connectedProducts[].name - Connected product's name.
 * @param {number} props.product.connectedProducts[].price - Connected product's price.
 * @returns {React.ReactElement} The rendered product card component.
 */
const InventoryProductCard = ({ product }) => {
  const theme = useTheme();

  const availableStock =
    product.currentStock !== undefined && product.currentStock !== null
      ? product.currentStock
      : product.stockQuantity;

  /**
   * Determines the stock status based on available stock and threshold.
   * @returns {{color: string, label: string}} An object containing the color and label for the stock status chip.
   */
  const getStockStatus = () => {
    if (availableStock === undefined || availableStock === null) {
      return { color: 'default', label: 'Unbekannt' };
    }

    if (availableStock === 0) {
      return { color: 'error', label: 'Nicht vorrätig' };
    }

    const lowThreshold = product.lowStockThreshold || 5;

    if (availableStock <= lowThreshold) {
      return { color: 'warning', label: 'Fast leer' };
    }

    return { color: 'success', label: 'Auf Lager' };
  };

  const stockStatus = getStockStatus();
  const hasConnectedProducts = product.connectedProducts && product.connectedProducts.length > 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardActionArea
        component="div"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          height: '100%',
        }}
      >
        <Box
          sx={{
            height: 160,
            overflow: 'hidden',
            backgroundColor: theme.palette.grey[100],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />
          ) : (
            <InfoIcon sx={{ fontSize: 60, color: theme.palette.grey[300] }} />
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {product.category && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {product.category.name}
            </Typography>
          )}

          <Typography
            variant="subtitle1"
            component="h3"
            sx={{
              fontWeight: 'bold',
              mb: 0.5,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              lineHeight: 1.2,
              height: '2.4em',
            }}
          >
            {product.name}
          </Typography>

          {product.brand && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {product.brand.name}
            </Typography>
          )}

          <Divider sx={{ mb: 1.5 }} />

          <Typography variant="h6" color="primary" sx={{ mb: 1.5, fontWeight: 'bold' }}>
            {formatPrice(product.price)}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
            <StoreIcon fontSize="small" color="action" />
            <Box sx={{ flexGrow: 1 }}>
              <Chip
                label={stockStatus.label}
                color={stockStatus.color}
                size="small"
                sx={{ fontWeight: 500 }}
              />
            </Box>
            {availableStock !== undefined && availableStock !== null && (
              <Typography variant="body2" color="text.secondary">
                {availableStock} Stk.
              </Typography>
            )}
          </Stack>

          {hasConnectedProducts && (
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1.5 }}>
              <LinkIcon fontSize="small" color="primary" />
              <Tooltip
                title={
                  <Box>
                    <Typography variant="subtitle2">Verbundene Produkte:</Typography>
                    <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                      {product.connectedProducts.map(connectedProduct => (
                        <li key={connectedProduct.id}>
                          <Typography variant="body2">
                            {connectedProduct.name} ({formatPrice(connectedProduct.price)})
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                }
                arrow
              >
                <Chip
                  label={`Bundle (${product.connectedProducts.length})`}
                  color="primary"
                  size="small"
                  variant="outlined"
                  sx={{ fontWeight: 500, cursor: 'help' }}
                />
              </Tooltip>
              {!product.standalone && (
                <Tooltip title="Nicht einzeln verkäuflich">
                  <Typography variant="caption" color="text.secondary">
                    Nur als Bundle
                  </Typography>
                </Tooltip>
              )}
            </Stack>
          )}

          {product.sku && (
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              SKU: {product.sku}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

InventoryProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    stockQuantity: PropTypes.number,
    currentStock: PropTypes.number,
    lowStockThreshold: PropTypes.number,
    sku: PropTypes.string,
    category: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    brand: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    standalone: PropTypes.bool,
    connectedProducts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
};

export default InventoryProductCard;
