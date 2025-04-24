import { Box, Grid, Paper, Typography, useTheme, Skeleton, alpha } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { motion } from 'framer-motion';

import InventoryProductCard from './InventoryProductCard';
import InventoryProductList from './InventoryProductList';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

/**
 * InventoryProductContent component for displaying the product list or grid
 * with loading and empty states.
 * @param {object} props - The component props.
 * @param {boolean} props.loading - Indicates if data is currently loading.
 * @param {Array<object>} props.products - The array of product objects to display.
 * @param {'grid' | 'list'} props.viewMode - The current view mode ('grid' or 'list').
 * @param {string} [props.emptyMessage] - Optional message to display when no products are found.
 * @returns {React.ReactElement} The rendered component.
 */
const InventoryProductContent = ({ loading, products, viewMode, emptyMessage }) => {
  const theme = useTheme();

  if (loading) {
    return (
      <Box>
        {viewMode === 'grid' ? (
          <Grid container spacing={2}>
            {[...Array(8)].map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton
                  variant="rounded"
                  height={220}
                  animation="wave"
                  sx={{ borderRadius: 2 }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box>
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rounded"
                height={72}
                animation="wave"
                sx={{ borderRadius: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: alpha(theme.palette.primary.light, 0.04),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.primary.main, 0.2)}`,
        }}
      >
        <Typography variant="h6" color="text.primary" fontWeight={500}>
          Keine Produkte gefunden
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {emptyMessage || 'Versuchen Sie andere Suchbegriffe oder Filter'}
        </Typography>
      </Paper>
    );
  }

  if (viewMode === 'grid') {
    return (
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Grid container spacing={2}>
          {products.map(product => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <motion.div variants={itemVariants}>
                <InventoryProductCard product={product} />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <InventoryProductList products={products} />
    </motion.div>
  );
};

InventoryProductContent.propTypes = {
  loading: PropTypes.bool.isRequired,
  products: PropTypes.array.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  emptyMessage: PropTypes.string,
};

export default InventoryProductContent;
