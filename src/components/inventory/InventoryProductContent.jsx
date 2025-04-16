import { Box, CircularProgress, Grid, Paper, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import InventoryProductCard from './InventoryProductCard';
import InventoryProductList from './InventoryProductList';

/**
 * InventoryProductContent component for displaying the product list or grid
 * with loading and empty states
 */
const InventoryProductContent = ({ loading, products, viewMode, emptyMessage }) => {
  const theme = useTheme();

  // Loading state
  if (loading) {
    return (
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
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
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
          {emptyMessage || 'Versuchen Sie andere Suchbegriffe oder Filter'}
        </Typography>
      </Paper>
    );
  }

  // Grid view
  if (viewMode === 'grid') {
    return (
      <Grid container spacing={2}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <InventoryProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // List view
  return <InventoryProductList products={products} />;
};

InventoryProductContent.propTypes = {
  loading: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  emptyMessage: PropTypes.string,
};

export default InventoryProductContent;
