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
 * Displays a product card in the sales grid, including details like price,
 * discounts, stock status, bundle information, and Pfand (deposit).
 * Handles visual states for availability and discontinuation.
 * @param {object} props - The component props.
 * @param {object} props.product - The product data object.
 * @param {function} props.onAddToCart - Callback function when the add to cart button is clicked.
 * @returns {React.ReactElement} The rendered ProductCard component.
 */
const ProductCard = ({ product, onAddToCart }) => {
  const theme = useTheme();

  const hasDiscount = product.hasDiscount && product.discountPercentage > 0;
  const hasConnectedProducts = product.connectedProducts && product.connectedProducts.length > 0;
  const hasPfand =
    hasConnectedProducts && product.connectedProducts.some(p => p?.category?.name === 'Pfand');
  const hasNonPfandConnectedProducts =
    hasConnectedProducts && product.connectedProducts.some(p => p?.category?.name !== 'Pfand');
  const showBundleBadge = hasNonPfandConnectedProducts;

  const availableStock =
    product.currentStock !== undefined && product.currentStock !== null
      ? product.currentStock
      : product.stockQuantity;

  const isOutOfStock = availableStock <= 0;

  const hasOutOfStockConnectedProducts =
    hasConnectedProducts &&
    product.connectedProducts.some(p => {
      const connectedAvailableStock =
        p.currentStock !== undefined && p.currentStock !== null ? p.currentStock : p.stockQuantity;
      return p?.category?.name !== 'Pfand' && connectedAvailableStock <= 0;
    });

  const isUnavailable = isOutOfStock || (showBundleBadge && hasOutOfStockConnectedProducts);
  const isBundleUnavailable = hasOutOfStockConnectedProducts;
  const isBeingDiscontinued = product.toBeDiscontinued === true;

  /**
   * Formats a number as a currency string in German locale (EUR).
   * @param {number} price - The price to format.
   * @returns {string} The formatted currency string.
   */
  const formatPrice = price => {
    return price.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  const pfandItem = hasPfand
    ? product.connectedProducts.find(p => p?.category?.name === 'Pfand')
    : null;

  const totalPriceWithPfand = hasPfand
    ? parseFloat(product.price) + parseFloat(pfandItem?.price || 0)
    : product.price;

  const { productIcon, bgColor } = useMemo(() => {
    const category = product.category?.name?.toLowerCase() || '';

    const categoryMappings = [
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
      {
        keywords: ['pfand', 'deposit', 'leergut'],
        icon: <MoneyIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.warning.light,
      },
      {
        keywords: ['essen', 'food', 'speise', 'gericht', 'mahlzeit', 'meal'],
        icon: <RestaurantIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.success.light,
      },
      {
        keywords: ['getränk', 'drink', 'beverage'],
        icon: <LocalDrinkIcon sx={{ fontSize: 30 }} />,
        color: theme.palette.info.light,
      },
    ];

    for (const mapping of categoryMappings) {
      if (mapping.keywords && mapping.keywords.some(keyword => category.includes(keyword))) {
        return {
          productIcon: mapping.icon,
          bgColor: mapping.color,
        };
      }
    }

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
          transform: isUnavailable ? 'none' : 'translateY(-4px)',
          boxShadow: isUnavailable ? 2 : 6,
        },
        opacity: isUnavailable ? 0.75 : 1,
        filter: isUnavailable ? 'grayscale(40%)' : 'none',
      }}
    >
      {isUnavailable && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha(theme.palette.background.paper, 0.5),
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              bgcolor: alpha(theme.palette.error.main, 0.9),
              color: theme.palette.error.contrastText,
              py: 0.5,
              px: 2,
              borderRadius: 1,
              transform: 'rotate(-15deg)',
              border: `2px solid ${theme.palette.error.dark}`,
              boxShadow: theme.shadows[3],
            }}
          >
            <Typography variant="subtitle2" fontWeight="bold">
              Nicht verfügbar
            </Typography>
          </Box>
        </Box>
      )}

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

      <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }}>
        {isOutOfStock && (
          <Box
            sx={{
              bgcolor: theme.palette.error.dark,
              color: theme.palette.error.contrastText,
              py: 0.3,
              px: 1,
              borderBottomLeftRadius: 8,
              display: 'flex',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
              AUSVERKAUFT
            </Typography>
          </Box>
        )}

        {isBeingDiscontinued && !isOutOfStock && (
          <Box
            sx={{
              bgcolor: theme.palette.warning.dark,
              color: theme.palette.warning.contrastText,
              py: 0.3,
              px: 1,
              borderBottomLeftRadius: 8,
              display: 'flex',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
              ABVERKAUF
            </Typography>
          </Box>
        )}

        {showBundleBadge && !isOutOfStock && (
          <Box
            sx={{
              bgcolor: isBundleUnavailable
                ? theme.palette.warning.dark
                : theme.palette.primary.main,
              color: isBundleUnavailable
                ? theme.palette.warning.contrastText
                : theme.palette.primary.contrastText,
              py: 0.3,
              px: 1,
              borderBottomLeftRadius: 8,
              display: 'flex',
              alignItems: 'center',
              mb: hasDiscount || (hasPfand && !showBundleBadge) ? 0.5 : 0,
            }}
          >
            <LinkIcon fontSize="small" sx={{ mr: 0.3, fontSize: '0.9rem' }} />
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
              {isBundleUnavailable ? 'BUNDLE UNVOLLSTÄNDIG' : 'BUNDLE'}
            </Typography>
          </Box>
        )}

        {hasDiscount && !isOutOfStock && (
          <Box
            sx={{
              bgcolor: theme.palette.error.main,
              color: theme.palette.error.contrastText,
              py: 0.3,
              px: 1,
              borderBottomLeftRadius: 8,
              display: 'flex',
              alignItems: 'center',
              mb: hasPfand && !showBundleBadge ? 0.5 : 0,
            }}
          >
            <LocalOfferIcon fontSize="small" sx={{ mr: 0.3, fontSize: '0.9rem' }} />
            <Typography variant="caption" fontWeight="bold" sx={{ fontSize: '0.7rem' }}>
              {product.discountPercentage}% RABATT
            </Typography>
          </Box>
        )}

        {hasPfand && !showBundleBadge && !isOutOfStock && (
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
        <Typography
          variant="h6"
          component="h3"
          sx={{
            mb: 0.5,
            fontWeight: 'bold',
            lineHeight: 1.2,
            fontSize: '1rem',
            height: '1.5rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.name}
        </Typography>

        <Divider sx={{ my: 1 }} />

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

        <Button
          fullWidth
          variant={isUnavailable ? 'outlined' : 'contained'}
          color={isUnavailable ? 'error' : 'primary'}
          size="small"
          onClick={() => onAddToCart(product)}
          startIcon={<AddShoppingCartIcon fontSize="small" />}
          disabled={isUnavailable}
          sx={{
            borderRadius: '6px',
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: isUnavailable ? 0 : theme.shadows[2],
            py: 0.75,
          }}
        >
          {isUnavailable ? 'Nicht verfügbar' : 'In den Warenkorb'}
        </Button>

        {!isOutOfStock && (
          <Typography
            variant="caption"
            align="center"
            sx={{
              mt: 0.5,
              color: availableStock <= 5 ? 'warning.main' : 'text.secondary',
              fontWeight: availableStock <= 5 ? 'medium' : 'normal',
            }}
          >
            {availableStock <= 5
              ? `Nur noch ${availableStock} auf Lager!`
              : `${availableStock} auf Lager`}
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

ProductCard.propTypes = {
  /**
   * The product data object.
   */
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
    /**
     * Products connected to this one (e.g., Pfand, bundle items).
     */
    connectedProducts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        category: PropTypes.shape({
          id: PropTypes.string,
          name: PropTypes.string,
        }),
        /**
         * Current stock level fetched from API, if available.
         */
        currentStock: PropTypes.number,
        /**
         * Default stock quantity from product data.
         */
        stockQuantity: PropTypes.number,
      })
    ),
    /**
     * Current stock level fetched from API, if available.
     */
    currentStock: PropTypes.number,
    /**
     * Default stock quantity from product data.
     */
    stockQuantity: PropTypes.number,
    /**
     * Flag indicating if the product is marked for discontinuation.
     */
    toBeDiscontinued: PropTypes.bool,
  }).isRequired,
  /**
   * Callback function triggered when the "Add to Cart" button is clicked.
   * Receives the product object as an argument.
   */
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
