import { Box, Container } from '@mui/material';
import React, { useState } from 'react';

import {
  ErrorDisplay,
  InventoryFilterDrawer,
  InventoryHeader,
  InventoryProductContent,
  InventorySearchFilters,
} from '../components/inventory';
import { useInventoryProducts } from '../hooks';

/**
 * InventoryPage displays a comprehensive view of all products in inventory
 * with filtering, sorting, and search capabilities.
 */
const InventoryPage = () => {
  // State for view mode
  const [viewMode, setViewMode] = useState('list');

  // State for filter drawer
  const [filterOpen, setFilterOpen] = useState(false);

  // Use custom hook for product data and filtering
  const {
    products,
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
  } = useInventoryProducts();

  // Handle filter drawer toggle
  const handleFilterToggle = () => {
    setFilterOpen(!filterOpen);
  };

  // Handle view mode change
  const handleViewModeChange = newMode => {
    setViewMode(newMode);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      {/* Header with title and action buttons */}
      <InventoryHeader onRefresh={handleRefresh} />

      {/* Error Message */}
      <ErrorDisplay message={error} />

      {/* Search and Filter Bar */}
      <InventorySearchFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        categories={categories}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        onFilterToggle={handleFilterToggle}
      />

      {/* Product Content */}
      <Box sx={{ position: 'relative', minHeight: '60vh' }}>
        <InventoryProductContent
          loading={loading}
          products={products}
          viewMode={viewMode}
          emptyMessage="Versuchen Sie andere Suchbegriffe oder Filter"
        />
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
