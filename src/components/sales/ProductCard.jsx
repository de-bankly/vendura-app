import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LinkIcon from '@mui/icons-material/Link';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
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

  // Check if the product has connected products
  const hasConnectedProducts = product.connectedProducts && product.connectedProducts.length > 0;

  // Check if the product has Pfand (deposit) connected to it
  const hasPfand =
    hasConnectedProducts && product.connectedProducts.some(p => p.category?.name === 'Pfand');

  // Check if there are non-Pfand connected products
  const hasNonPfandConnectedProducts =
    hasConnectedProducts && product.connectedProducts.some(p => p.category?.name !== 'Pfand');

  // Only show Bundle badge if there are connected products that are not Pfand
  const showBundleBadge = hasNonPfandConnectedProducts;

  // Format price with german locale
  const formatPrice = price => {
    return price.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  // Find Pfand item if exists to display its price
  const pfandItem = hasPfand
    ? product.connectedProducts.find(p => p.category?.name === 'Pfand')
    : null;

  // Calculate total price with Pfand
  const totalPriceWithPfand = hasPfand
    ? parseFloat(product.price) + parseFloat(pfandItem?.price || 0)
    : product.price;

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

      {/* Pfand badge */}
      {hasPfand && (
        <Tooltip
          title={
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Pfand
              </Typography>
              <Typography variant="body2">
                Auf dieses Produkt wird automatisch Pfand berechnet:
                <Box component="span" sx={{ fontWeight: 'bold', ml: 0.5 }}>
                  {formatPrice(pfandItem?.price || 0)}
                </Box>
              </Typography>
            </Box>
          }
          arrow
          placement="top-start"
        >
          <Box
            sx={{
              position: 'absolute',
              top: hasDiscount ? 32 : 0,
              left: 0,
              bgcolor: theme.palette.success.main,
              color: theme.palette.success.contrastText,
              py: 0.5,
              px: 1,
              borderBottomRightRadius: 8,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              cursor: 'help',
            }}
          >
            <ShoppingBagIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" fontWeight="bold">
              PFAND
            </Typography>
          </Box>
        </Tooltip>
      )}

      {/* Connected Products badge - only show if there are non-Pfand connected products */}
      {showBundleBadge && (
        <Tooltip
          title={
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                Bundle-Produkt
              </Typography>

              <Typography variant="body2" sx={{ mb: 1 }}>
                Diese Produkte werden automatisch zum Warenkorb hinzugefügt:
              </Typography>

              <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                {product.connectedProducts.map(connectedProduct => (
                  <li key={connectedProduct.id}>
                    <Typography variant="body2">
                      {connectedProduct.name} ({formatPrice(connectedProduct.price)})
                      {connectedProduct.category?.name === 'Pfand' && (
                        <Box component="span" sx={{ ml: 0.5, color: theme.palette.success.main }}>
                          (Pfand)
                        </Box>
                      )}
                    </Typography>
                  </li>
                ))}
              </ul>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  p: 1,
                  borderRadius: 1,
                  color: theme.palette.info.dark,
                }}
              >
                Hinweis: Die verbundenen Produkte können nicht einzeln aus dem Warenkorb entfernt
                werden.
              </Typography>
            </Box>
          }
          arrow
          placement="top-end"
        >
          <Box
            sx={{
              position: 'absolute',
              top: hasDiscount ? 32 : 0,
              right: 0,
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              py: 0.5,
              px: 1,
              borderBottomLeftRadius: 8,
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              cursor: 'help',
            }}
          >
            <LinkIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="caption" fontWeight="bold">
              BUNDLE
            </Typography>
          </Box>
        </Tooltip>
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
          {hasPfand ? (
            <Box>
              <Typography variant="body2" fontWeight="bold" color="primary.main">
                {formatPrice(product.price)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" color="success.main" sx={{ fontWeight: 'medium' }}>
                  +{formatPrice(pfandItem?.price || 0)} Pfand
                </Typography>
              </Box>
            </Box>
          ) : hasDiscount ? (
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

          <Tooltip
            title={
              showBundleBadge
                ? 'Mit verbundenen Produkten in den Warenkorb'
                : hasPfand
                  ? 'Produkt mit Pfand in den Warenkorb'
                  : 'In den Warenkorb'
            }
            arrow
          >
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
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    hasDiscount: PropTypes.bool,
    discountPercentage: PropTypes.number,
    discountedPrice: PropTypes.number,
    originalPrice: PropTypes.number,
    standalone: PropTypes.bool,
    category: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
    }),
    connectedProducts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        category: PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
