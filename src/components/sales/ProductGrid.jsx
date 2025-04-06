import React from 'react';
import { Box, Grid, Paper, Typography } from '../../components/ui';
import { Chip, Divider, useTheme } from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';

/**
 * ProductGrid component for displaying products by category
 */
const ProductGrid = ({ productsByCategory, onProductSelect }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={4}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderRadius: 2,
        bgcolor: 'background.paper',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: `1px solid ${theme.palette.divider}`,
          background: theme.palette.background.default,
        }}
      >
        <ShoppingBasketIcon sx={{ mr: 1.5, color: theme.palette.primary.main }} />
        <Typography variant="h5" fontWeight="medium">
          Produkte
        </Typography>
      </Box>

      {/* Products container */}
      <Box sx={{ p: 2, flexGrow: 1, overflow: 'auto' }}>
        {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
          <Box key={category} sx={{ mb: 4, '&:last-child': { mb: 0 } }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <CategoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography
                variant="h6"
                fontWeight="bold"
                sx={{
                  color: theme.palette.primary.main,
                }}
              >
                {category}
              </Typography>
              <Chip
                label={`${categoryProducts.length} Produkte`}
                size="small"
                sx={{
                  ml: 2,
                  bgcolor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                }}
              />
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              {categoryProducts.map(product => (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <Paper
                    elevation={2}
                    sx={{
                      p: 0,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden',
                      borderRadius: 1.5,
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 6,
                        '& .product-price': {
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        },
                      },
                      cursor: 'pointer',
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                    onClick={() => onProductSelect(product)}
                  >
                    <Box
                      sx={{
                        p: 2,
                        flexGrow: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        component="div"
                        fontWeight="medium"
                        sx={{
                          textAlign: 'center',
                          mb: 1,
                        }}
                      >
                        {product.name}
                      </Typography>
                    </Box>

                    <Box
                      className="product-price"
                      sx={{
                        p: 1,
                        bgcolor: theme.palette.background.default,
                        transition: 'all 0.3s',
                        textAlign: 'center',
                      }}
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {product.price.toFixed(2)} €
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default ProductGrid;
