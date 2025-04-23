import { Box, Container, Grid, Paper, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import {
  ErrorDisplay,
  InventoryFilterDrawer,
  InventoryHeader,
  InventoryProductContent,
  InventorySearchFilters,
} from '../components/inventory';
import { useInventoryProducts } from '../hooks';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * InventoryPage displays a comprehensive view of all products in inventory
 * with filtering, sorting, and search capabilities.
 */
const InventoryPage = () => {
  const theme = useTheme();
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
    <Box sx={{ py: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xl">
          <InventoryHeader onRefresh={handleRefresh} />
        </Container>
      </motion.div>

      <Container maxWidth="xl">
        {/* Error Message */}
        <ErrorDisplay message={error} />

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Search and Filter Section */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
              }}
            >
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
            </Paper>
          </motion.div>

          {/* Product Content Section */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    minHeight: '60vh',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      fontWeight: 600,
                      color: theme.palette.text.primary,
                    }}
                  >
                    Produktübersicht
                  </Typography>

                  <InventoryProductContent
                    loading={loading}
                    products={products}
                    viewMode={viewMode}
                    emptyMessage="Versuchen Sie andere Suchbegriffe oder Filter"
                  />
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        </motion.div>
      </Container>

      {/* Filter Drawer */}
      <InventoryFilterDrawer
        open={filterOpen}
        onClose={handleFilterToggle}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </Box>
  );
};

export default InventoryPage;
