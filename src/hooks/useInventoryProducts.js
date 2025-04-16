import { useState, useEffect, useCallback } from 'react';
import { ProductService, ProductCategoryService } from '../services';

/**
 * Custom hook to manage inventory products data, fetching, and filtering
 */
const useInventoryProducts = () => {
  // State for products
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for categories
  const [categories, setCategories] = useState([]);

  // State for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({
    inStock: false,
    lowStock: false,
    priceRange: [0, 1000],
    suppliers: [],
    brands: [],
  });

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(24);
  const [totalElements, setTotalElements] = useState(0);

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

    return [
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
  };

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

  // Load products and categories on hook initialization
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Apply filters whenever filter conditions change
  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, filters]);

  // Apply all filters
  const applyFilters = useCallback(() => {
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
  }, [products, searchQuery, selectedCategory, filters]);

  // Event handlers
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const handleCategoryChange = event => {
    setSelectedCategory(event.target.value);
  };

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  const handleRefresh = () => {
    fetchProducts();
  };

  return {
    products: filteredProducts,
    loading,
    error,
    categories,
    searchQuery,
    selectedCategory,
    filters,
    handleSearchChange,
    handleCategoryChange,
    handleFilterChange,
    handleRefresh,
    totalElements,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  };
};

export default useInventoryProducts;
