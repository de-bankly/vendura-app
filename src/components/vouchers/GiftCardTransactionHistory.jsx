import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  AccessTime as AccessTimeIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Store as StoreIcon,
  LocalAtm as LocalAtmIcon,
  Error as ErrorIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { GiftCardTransactionService } from '../../services';

/**
 * Component to display transaction history for a gift card
 */
const GiftCardTransactionHistory = ({ giftCardId }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [giftCardId, page, rowsPerPage]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await GiftCardTransactionService.getTransactions(giftCardId, {
        page,
        size: rowsPerPage,
      });

      setTransactions(response.content || []);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      console.error('Error fetching gift card transactions:', err);
      setError(err.message || 'Fehler beim Laden der Transaktionen');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = dateString => {
    if (!dateString) return '--';
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', { locale: de });
  };

  const getTransactionTypeLabel = transaction => {
    const { amount, type } = transaction;

    if (amount > 0) {
      return { label: 'Aufladung', color: 'success', icon: <ArrowUpwardIcon /> };
    } else if (amount < 0) {
      if (type === 'PAYMENT') {
        return { label: 'Zahlung', color: 'primary', icon: <StoreIcon /> };
      } else if (type === 'REFUND') {
        return { label: 'Rückerstattung', color: 'info', icon: <LocalAtmIcon /> };
      } else {
        return { label: 'Abzug', color: 'warning', icon: <ArrowDownwardIcon /> };
      }
    } else {
      return { label: 'Sonstiges', color: 'default', icon: <MoreVertIcon /> };
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <ReceiptIcon sx={{ mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="medium">
          Transaktionsverlauf
        </Typography>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={40} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && transactions.length === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Keine Transaktionen gefunden
        </Alert>
      )}

      {!loading && !error && transactions.length > 0 && (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Datum</TableCell>
                  <TableCell>Typ</TableCell>
                  <TableCell>Betrag</TableCell>
                  <TableCell>Beschreibung</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map(transaction => {
                  const typeInfo = getTransactionTypeLabel(transaction);
                  return (
                    <TableRow key={transaction.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AccessTimeIcon fontSize="small" sx={{ mr: 1, opacity: 0.5 }} />
                          <Typography variant="body2">
                            {formatDate(transaction.timestamp)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          icon={typeInfo.icon}
                          label={typeInfo.label}
                          color={typeInfo.color}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 'medium',
                            color: transaction.amount > 0 ? 'success.main' : 'text.primary',
                          }}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {transaction.amount.toFixed(2)} €
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={transaction.description || 'Keine Beschreibung'}>
                          <Typography
                            variant="body2"
                            sx={{
                              maxWidth: 200,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {transaction.description || 'Keine Beschreibung'}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={totalElements}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Zeilen:"
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
          />
        </>
      )}
    </Paper>
  );
};

export default GiftCardTransactionHistory;
