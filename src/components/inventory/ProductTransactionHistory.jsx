import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
} from '@mui/material';
import { TransactionService } from '../../services';

/**
 * ProductTransactionHistory component to display transaction history for a product
 */
const ProductTransactionHistory = ({ open, onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (open && product) {
      fetchTransactions();
    }
  }, [open, product, page, rowsPerPage]);

  const fetchTransactions = async () => {
    if (!product?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await TransactionService.getProductTransactions(product.id, {
        page,
        size: rowsPerPage,
      });

      setTransactions(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Fehler beim Laden der Transaktionen. Bitte versuchen Sie es erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Format timestamp
  const formatDate = timestamp => {
    if (!timestamp) return '—';

    return new Intl.DateTimeFormat('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(timestamp));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Transaktionsverlauf: {product?.name}</DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" sx={{ p: 2 }}>
            {error}
          </Typography>
        ) : transactions.length === 0 ? (
          <Typography align="center" sx={{ p: 2 }}>
            Keine Transaktionen gefunden.
          </Typography>
        ) : (
          <TableContainer component={Paper} variant="outlined" sx={{ mt: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: 'background.subtle' }}>
                  <TableCell>Datum</TableCell>
                  <TableCell>Typ</TableCell>
                  <TableCell align="right">Menge</TableCell>
                  <TableCell>Ersteller</TableCell>
                  <TableCell>Nachricht</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(transaction => {
                  const typeInfo = TransactionService.getTransactionTypeDisplay(
                    transaction.transactionType
                  );

                  return (
                    <TableRow key={transaction.id}>
                      <TableCell>{formatDate(transaction.timestamp)}</TableCell>
                      <TableCell>
                        <Chip label={typeInfo.label} color={typeInfo.color} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        <Typography
                          variant="body2"
                          color={transaction.quantity >= 0 ? 'success.main' : 'error.main'}
                          fontWeight="medium"
                        >
                          {transaction.quantity >= 0 ? '+' : ''}
                          {transaction.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>{transaction.issuer?.username || '—'}</TableCell>
                      <TableCell>{transaction.message || '—'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          labelRowsPerPage="Einträge pro Seite:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Schließen</Button>
      </DialogActions>
    </Dialog>
  );
};

ProductTransactionHistory.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
};

export default ProductTransactionHistory;
