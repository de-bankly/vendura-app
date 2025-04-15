import React, { useState, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip as MuiChip, // Use MuiChip for tabs for now
  Divider,
  useTheme,
  alpha,
  ButtonBase,
  Tooltip as MuiTooltip, // Use MuiTooltip
  Badge,
  InputBase,
  Tab,
  Tabs,
  IconButton as MuiIconButton, // Use MuiIconButton for search icon
} from '@mui/material';
// Import local components
import { IconButton } from '../ui/buttons'; // Use local enhanced IconButton for add-to-cart
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

/**
 * ProductGrid component for displaying products by category
 */
const ProductGrid = ({ productsByCategory, onProductSelect }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  // Handle search input change
  const handleSearchChange = useCallback(event => {
    setSearchTerm(event.target.value);
  }, []);

  // Handle category tab change
  const handleCategoryChange = useCallback((event, newValue) => {
    setSelectedCategory(newValue);
  }, []);

  // Get all categories with total product count
  const categories = useMemo(() => {
    return Object.entries(productsByCategory).map(([name, products]) => ({
      name,
      count: products.length,
    }));
  }, [productsByCategory]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();
    let categoryProducts = [];

    if (selectedCategory === 0) {
      categoryProducts = Object.values(productsByCategory).flat();
    } else {
      const categoryName = categories[selectedCategory - 1]?.name;
      categoryProducts = productsByCategory[categoryName] || [];
    }

    if (search) {
      return categoryProducts.filter(product => product?.name?.toLowerCase().includes(search));
    }
    return categoryProducts;
  }, [searchTerm, selectedCategory, categories, productsByCategory]);

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          flexShrink: 0, // Prevent header shrinking
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingBasketIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight="medium">
            Produkte
          </Typography>
        </Box>

        {/* Search Box */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: theme.shape.borderRadius, // Use theme token
            pl: theme.spacing(2),
            border: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create(['box-shadow', 'border-color']),
            '&:hover': {
              boxShadow: theme.shadows[1],
              borderColor: theme.palette.primary.light,
            },
            width: { xs: 150, sm: 220 }, // Responsive width
          }}
        >
          <InputBase
            placeholder="Produkt suchen..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ 'aria-label': 'Search products' }} // Accessibility
          />
          <MuiIconButton sx={{ p: theme.spacing(1) }} aria-label="search">
            <SearchIcon />
          </MuiIconButton>
        </Paper>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          // Rely on theme overrides for Tab styling applied earlier
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Alle</Typography> {/* Use consistent variant */}
                <MuiChip
                  size="small"
                  label={Object.values(productsByCategory).flat().length}
                  sx={{ ml: 1, height: 20, fontSize: theme.typography.pxToRem(12) }}
                />
              </Box>
            }
            value={0}
            sx={{ px: 2 }} // Adjust padding if needed
          />

          {categories.map((category, index) => (
            <Tab
              key={category.name}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">{category.name}</Typography>{' '}
                  {/* Use consistent variant */}
                  <MuiChip
                    size="small"
                    label={category.count}
                    sx={{ ml: 1, height: 20, fontSize: theme.typography.pxToRem(12) }}
                  />
                </Box>
              }
              value={index + 1}
              sx={{ px: 2 }} // Adjust padding if needed
            />
          ))}
        </Tabs>
      </Box>

      {/* Products Display */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          overflow: 'auto', // Allow product grid to scroll
          bgcolor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        {filteredProducts.length === 0 ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <Typography variant="body1" color="text.secondary">
              {searchTerm ? 'Keine Produkte gefunden' : 'Keine Produkte in dieser Kategorie'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredProducts.map(product => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderRadius: theme.shape.borderRadius, // Use theme token
                    transition: theme.transitions.create([
                      'transform',
                      'box-shadow',
                      'border-color',
                    ]),
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[3],
                      borderColor: theme.palette.primary.main,
                      '& .add-to-cart': {
                        opacity: 1,
                      },
                    },
                  }}
                >
                  <ButtonBase
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'left',
                      p: 1.5, // Add padding here instead of inner Box
                    }}
                    onClick={() => onProductSelect(product)}
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
                        mt: 'auto', // Push to bottom
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold" color="primary.main">
                        {(product.price ?? 0).toLocaleString('de-DE', {
                          style: 'currency',
                          currency: 'EUR',
                        })}
                      </Typography>

                      <MuiTooltip title="Zum Warenkorb hinzufügen" placement="top">
                        {/* Use local enhanced IconButton */}
                        <IconButton
                          className="add-to-cart"
                          color="primary"
                          size="small"
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            opacity: { xs: 1, md: 0.7 }, // Show on mobile, fade on desktop
                            transition: theme.transitions.create(['opacity', 'background-color']),
                            width: 28,
                            height: 28,
                            minWidth: 28, // Keep specific size
                            '&:hover': {
                              bgcolor: alpha(theme.palette.primary.main, 0.2),
                            },
                          }}
                          onClick={e => {
                            e.stopPropagation();
                            onProductSelect(product);
                          }}
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <AddShoppingCartIcon sx={{ fontSize: theme.typography.pxToRem(16) }} />
                        </IconButton>
                      </MuiTooltip>
                    </Box>
                  </ButtonBase>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

ProductGrid.propTypes = {
  /** Object with categories as keys and arrays of products */
  productsByCategory: PropTypes.object.isRequired,
  /** Callback function when a product is selected */
  onProductSelect: PropTypes.func.isRequired,
};

export default ProductGrid;
