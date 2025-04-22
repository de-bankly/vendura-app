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
      setError('Fehler beim Laden der Produkte.');
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
