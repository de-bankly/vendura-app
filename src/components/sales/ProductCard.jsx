import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import LinkIcon from '@mui/icons-material/Link';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import MoneyIcon from '@mui/icons-material/Money';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import CakeIcon from '@mui/icons-material/Cake';
import CoffeeIcon from '@mui/icons-material/Coffee';
import IcecreamIcon from '@mui/icons-material/Icecream';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import SportsBarIcon from '@mui/icons-material/SportsBar';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import SoupKitchenIcon from '@mui/icons-material/SoupKitchen';
import EmojiFoodBeverageIcon from '@mui/icons-material/EmojiFoodBeverage';
import TapasIcon from '@mui/icons-material/Tapas';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import {
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  alpha,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

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
    hasConnectedProducts && product.connectedProducts.some(p => p?.category?.name === 'Pfand');

  // Check if there are non-Pfand connected products
  const hasNonPfandConnectedProducts =
    hasConnectedProducts && product.connectedProducts.some(p => p?.category?.name !== 'Pfand');

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
    ? product.connectedProducts.find(p => p?.category?.name === 'Pfand')
    : null;

  // Calculate total price with Pfand
  const totalPriceWithPfand = hasPfand
    ? parseFloat(product.price) + parseFloat(pfandItem?.price || 0)
    : product.price;

  // Enhanced category detection for icons and colors
  const { productIcon, bgColor } = useMemo(() => {
    const category = product.category?.name?.toLowerCase() || '';

    // Category to icon and color mapping
    const categoryMappings = [
      // Beverages
      {
        keywords: ['wasser', 'mineralwasser', 'water'],
        icon: <LocalDrinkIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.info.light,
      },
      {
        keywords: ['kaffee', 'coffee', 'espresso', 'latte', 'cappuccino'],
        icon: <CoffeeIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.brown || '#795548',
      },
      {
        keywords: ['tee', 'tea', 'chai'],
        icon: <EmojiFoodBeverageIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.orange?.light || '#FF9800',
      },
      {
        keywords: ['saft', 'juice', 'schorle', 'nektar', 'limonade', 'limo', 'soda', 'cola'],
        icon: <LocalDrinkIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.amber?.light || '#FFB300',
      },
      {
        keywords: ['bier', 'beer', 'pils', 'weizen', 'ale', 'radler'],
        icon: <SportsBarIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.amber?.dark || '#FF8F00',
      },
      {
        keywords: ['wein', 'wine', 'sekt', 'champagner', 'prosecco', 'aperitif', 'cocktail'],
        icon: <LocalBarIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.purple?.light || '#9C27B0',
      },

      // Food Categories
      {
        keywords: ['kuchen', 'cake', 'torte', 'gebäck', 'dessert'],
        icon: <CakeIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.pink?.light || '#E91E63',
      },
      {
        keywords: ['eis', 'icecream', 'gelato', 'frozen', 'sorbet'],
        icon: <IcecreamIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.cyan?.light || '#00BCD4',
      },
      {
        keywords: ['burger', 'hamburger', 'sandwich', 'toast'],
        icon: <LunchDiningIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.success.light,
      },
      {
        keywords: ['suppe', 'soup', 'eintopf'],
        icon: <SoupKitchenIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.orange?.dark || '#E65100',
      },
      {
        keywords: ['brot', 'bread', 'brötchen', 'semmel', 'croissant', 'bäckerei'],
        icon: <BakeryDiningIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.brown?.light || '#A1887F',
      },
      {
        keywords: ['snack', 'tapas', 'vorspeise', 'appetizer'],
        icon: <TapasIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.success.main,
      },

      // Special categories
      {
        keywords: ['pfand', 'deposit', 'leergut'],
        icon: <MoneyIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.warning.light,
      },

      // Generic food
      {
        keywords: ['essen', 'food', 'speise', 'gericht', 'mahlzeit', 'meal'],
        icon: <RestaurantIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.success.light,
      },

      // Generic drinks
      {
        keywords: ['getränk', 'drink', 'beverage'],
        icon: <LocalDrinkIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.info.light,
      },
    ];

    // Find matching category
    for (const mapping of categoryMappings) {
      if (mapping.keywords && mapping.keywords.some(keyword => category.includes(keyword))) {
        return {
          productIcon: mapping.icon,
          bgColor: mapping.color,
        };
      }
    }

    // Default fallback
    return {
      productIcon: <ShoppingBagIcon sx={{ fontSize: 30 }} />,
      bgColor: theme.palette.primary.light,
    };
  }, [product.category?.name, theme]);

  return (
    <Paper
      elevation={2}
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        transition: theme.transitions.create(['transform', 'box-shadow'], {
          duration: theme.transitions.duration.standard,
        }),
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Product Image */}
      <Box
        sx={{
          height: 100,
          backgroundColor: alpha(bgColor, 0.7),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {product.imageUrl ? (
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: alpha(theme.palette.common.white, 0.9),
              color: bgColor,
            }}
          >
            {productIcon}
          </Avatar>
        )}
      </Box>

      {/* Category Tag */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          left: 8,
          zIndex: 1,
        }}
      >
        <Chip
          size="small"
          label={product.category?.name || 'Unkategorisiert'}
          color="primary"
          variant="outlined"
          sx={{
            borderRadius: '4px',
            fontSize: '0.65rem',
            height: 18,
            opacity: 0.9,
            backgroundColor: alpha(theme.palette.background.paper, 0.7),
          }}
        />
      </Box>

      {/* Badges group container to improve organization */}
      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
        {/* Discount badge */}
        {hasDiscount && (
          <Box
            sx={{
              bgcolor: 'error.main',
              color: 'error.contrastText',
              py: 0.3,
              px: 1,
              borderBottomLeftRadius: 8,
              display: 'flex',
              alignItems: 'center',
              mb: showBundleBadge || (hasPfand && !showBundleBadge) ? 0.5 : 0,
            }}
          >
            <LocalOfferIcon fontSize="small" sx={{ mr: 0.3, fontSize: '0.9rem' }} />
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
              {product.discountPercentage}% RABATT
            </Typography>
          </Box>
        )}

        {/* Bundle badge */}
        {showBundleBadge && (
          <Box
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              py: 0.3,
              px: 1,
              borderBottomLeftRadius: 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LinkIcon fontSize="small" sx={{ mr: 0.3, fontSize: '0.9rem' }} />
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
              BUNDLE
            </Typography>
          </Box>
        )}

        {/* Pfand badge - only shown if there's Pfand but no other connected products */}
        {hasPfand && !showBundleBadge && (
          <Box
            sx={{
              bgcolor: theme.palette.success.main,
              color: theme.palette.success.contrastText,
              py: 0.3,
              px: 1,
              borderBottomLeftRadius: 8,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <ShoppingBagIcon fontSize="small" sx={{ mr: 0.3, fontSize: '0.9rem' }} />
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
              PFAND
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          sx={{
            mb: 0.5,
            fontWeight: 'bold',
            lineHeight: 1.2,
            fontSize: '1rem',
            height: '1.2rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.name}
        </Typography>

        {/* Optional description - only show if there's space */}
        {product.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.description}
          </Typography>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1 }} />

          {/* Price Section */}
          <Box sx={{ mb: 1 }}>
            {hasPfand ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Produkt:
                  </Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {formatPrice(product.price)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="success.main">
                    Pfand:
                  </Typography>
                  <Typography variant="caption" fontWeight="medium" color="success.main">
                    {formatPrice(pfandItem?.price || 0)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="bold">
                    Gesamt:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {formatPrice(totalPriceWithPfand)}
                  </Typography>
                </Box>
              </Box>
            ) : hasDiscount ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Original:
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    {formatPrice(product.originalPrice)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="bold">
                    Jetzt:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="error.main">
                    {formatPrice(product.discountedPrice)}
                  </Typography>
                </Box>
              </Box>
            ) : showBundleBadge ? (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    Hauptprodukt:
                  </Typography>
                  <Typography variant="caption" fontWeight="medium">
                    {formatPrice(product.price)}
                  </Typography>
                </Box>
                {/* Bundle items */}
                {product.connectedProducts
                  .filter(p => p?.category?.name !== 'Pfand')
                  .map((bundleItem, index) => (
                    <Box
                      key={bundleItem.id || index}
                      sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}
                    >
                      <Typography
                        variant="caption"
                        color="primary.main"
                        sx={{
                          maxWidth: '70%',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {bundleItem.name}:
                      </Typography>
                      <Typography variant="caption" fontWeight="medium" color="primary.main">
                        {formatPrice(bundleItem.price)}
                      </Typography>
                    </Box>
                  ))}
                {/* Show total if there's also pfand */}
                {hasPfand && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="success.main">
                      Pfand:
                    </Typography>
                    <Typography variant="caption" fontWeight="medium" color="success.main">
                      {formatPrice(pfandItem?.price || 0)}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" fontWeight="bold">
                    Gesamt:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="primary.main">
                    {formatPrice(
                      parseFloat(product.price) +
                        product.connectedProducts.reduce(
                          (sum, item) => sum + parseFloat(item.price || 0),
                          0
                        )
                    )}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body1" fontWeight="bold" color="primary.main">
                  {formatPrice(product.price)}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Add to Cart Button */}
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onAddToCart(product)}
            startIcon={<AddShoppingCartIcon fontSize="small" />}
            sx={{
              borderRadius: '6px',
              textTransform: 'none',
              fontWeight: 'bold',
              boxShadow: theme.shadows[2],
              py: 0.75,
            }}
          >
            In den Warenkorb
          </Button>
        </Box>
      </Box>
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
    imageUrl: PropTypes.string,
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
