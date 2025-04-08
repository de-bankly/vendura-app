import React from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

/**
 * InventoryProductList displays products in a list/table format
 */
const InventoryProductList = ({ products }) => {
  // Format price
  const formatPrice = price => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Determine stock status
  const getStockStatus = product => {
    if (!product.stockQuantity && product.stockQuantity !== 0) {
      return { color: 'default', label: 'Unbekannt' };
    }

    if (product.stockQuantity === 0) {
      return { color: 'error', label: 'Nicht vorrätig' };
    }

    const lowThreshold = product.lowStockThreshold || 5;

    if (product.stockQuantity <= lowThreshold) {
      return { color: 'warning', label: 'Fast leer' };
    }

    return { color: 'success', label: 'Auf Lager' };
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
      <Table sx={{ minWidth: 650 }} size="medium">
        <TableHead>
          <TableRow sx={{ backgroundColor: 'background.subtle' }}>
            <TableCell width="40%">Produkt</TableCell>
            <TableCell>Kategorie</TableCell>
            <TableCell>Marke</TableCell>
            <TableCell align="right">Preis</TableCell>
            <TableCell align="center">Bestand</TableCell>
            <TableCell>SKU</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map(product => {
            const stockStatus = getStockStatus(product);

            return (
              <TableRow
                key={product.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                {/* Product Name & Image */}
                <TableCell sx={{ py: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        backgroundColor: 'grey.100',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt=""
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                      ) : (
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                          }}
                        >
                          {product.name.charAt(0).toUpperCase()}
                        </Box>
                      )}
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        {product.name}
                      </Typography>
                      {product.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {product.description}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {/* Category */}
                <TableCell>
                  {product.category ? (
                    <Typography variant="body2">{product.category.name}</Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>

                {/* Brand */}
                <TableCell>
                  {product.brand ? (
                    <Typography variant="body2">{product.brand.name}</Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>

                {/* Price */}
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600}>
                    {formatPrice(product.price)}
                  </Typography>
                </TableCell>

                {/* Stock Status */}
                <TableCell align="center">
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <Chip
                      label={stockStatus.label}
                      color={stockStatus.color}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                    {(product.stockQuantity || product.stockQuantity === 0) && (
                      <Typography variant="caption" color="text.secondary">
                        {product.stockQuantity} Stk.
                      </Typography>
                    )}
                  </Box>
                </TableCell>

                {/* SKU */}
                <TableCell>
                  {product.sku ? (
                    <Typography variant="body2" color="text.secondary">
                      {product.sku}
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

InventoryProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
      stockQuantity: PropTypes.number,
      lowStockThreshold: PropTypes.number,
      sku: PropTypes.string,
      category: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
      brand: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    })
  ).isRequired,
};

export default InventoryProductList;
