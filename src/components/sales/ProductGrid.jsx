import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, IconButton } from '../../components/ui';
import {
  Chip,
  Divider,
  useTheme,
  alpha,
  ButtonBase,
  Tooltip,
  Badge,
  InputBase,
  Tab,
  Tabs,
} from '@mui/material';
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
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  // Handle category tab change
  const handleCategoryChange = (event, newValue) => {
    setSelectedCategory(newValue);
  };

  // Get all categories with total product count
  const categories = Object.entries(productsByCategory).map(([name, products]) => ({
    name,
    count: products.length,
  }));

  // Get products to display based on selected category and search term
  const getFilteredProducts = () => {
    const search = searchTerm.toLowerCase();

    // Filter by category first
    let filteredProducts = [];
    if (selectedCategory === 0) {
      // Get all products from all categories
      Object.values(productsByCategory).forEach(categoryProducts => {
        filteredProducts = [...filteredProducts, ...categoryProducts];
      });
    } else {
      // Get products from selected category
      const categoryName = categories[selectedCategory - 1]?.name;
      filteredProducts = productsByCategory[categoryName] || [];
    }

    // Then filter by search term
    if (search) {
      return filteredProducts.filter(product => product.name.toLowerCase().includes(search));
    }

    return filteredProducts;
  };

  const filteredProducts = getFilteredProducts();

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
            borderRadius: 8,
            pl: 2,
            border: `1px solid ${theme.palette.divider}`,
            '&:hover': {
              boxShadow: 1,
              borderColor: theme.palette.primary.light,
            },
            width: 220,
          }}
        >
          <InputBase
            placeholder="Produkt suchen..."
            value={searchTerm}
            onChange={handleSearchChange}
            sx={{ ml: 1, flex: 1 }}
          />
          <IconButton sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Category Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={selectedCategory}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 3,
              py: 1.5,
              fontWeight: 500,
            },
          }}
        >
          <Tab
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Alle</Typography>
                <Chip
                  size="small"
                  label={Object.values(productsByCategory).flat().length}
                  sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                />
              </Box>
            }
            value={0}
          />

          {categories.map((category, index) => (
            <Tab
              key={category.name}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography>{category.name}</Typography>
                  <Chip
                    size="small"
                    label={category.count}
                    sx={{ ml: 1, height: 20, fontSize: '0.75rem' }}
                  />
                </Box>
              }
              value={index + 1}
            />
          ))}
        </Tabs>
      </Box>

      {/* Products Display */}
      <Box
        sx={{
          p: 2,
          flexGrow: 1,
          overflow: 'auto',
          bgcolor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        {filteredProducts.length === 0 ? (
          <Box
            sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
          >
            <Typography variant="body1" color="text.secondary">
              Keine Produkte gefunden
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {filteredProducts.map(product => (
              <Grid item xs={6} sm={4} md={3} lg={2} key={product.id}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    border: `1px solid ${theme.palette.divider}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
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
                    }}
                    onClick={() => onProductSelect(product)}
                  >
                    <Box
                      sx={{
                        p: 1.5,
                        flexGrow: 1,
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="subtitle2" component="h3" fontWeight="medium" noWrap>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          {product.category?.name || 'Unkategorisiert'}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          mt: 'auto',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-end',
                        }}
                      >
                        <Typography variant="body2" fontWeight="bold" color="primary.main">
                          {(product.price ?? 0).toFixed(2)} €
                        </Typography>

                        <Tooltip title="Zum Warenkorb hinzufügen" placement="top">
                          <IconButton
                            className="add-to-cart"
                            color="primary"
                            size="small"
                            sx={{
                              bgcolor: theme.palette.primary.light + '20',
                              opacity: 0.7,
                              transition: 'all 0.2s',
                              width: 28,
                              height: 28,
                              minWidth: 28,
                              '&:hover': {
                                bgcolor: theme.palette.primary.light + '40',
                              },
                            }}
                            onClick={e => {
                              e.stopPropagation();
                              onProductSelect(product);
                            }}
                          >
                            <AddShoppingCartIcon fontSize="small" sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
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

export default ProductGrid;
