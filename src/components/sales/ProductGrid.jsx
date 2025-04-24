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
 * ProductGrid component for displaying products by category with search and filtering.
 * @param {object} props - The component props.
 * @param {object} props.productsByCategory - An object where keys are category names and values are arrays of product objects.
 * @param {function} props.onProductSelect - Callback function triggered when a product's 'Add to Cart' button is clicked. Receives the product object as an argument.
 * @returns {React.ReactElement} The rendered ProductGrid component.
 */
const ProductGrid = ({ productsByCategory, onProductSelect }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleSearchChange = useCallback(event => {
    setSearchTerm(event.target.value);
  }, []);

  const handleCategoryChange = useCallback((event, newValue) => {
    setSelectedCategory(newValue);
  }, []);

  const categories = useMemo(() => {
    return Object.entries(productsByCategory).map(([name, products]) => ({
      name,
      count: products.length,
    }));
  }, [productsByCategory]);

  const promotionalProducts = useMemo(() => {
    return Object.values(productsByCategory)
      .flat()
      .filter(product => product.isOnSale || product.discountPercentage > 0);
  }, [productsByCategory]);

  const bundleProducts = useMemo(() => {
    return Object.values(productsByCategory)
      .flat()
      .filter(product => {
        const hasConnectedProducts =
          product.connectedProducts && product.connectedProducts.length > 0;
        const hasNonPfandConnectedProducts =
          hasConnectedProducts &&
          product.connectedProducts.some(p => p?.category?.name !== 'Pfand');
        return hasNonPfandConnectedProducts;
      });
  }, [productsByCategory]);

  const filteredProducts = useMemo(() => {
    const search = searchTerm.toLowerCase();
    let categoryProducts = [];

    if (selectedCategory === 0) {
      categoryProducts = Object.values(productsByCategory)
        .flat()
        .sort((a, b) => {
          const aOutOfStock = a.stockQuantity <= 0;
          const bOutOfStock = b.stockQuantity <= 0;
          if (aOutOfStock && !bOutOfStock) return 1;
          if (!aOutOfStock && bOutOfStock) return -1;

          if (a.toBeDiscontinued && !b.toBeDiscontinued) return 1;
          if (!a.toBeDiscontinued && b.toBeDiscontinued) return -1;

          const nameA = (a.name || '').toLowerCase();
          const nameB = (b.name || '').toLowerCase();
          return nameA.localeCompare(nameB, 'de');
        });
    } else if (selectedCategory === 1) {
      categoryProducts = promotionalProducts;
    } else if (selectedCategory === 2) {
      categoryProducts = bundleProducts;
    } else {
      const categoryName = categories[selectedCategory - 3]?.name;
      categoryProducts = productsByCategory[categoryName] || [];
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
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.paper,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShoppingBasketIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight="medium">
            Produkte
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            borderRadius: theme.shape.borderRadius,
            pl: theme.spacing(2),
            border: `1px solid ${theme.palette.divider}`,
            transition: theme.transitions.create(['box-shadow', 'border-color']),
            '&:hover': {
              boxShadow: theme.shadows[1],
              borderColor: theme.palette.primary.light,
            },
            width: { xs: 150, sm: 220 },
          }}
        >
          <InputBase
            placeholder="Produkt suchen..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ ml: 1, flex: 1 }}
            inputProps={{ 'aria-label': 'Search products' }}
          />
          <MuiIconButton sx={{ p: theme.spacing(1) }} aria-label="search">
            <SearchIcon />
          </MuiIconButton>
        </Paper>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2">Alle</Typography>
                <Chip
                  size="small"
                  label={Object.values(productsByCategory).flat().length}
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: theme.typography.pxToRem(12),
                  }}
                />
              </Box>
            }
            value={0}
            sx={{ px: 2 }}
          />

          <Tab
            key="aktionen"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalOfferIcon sx={{ mr: 0.5, fontSize: '1rem' }} />
                <Typography variant="body2">Aktionen</Typography>
                <Chip
                  size="small"
                  label={promotionalProducts.length}
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: theme.typography.pxToRem(12),
                  }}
                />
              </Box>
            }
            value={1}
            sx={{ px: 2 }}
          />

          <Tab
            key="bundles"
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Inventory2Icon sx={{ mr: 0.5, fontSize: '1rem' }} />
                <Typography variant="body2">Bundles</Typography>
                <Chip
                  size="small"
                  label={bundleProducts.length}
                  sx={{
                    ml: 1,
                    height: 20,
                    fontSize: theme.typography.pxToRem(12),
                  }}
                />
              </Box>
            }
            value={2}
            sx={{ px: 2 }}
          />

          {categories.map((category, index) => (
            <Tab
              key={category.name}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2">{category.name}</Typography>{' '}
                  <Chip
                    size="small"
                    label={category.count}
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: theme.typography.pxToRem(12),
                    }}
                  />
                </Box>
              }
              value={index + 3}
              sx={{ px: 2 }}
            />
          ))}
        </Tabs>
      </Box>

      <Box
        sx={{
          p: 3,
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        {filteredProducts.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
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
  /** An object where keys are category names and values are arrays of product objects. */
  productsByCategory: PropTypes.object.isRequired,
  /** Callback function triggered when a product's 'Add to Cart' button is clicked. Receives the product object as an argument. */
  onProductSelect: PropTypes.func.isRequired,
};

export default ProductGrid;
