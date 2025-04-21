import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InfoIcon from '@mui/icons-material/Info';
import { Box, Paper, Typography, ButtonBase, Tooltip, useTheme, alpha } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * ProductCard displays a product in the sales grid with discount information if available
 */
const ProductCard = ({ product, onAddToCart }) => {
  const theme = useTheme();

  // Determine if we should show discount information
  const hasDiscount = product.hasDiscount && product.discountPercentage > 0;

  // Format price with german locale
  const formatPrice = price => {
    return price.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  return (
    <Paper
      elevation={1}
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.standard,
        }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
    >
      {/* Discount badge */}
      {hasDiscount && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bgcolor: 'error.main',
            color: 'error.contrastText',
            py: 0.5,
            px: 1,
            borderBottomLeftRadius: 8,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <LocalOfferIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="caption" fontWeight="bold">
            {product.discountPercentage}% RABATT
          </Typography>
        </Box>
      )}

      <ButtonBase
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
          p: 1.5,
        }}
        onClick={() => onAddToCart(product)}
        aria-label={`Add ${product.name} to cart`}
      >
        <Box sx={{ mb: 1, width: '100%' }}>
          <Typography variant="subtitle2" component="h3" noWrap>
            {product.name}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {product.category?.name || 'Unkategorisiert'}
          </Typography>
        </Box>

        <Box
          sx={{
            mt: 'auto',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {hasDiscount ? (
            <Box>
              <Typography
                variant="caption"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  display: 'block',
                }}
              >
                {formatPrice(product.originalPrice)}
              </Typography>
              <Typography variant="body2" fontWeight="bold" color="error.main">
                {formatPrice(product.discountedPrice)}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" fontWeight="bold" color="primary.main">
              {formatPrice(product.price)}
            </Typography>
          )}

          <Tooltip title="In den Warenkorb" arrow>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                color: theme.palette.primary.main,
                borderRadius: '50%',
                width: 32,
                height: 32,
                '&:hover': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
              }}
            >
              <AddShoppingCartIcon fontSize="small" />
            </Box>
          </Tooltip>
        </Box>
      </ButtonBase>
    </Paper>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    hasDiscount: PropTypes.bool,
    originalPrice: PropTypes.number,
    discountAmount: PropTypes.number,
    discountedPrice: PropTypes.number,
    discountPercentage: PropTypes.number,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
