import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CategoryOutlined as CategoryIcon,
  WarningAmber as WarningIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
  Inventory2 as Inventory2Icon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

import InventoryFilterDrawer from '../components/inventory/InventoryFilterDrawer';
import InventoryProductCard from '../components/inventory/InventoryProductCard';
import InventoryProductList from '../components/inventory/InventoryProductList';
import { ProductService, ProductCategoryService } from '../services';

/**
 * InventoryPage displays a comprehensive view of all products in inventory
 * with filtering, sorting, and search capabilities.
 */
const InventoryPage = () => {
  const theme = useTheme();

  // State for products
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for categories
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // State for view mode
  const [viewMode, setViewMode] = useState('grid');

  // State for search
  const [searchQuery, setSearchQuery] = useState('');

  // State for filter drawer
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    inStock: false,
    lowStock: false,
    priceRange: [0, 1000],
    suppliers: [],
    brands: [],
  });

  // Pagination state (for future implementation)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(24);
  const [totalElements, setTotalElements] = useState(0);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts({
        page,
        size: rowsPerPage,
      });

      setProducts(response.content || []);
      setFilteredProducts(response.content || []);
      setTotalElements(response.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Fehler beim Laden der Produkte. Zeige Beispiel-Produkte an.');

      // Fallback to mock data if API call fails
      const mockProducts = generateMockProducts();
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setTotalElements(mockProducts.length);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Generate mock product data for fallback
  const generateMockProducts = () => {
    const categories = [
      { id: 'cat1', name: 'Getränke' },
      { id: 'cat2', name: 'Snacks' },
      { id: 'cat3', name: 'Elektronik' },
    ];

    const brands = [
      { id: 'brand1', name: 'Coca-Cola' },
      { id: 'brand2', name: 'Fanta' },
      { id: 'brand3', name: 'Haribo' },
      { id: 'brand4', name: 'Samsung' },
    ];

    const mockProducts = [
      {
        id: '001',
        name: 'Cola Zero',
        description: 'Zuckerfreies Erfrischungsgetränk',
        price: 1.99,
        stockQuantity: 25,
        lowStockThreshold: 5,
        category: categories[0],
        brand: brands[0],
        sku: 'CC001',
      },
      {
        id: '002',
        name: 'Fanta Orange',
        description: 'Orangenlimonade',
        price: 1.89,
        stockQuantity: 32,
        lowStockThreshold: 5,
        category: categories[0],
        brand: brands[1],
        sku: 'FA002',
      },
      {
        id: '003',
        name: 'Goldbären',
        description: 'Fruchtgummi Mischung',
        price: 2.49,
        stockQuantity: 15,
        lowStockThreshold: 5,
        category: categories[1],
        brand: brands[2],
        sku: 'HB003',
      },
      {
        id: '004',
        name: 'Cola Classic',
        description: 'Das Original',
        price: 1.99,
        stockQuantity: 0,
        lowStockThreshold: 5,
        category: categories[0],
        brand: brands[0],
        sku: 'CC004',
      },
      {
        id: '005',
        name: 'Galaxy Tab',
        description: 'Tablet',
        price: 299.99,
        stockQuantity: 3,
        lowStockThreshold: 5,
        category: categories[2],
        brand: brands[3],
        sku: 'ST005',
      },
      {
        id: '006',
        name: 'Smartphone S23',
        description: 'Aktuelles Smartphone Modell',
        price: 899.99,
        stockQuantity: 8,
        lowStockThreshold: 5,
        category: categories[2],
        brand: brands[3],
        sku: 'SS006',
      },
      {
        id: '007',
        name: 'Cola Cherry',
        description: 'Mit Kirschgeschmack',
        price: 2.29,
        stockQuantity: 12,
        lowStockThreshold: 5,
        category: categories[0],
        brand: brands[0],
        sku: 'CC007',
      },
      {
        id: '008',
        name: 'Erdbeerlaces',
        description: 'Fruchtschnüre mit Erdbeergeschmack',
        price: 1.99,
        stockQuantity: 22,
        lowStockThreshold: 5,
        category: categories[1],
        brand: brands[2],
        sku: 'HB008',
      },
    ];

    return mockProducts;
  };

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await ProductCategoryService.getProductCategories({
        page: 0,
        size: 100,
      });
      setCategories(categoriesData.content || []);
    } catch (err) {
      console.error('Error fetching categories:', err);

      // Fallback to mock categories if API call fails
      setCategories([
        { id: 'cat1', name: 'Getränke' },
        { id: 'cat2', name: 'Snacks' },
        { id: 'cat3', name: 'Elektronik' },
      ]);
    }
  }, []);

  // Load products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Apply filters whenever filter conditions change
  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, filters]);

  // Handle search input change
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  // Handle category change
  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value);
  };

  // Handle view mode change
  const handleViewModeChange = (event, newValue) => {
    setViewMode(newValue === 0 ? 'grid' : 'list');
  };

  // Handle filter drawer toggle
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  // Handle filter changes
  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  // Apply all filters
  const applyFilters = () => {
    if (!products.length) return;

    let result = [...products];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.sku && product.sku.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== '') {
      result = result.filter(
        product => product.category && product.category.id === selectedCategory
      );
    }

    // Apply stock filters
    if (filters.inStock) {
      result = result.filter(product => product.stockQuantity && product.stockQuantity > 0);
    }

    if (filters.lowStock) {
      result = result.filter(
        product =>
          product.stockQuantity !== null &&
          product.stockQuantity <= (product.lowStockThreshold || 5)
      );
    }

    // Apply price range filter
    result = result.filter(
      product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply supplier filter
    if (filters.suppliers.length > 0) {
      result = result.filter(
        product => product.supplier && filters.suppliers.includes(product.supplier.id)
      );
    }

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter(product => product.brand && filters.brands.includes(product.brand.id));
    }

    setFilteredProducts(result);
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchProducts();
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Produktbestand
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleRefresh}
            startIcon={<RefreshIcon />}
          >
            Aktualisieren
          </Button>
          <Button
            component={Link}
            to="/inventory-management"
            variant="contained"
            color="primary"
            startIcon={<Inventory2Icon />}
          >
            Bestandsverwaltung
          </Button>
        </Box>
      </Box>

      {/* Error Message */}
      {error && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 3,
            bgcolor: 'error.light',
            color: 'error.dark',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <WarningIcon color="error" />
          <Typography>{error}</Typography>
        </Paper>
      )}

      {/* Filters and Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                placeholder="Produkt suchen..."
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                select
                fullWidth
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Kategorie"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryIcon />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">Alle Kategorien</MenuItem>
                {categories.map(category => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleFilterToggle}
                sx={{ mr: 1 }}
              >
                Filter
              </Button>

              <Tabs
                value={viewMode === 'grid' ? 0 : 1}
                onChange={handleViewModeChange}
                aria-label="view mode"
                sx={{
                  minHeight: 'unset',
                  '& .MuiTabs-indicator': { display: 'none' },
                  '& .MuiTab-root': { minHeight: 'unset', py: 1 },
                }}
              >
                <Tab icon={<GridViewIcon />} sx={{ minWidth: 'unset' }} />
                <Tab icon={<ViewListIcon />} sx={{ minWidth: 'unset' }} />
              </Tabs>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Product Content */}
      <Box sx={{ position: 'relative', minHeight: '60vh' }}>
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '60vh',
            }}
          >
            <CircularProgress />
          </Box>
        ) : filteredProducts.length === 0 ? (
          <Paper
            sx={{
              p: 3,
              textAlign: 'center',
              bgcolor: theme.palette.grey[50],
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Keine Produkte gefunden
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Versuchen Sie andere Suchbegriffe oder Filter
            </Typography>
          </Paper>
        ) : viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {filteredProducts.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <InventoryProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <InventoryProductList products={filteredProducts} />
        )}
      </Box>

      {/* Filter Drawer */}
      <InventoryFilterDrawer
        open={filterOpen}
        onClose={handleFilterToggle}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </Container>
  );
};

export default InventoryPage;
