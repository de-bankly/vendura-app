import { Edit as EditIcon, History as HistoryIcon } from '@mui/icons-material';
import {
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Tooltip,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import ProductTransactionHistory from './ProductTransactionHistory';

/**
 * Formats a price number into a EUR currency string.
 * @param {number} price - The price to format.
 * @returns {string} The formatted price string (e.g., "1.234,56 €").
 */
const formatPrice = price => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

/**
 * InventoryProductList displays products in a list/table format.
 * @param {object} props - The component props.
 * @param {Array<object>} props.products - The list of products to display.
 * @param {Function} [props.onAdjustStock] - Optional callback function triggered when the adjust stock button is clicked.
 */
const InventoryProductList = ({ products, onAdjustStock }) => {
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  /**
   * Determines the stock status (label and color) for a given product.
   * It checks currentStock first, then stockQuantity, and compares against thresholds.
   * @param {object} product - The product object.
   * @returns {{color: string, label: string}} An object containing the MUI Chip color and label for the stock status.
   */
  const getStockStatus = product => {
    let currentStock = product.currentStock;

    if (currentStock === null || currentStock === undefined) {
      currentStock = product.stockQuantity;
    }

    if (currentStock === null || currentStock === undefined) {
      return { color: 'default', label: 'Unbekannt' };
    }

    if (currentStock === 0) {
      return { color: 'error', label: 'Nicht vorrätig' };
    }

    const lowThreshold = product.minStockLevel || product.lowStockThreshold || 5;

    if (currentStock <= lowThreshold) {
      return { color: 'warning', label: 'Fast leer' };
    }

    return { color: 'success', label: 'Auf Lager' };
  };

  /**
   * Handles opening the transaction history dialog for a specific product.
   * @param {object} product - The product for which to show the history.
   */
  const handleOpenTransactionHistory = product => {
    setSelectedProduct(product);
    setTransactionHistoryOpen(true);
  };

  /**
   * Handles closing the transaction history dialog.
   */
  const handleCloseTransactionHistory = () => {
    setTransactionHistoryOpen(false);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 1 }}>
        <Table sx={{ minWidth: 650 }} size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'background.subtle' }}>
              <TableCell width="30%">Produkt</TableCell>
              <TableCell>Kategorie</TableCell>
              <TableCell>Marke</TableCell>
              <TableCell align="right">Preis</TableCell>
              <TableCell align="center">Bestand</TableCell>
              <TableCell>Lieferant</TableCell>
              <TableCell align="right">Aktionen</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map(product => {
              const stockStatus = getStockStatus(product);
              let currentStock = product.currentStock;

              if (currentStock === null || currentStock === undefined) {
                currentStock = product.stockQuantity;
              }

              return (
                <TableRow key={product.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {product.imageUrl && (
                        <Box
                          component="img"
                          src={product.imageUrl}
                          alt={product.name}
                          sx={{
                            width: 40,
                            height: 40,
                            objectFit: 'contain',
                            mr: 2,
                            borderRadius: 1,
                          }}
                        />
                      )}
                      <Box>
                        <Typography variant="subtitle2">{product.name}</Typography>
                        {product.shortDescription && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {product.shortDescription}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </TableCell>

                  <TableCell>
                    {product.category ? (
                      <Typography variant="body2">{product.category.name}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {product.brand ? (
                      <Typography variant="body2">{product.brand.name}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={500}>
                      {formatPrice(product.price)}
                    </Typography>
                  </TableCell>

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
                      {currentStock !== null && currentStock !== undefined && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            minWidth: '40px',
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                          }}
                        >
                          {currentStock} Stk.
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    {product.supplier ? (
                      <Typography variant="body2">{product.supplier.name}</Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        —
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 1,
                      }}
                    >
                      {onAdjustStock && (
                        <Tooltip title="Bestand anpassen">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onAdjustStock(product)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Transaktionsverlauf anzeigen">
                        <IconButton
                          size="small"
                          color="info"
                          onClick={() => handleOpenTransactionHistory(product)}
                        >
                          <HistoryIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedProduct && (
        <ProductTransactionHistory
          open={transactionHistoryOpen}
          onClose={handleCloseTransactionHistory}
          product={selectedProduct}
        />
      )}
    </>
  );
};

InventoryProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      shortDescription: PropTypes.string,
      longDescription: PropTypes.string,
      price: PropTypes.number.isRequired,
      imageUrl: PropTypes.string,
      stockQuantity: PropTypes.number,
      lowStockThreshold: PropTypes.number,
      minStockLevel: PropTypes.number,
      maxStockLevel: PropTypes.number,
      reorderPoint: PropTypes.number,
      sku: PropTypes.string,
      currentStock: PropTypes.number,
      category: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
      brand: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
      supplier: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
      }),
    })
  ).isRequired,
  onAdjustStock: PropTypes.func,
};

export default InventoryProductList;
