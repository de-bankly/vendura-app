import React from 'react';
import { Box, Grid, Paper, Typography } from '../../components/ui';

/**
 * ProductGrid component for displaying products by category
 */
const ProductGrid = ({ productsByCategory, onProductSelect }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        height: '100%',
        overflow: 'auto',
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Produkte
      </Typography>

      {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
        <Box key={category} sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              pb: 0.5,
              borderBottom: '1px solid',
              borderColor: 'divider',
            }}
          >
            {category}
          </Typography>

          <Grid container spacing={2}>
            {categoryProducts.map(product => (
              <Grid item xs={6} sm={4} md={3} key={product.id}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                    cursor: 'pointer',
                  }}
                  onClick={() => onProductSelect(product)}
                >
                  <Typography variant="subtitle1" component="div" fontWeight="medium">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price.toFixed(2)} €
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </Paper>
  );
};

export default ProductGrid;
