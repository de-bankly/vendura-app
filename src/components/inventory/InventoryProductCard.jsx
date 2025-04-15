import { Info as InfoIcon, Store as StoreIcon } from '@mui/icons-material';
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
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * InventoryProductCard displays product information in a card format
 */
const InventoryProductCard = ({ product }) => {
  const theme = useTheme();

  // Determine stock status
  const getStockStatus = () => {
    if (!product.stockQuantity && product.stockQuantity !== 0) {
      return { color: 'default', label: 'Unbekannt' };
    }

    if (product.stockQuantity === 0) {
      return { color: 'error', label: 'Nicht vorrätig' };
    }

    const lowThreshold = product.lowStockThreshold || 5;

    if (product.stockQuantity <= lowThreshold) {
      return { color: 'warning', label: 'Fast leer' };
    }

    return { color: 'success', label: 'Auf Lager' };
  };

  const stockStatus = getStockStatus();

  // Format price
  const formatPrice = price => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

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
        {/* Product Image */}
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
          {/* Category */}
          {product.category && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              {product.category.name}
            </Typography>
          )}

          {/* Product Name */}
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

          {/* Brand */}
          {product.brand && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
              {product.brand.name}
            </Typography>
          )}

          <Divider sx={{ mb: 1.5 }} />

          {/* Price */}
          <Typography variant="h6" color="primary" sx={{ mb: 1.5, fontWeight: 'bold' }}>
            {formatPrice(product.price)}
          </Typography>

          {/* Stock Status */}
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
            {(product.stockQuantity || product.stockQuantity === 0) && (
              <Typography variant="body2" color="text.secondary">
                {product.stockQuantity} Stk.
              </Typography>
            )}
          </Stack>

          {/* SKU if available */}
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
  }).isRequired,
};

export default InventoryProductCard;
