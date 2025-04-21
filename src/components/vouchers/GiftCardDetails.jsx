import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
} from '@mui/material';
import {
  CardGiftcard as CardGiftcardIcon,
  LocalOffer as LocalOfferIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import GiftCardService from '../../services/GiftCardService';
import GiftCardTransactionService from '../../services/GiftCardTransactionService';

/**
 * Komponente zur Anzeige detaillierter Informationen einer Geschenkkarte
 */
const GiftCardDetails = ({ giftCardId, onClose }) => {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [giftCard, setGiftCard] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [transactionsPage, setTransactionsPage] = useState(0);
  const [transactionsRowsPerPage, setTransactionsRowsPerPage] = useState(5);
  const [transactionsTotalElements, setTransactionsTotalElements] = useState(0);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [rechargeDialogOpen, setRechargeDialogOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState('');
  const [rechargeLoading, setRechargeLoading] = useState(false);
  const [rechargeError, setRechargeError] = useState(null);

  // Lade Geschenkkarten-Details
  useEffect(() => {
    fetchGiftCardDetails();
  }, [giftCardId]);

  // Lade Transaktionen bei Seitenwechsel
  useEffect(() => {
    if (giftCard) {
      fetchTransactions();
    }
  }, [giftCard, transactionsPage, transactionsRowsPerPage]);

  const fetchGiftCardDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Hole Basis-Daten
      const giftCardData = await GiftCardService.getGiftCardById(giftCardId);

      // Hole Transaktionsdaten für Restguthaben/Nutzungen
      const transactionalInfo = await GiftCardService.getTransactionalInformation(giftCardId);

      setGiftCard({
        ...giftCardData,
        remainingBalance: transactionalInfo.remainingBalance,
        remainingUsages: transactionalInfo.remainingUsages,
      });

      // Lade initial Transaktionen
      fetchTransactions();
    } catch (error) {
      console.error('Error fetching gift card details:', error);
      setError(error.response?.data?.message || error.message || 'Fehler beim Laden der Daten');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    setLoadingTransactions(true);

    try {
      const response = await GiftCardTransactionService.getTransactionsByGiftCardId(giftCardId, {
        page: transactionsPage,
        size: transactionsRowsPerPage,
      });

      // Formatiere Transaktionen für die Anzeige
      const formattedTransactions = response.content.map(transaction =>
        GiftCardTransactionService.formatTransaction(transaction)
      );

      setTransactions(formattedTransactions);
      setTransactionsTotalElements(response.totalElements);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleTransactionsPageChange = (event, newPage) => {
    setTransactionsPage(newPage);
  };

  const handleTransactionsRowsPerPageChange = event => {
    setTransactionsRowsPerPage(parseInt(event.target.value, 10));
    setTransactionsPage(0);
  };

  const openRechargeDialog = () => {
    setRechargeAmount('');
    setRechargeError(null);
    setRechargeDialogOpen(true);
  };

  const closeRechargeDialog = () => {
    setRechargeDialogOpen(false);
  };

  const handleRechargeAmountChange = event => {
    const value = event.target.value;
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setRechargeAmount(value);
    }
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || parseFloat(rechargeAmount) <= 0) {
      setRechargeError('Bitte geben Sie einen gültigen Betrag ein');
      return;
    }

    setRechargeLoading(true);
    setRechargeError(null);

    try {
      await GiftCardTransactionService.rechargeGiftCard(giftCardId, parseFloat(rechargeAmount));

      // Aktualisiere Daten nach erfolgreicher Aufladung
      fetchGiftCardDetails();
      closeRechargeDialog();
    } catch (error) {
      console.error('Error recharging gift card:', error);
      setRechargeError(error.message || 'Fehler bei der Aufladung');
    } finally {
      setRechargeLoading(false);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'Kein Datum';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        action={
          <Button color="inherit" onClick={onClose}>
            Schließen
          </Button>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!giftCard) {
    return (
      <Alert
        severity="warning"
        action={
          <Button color="inherit" onClick={onClose}>
            Schließen
          </Button>
        }
      >
        Keine Daten gefunden
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header mit Basis-Informationen */}
      <Paper
        variant="outlined"
        sx={{
          mb: 3,
          p: 2,
          bgcolor:
            giftCard.type === 'GIFT_CARD'
              ? `${theme.palette.primary.light}10`
              : `${theme.palette.warning.light}10`,
          borderColor:
            giftCard.type === 'GIFT_CARD'
              ? theme.palette.primary.light
              : theme.palette.warning.light,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {giftCard.type === 'GIFT_CARD' ? (
              <CardGiftcardIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
            ) : (
              <LocalOfferIcon fontSize="large" color="warning" sx={{ mr: 1 }} />
            )}
            <Typography variant="h5" fontWeight="bold">
              {giftCard.type === 'GIFT_CARD' ? 'Geschenkkarte' : 'Rabattkarte'}
            </Typography>
          </Box>

          <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchGiftCardDetails}>
            Aktualisieren
          </Button>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Karten-ID
          </Typography>
          <Typography variant="subtitle1" fontWeight="medium">
            {giftCard.id}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Ausstellungsdatum
            </Typography>
            <Typography variant="body1">{formatDate(giftCard.issueDate)}</Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Ablaufdatum
            </Typography>
            <Typography variant="body1">
              {formatDate(giftCard.expirationDate) || 'Kein Ablaufdatum'}
            </Typography>
          </Grid>

          {giftCard.type === 'GIFT_CARD' && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Anfangsguthaben
                </Typography>
                <Typography variant="body1">{giftCard.initialBalance?.toFixed(2)} €</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Aktuelles Guthaben
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={giftCard.remainingBalance > 0 ? 'success.main' : 'text.primary'}
                >
                  {giftCard.remainingBalance?.toFixed(2)} €
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={openRechargeDialog}
                  >
                    Guthaben aufladen
                  </Button>
                </Box>
              </Grid>
            </>
          )}

          {giftCard.type === 'DISCOUNT_CARD' && (
            <>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Rabatt
                </Typography>
                <Typography variant="body1">{giftCard.discountPercentage}%</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Verbleibende Nutzungen
                </Typography>
                <Typography
                  variant="body1"
                  fontWeight="bold"
                  color={giftCard.remainingUsages > 0 ? 'success.main' : 'text.primary'}
                >
                  {giftCard.remainingUsages || 0} / {giftCard.maximumUsages}
                </Typography>
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* Transaktionshistorie */}
      <Paper variant="outlined" sx={{ mb: 3 }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="h6" fontWeight="medium">
            Transaktionshistorie
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Datum</TableCell>
                <TableCell>Art</TableCell>
                <TableCell align="right">Betrag</TableCell>
                <TableCell>Nachricht</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loadingTransactions ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={30} />
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Transaktionen werden geladen...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Keine Transaktionen gefunden</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((transaction, index) => (
                  <TableRow key={transaction.id || index}>
                    <TableCell>{transaction.formattedDate}</TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          transaction.type === 'deposit' ? (
                            <ArrowUpwardIcon />
                          ) : (
                            <ArrowDownwardIcon />
                          )
                        }
                        label={transaction.statusText}
                        color={transaction.type === 'deposit' ? 'success' : 'primary'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 'medium',
                        color: transaction.type === 'deposit' ? 'success.main' : 'primary.main',
                      }}
                    >
                      {transaction.formattedAmount}
                    </TableCell>
                    <TableCell>{transaction.message || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={transactionsTotalElements}
          page={transactionsPage}
          onPageChange={handleTransactionsPageChange}
          rowsPerPage={transactionsRowsPerPage}
          onRowsPerPageChange={handleTransactionsRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      {/* Button zum Schließen */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined" onClick={onClose}>
          Schließen
        </Button>
      </Box>

      {/* Dialog zum Aufladen des Guthabens */}
      <Dialog open={rechargeDialogOpen} onClose={closeRechargeDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Guthaben aufladen</DialogTitle>
        <DialogContent dividers>
          {rechargeError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {rechargeError}
            </Alert>
          )}

          <Box sx={{ p: 1 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Geben Sie den Betrag ein, den Sie der Geschenkkarte hinzufügen möchten.
            </Typography>

            <TextField
              label="Aufladebetrag (€)"
              value={rechargeAmount}
              onChange={handleRechargeAmountChange}
              fullWidth
              type="text"
              inputProps={{ inputMode: 'decimal' }}
              error={!!rechargeError}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRechargeDialog} disabled={rechargeLoading}>
            Abbrechen
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRecharge}
            disabled={rechargeLoading || !rechargeAmount}
          >
            {rechargeLoading ? <CircularProgress size={24} /> : 'Aufladen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GiftCardDetails;
