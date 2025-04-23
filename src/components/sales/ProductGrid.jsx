import SearchIcon from '@mui/icons-material/Search';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import {
  Box,
  Grid,
  Paper,
  Typography,
  useTheme,
  alpha,
  InputBase,
  Tab,
  Tabs,
  IconButton as MuiIconButton,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useMemo, useCallback } from 'react';
import Chip from '../ui/feedback/Chip';
import ProductCard from './ProductCard';

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

  // Get promotional products
  const promotionalProducts = useMemo(() => {
    return Object.values(productsByCategory)
      .flat()
      .filter(product => product.isOnSale || product.discountPercentage > 0);
  }, [productsByCategory]);

  // Get bundle products
  const bundleProducts = useMemo(() => {
    return Object.values(productsByCategory)
      .flat()
      .filter(product => {
        // Identifiziere Bundles: Produkte mit verbundenen Produkten, die keine Pfand-Produkte sind
        const hasConnectedProducts =
          product.connectedProducts && product.connectedProducts.length > 0;
        const hasNonPfandConnectedProducts =
          hasConnectedProducts &&
          product.connectedProducts.some(p => p?.category?.name !== 'Pfand');

        return hasNonPfandConnectedProducts;
      });
  }, [productsByCategory]);

  // Memoize filtered products
  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();
    let categoryProducts = [];

    if (selectedCategory === 0) {
      // Get all products and sort them with out-of-stock and to-be-discontinued products at the end
      categoryProducts = Object.values(productsByCategory)
        .flat()
        .sort((a, b) => {
          // First priority: sort out-of-stock products to the end
          const aOutOfStock = a.stockQuantity <= 0;
          const bOutOfStock = b.stockQuantity <= 0;

          if (aOutOfStock && !bOutOfStock) return 1;
          if (!aOutOfStock && bOutOfStock) return -1;

          // Second priority: sort discontinued products to end
          if (a.toBeDiscontinued && !b.toBeDiscontinued) return 1;
          if (!a.toBeDiscontinued && b.toBeDiscontinued) return -1;

          // Third priority: alphabetical sort by name
          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB, 'de');
        });
    } else if (selectedCategory === 1) {
      // "Aktionen" tab selected
      categoryProducts = promotionalProducts;
    } else if (selectedCategory === 2) {
      // "Bundles" tab selected
      categoryProducts = bundleProducts;
    } else {
      const categoryName = categories[selectedCategory - 3]?.name;
      categoryProducts = productsByCategory[categoryName] || [];
      // Products are already sorted with out-of-stock and to-be-discontinued products at the end in ProductService.groupByCategory
    }

    if (search) {
      return categoryProducts.filter(product => product?.name?.toLowerCase().includes(search));
    }
    return categoryProducts;
  }, [
    searchTerm,
    selectedCategory,
    categories,
    productsByCategory,
    promotionalProducts,
    bundleProducts,
  ]);

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
                <Chip
                  size="small"
                  label={Object.values(productsByCategory).flat().length}
                  sx={{ ml: 1, height: 20, fontSize: theme.typography.pxToRem(12) }}
                />
              </Box>
            }
            value={0}
            sx={{ px: 2 }} // Adjust padding if needed
          />

          {/* Special Tab: Aktionen */}
          <Tab
            key="aktionen"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalOfferIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                <Typography variant="body2">Aktionen</Typography>
                <Chip
                  size="small"
                  label={promotionalProducts.length}
                  sx={{ ml: 1, height: 20, fontSize: theme.typography.pxToRem(12) }}
                />
              </Box>
            }
            value={1}
            sx={{ px: 2 }}
          />

          {/* Special Tab: Bundles */}
          <Tab
            key="bundles"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory2Icon sx={{ mr: 0.5, fontSize: '1rem' }} />
                <Typography variant="body2">Bundles</Typography>
                <Chip
                  size="small"
                  label={bundleProducts.length}
                  sx={{ ml: 1, height: 20, fontSize: theme.typography.pxToRem(12) }}
                />
              </Box>
            }
            value={2}
            sx={{ px: 2 }}
          />

          {/* Regular category tabs now start at index 3 */}
          {categories.map((category, index) => (
            <Tab
              key={category.name}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">{category.name}</Typography>{' '}
                  {/* Use consistent variant */}
                  <Chip
                    size="small"
                    label={category.count}
                    sx={{ ml: 1, height: 20, fontSize: theme.typography.pxToRem(12) }}
                  />
                </Box>
              }
              value={index + 3}
              sx={{ px: 2 }} // Adjust padding if needed
            />
          ))}
        </Tabs>
      </Box>

      {/* Products Display */}
      <Box
        sx={{
          p: 3,
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
          <Grid container spacing={3}>
            {filteredProducts.map(product => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={product.id}>
                <ProductCard product={product} onAddToCart={() => onProductSelect(product)} />
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
