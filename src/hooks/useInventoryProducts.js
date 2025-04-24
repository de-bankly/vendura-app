import { useState, useEffect, useCallback } from 'react';
import { ProductService, ProductCategoryService } from '../services';

/**
 * Custom hook to manage inventory products data, fetching, and filtering
 */
const useInventoryProducts = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [filters, setFilters] = useState({
    inStock: false,
    lowStock: false,
    priceRange: [0, 1000],
    suppliers: [],
    brands: [],
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(24);
  const [totalElements, setTotalElements] = useState(0);

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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const applyFilters = useCallback(() => {
    if (!products.length) return;

    let result = [...products];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          (product.description && product.description.toLowerCase().includes(query)) ||
          (product.sku && product.sku.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== '') {
      result = result.filter(
        product => product.category && product.category.id === selectedCategory
      );
    }

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

    result = result.filter(
      product => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    if (filters.suppliers.length > 0) {
      result = result.filter(
        product => product.supplier && filters.suppliers.includes(product.supplier.id)
      );
    }

    if (filters.brands.length > 0) {
      result = result.filter(product => product.brand && filters.brands.includes(product.brand.id));
    }

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, filters]);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategory, filters, applyFilters]);

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
