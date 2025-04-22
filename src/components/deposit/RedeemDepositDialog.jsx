import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Chip,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import DepositService from '../../services/DepositService';

/**
 * Dialog component for validating deposit receipts and adding them to the cart
 */
const RedeemDepositDialog = ({ open, onClose, onDepositRedeemed, appliedDepositIds = [] }) => {
  const [depositId, setDepositId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validatedReceipt, setValidatedReceipt] = useState(null);
  const [applied, setApplied] = useState(false);

  // Reset state when dialog is opened/closed
  React.useEffect(() => {
    if (!open) {
      // Reset only when dialog is closed
      setDepositId('');
      setError(null);
      setValidatedReceipt(null);
      setApplied(false);
    }
  }, [open]);

  // Handle deposit ID change
  const handleDepositIdChange = event => {
    setDepositId(event.target.value.trim());
    setError(null);
  };

  // Handle deposit receipt validation
  const handleValidateDeposit = async () => {
    if (!depositId.trim()) {
      setError('Bitte geben Sie eine Pfand-Belegnummer ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await DepositService.getDepositReceiptById(depositId);
      const receipt = response.data;

      if (receipt.redeemed) {
        setError('Dieser Pfandbeleg wurde bereits eingelöst');
        setValidatedReceipt(null);
      } else if (appliedDepositIds.includes(receipt.id)) {
        setError('Dieser Pfandbeleg wurde bereits diesem Warenkorb hinzugefügt');
        setValidatedReceipt(null);
      } else {
        setValidatedReceipt(receipt);
      }
    } catch (err) {
      setError('Pfandbeleg nicht gefunden oder ungültig');
      setValidatedReceipt(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle deposit application to cart
  const handleApplyDeposit = () => {
    setApplied(true);
    if (onDepositRedeemed) {
      onDepositRedeemed({
        id: validatedReceipt.id,
        value: validatedReceipt.total,
        positions: validatedReceipt.positions,
        redeemed: false, // The receipt is not actually redeemed yet
      });
    }
  };

  // Format currency
  const formatCurrency = amount => {
    return amount.toFixed(2) + ' €';
  };

  // Handle dialog close
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          Pfandbeleg zum Warenkorb hinzufügen
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {applied ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Pfandbeleg erfolgreich zum Warenkorb hinzugefügt!
            </Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Der Pfandwert von {formatCurrency(validatedReceipt.total)} wird vom Gesamtbetrag
              abgezogen.
            </Typography>
            <Typography variant="body2" color="info.main" sx={{ mt: 2 }}>
              Hinweis: Der Pfandbeleg wird automatisch beim Abschluss des Verkaufs vom System
              eingelöst.
            </Typography>
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Pfand-Belegnummer eingeben"
              variant="outlined"
              fullWidth
              value={depositId}
              onChange={handleDepositIdChange}
              disabled={loading || !!validatedReceipt}
              placeholder="z.B. 1234567890"
              sx={{ mb: 2 }}
            />

            {!validatedReceipt && (
              <Button
                onClick={handleValidateDeposit}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || !depositId.trim()}
              >
                {loading ? <CircularProgress size={24} /> : 'Pfandbeleg prüfen'}
              </Button>
            )}

            {validatedReceipt && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Pfandbeleg Details:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Beleg-Nr:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {validatedReceipt.id}
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" gutterBottom>
                  Pfandartikel:
                </Typography>
                <TableContainer component={Box} sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Artikel</TableCell>
                        <TableCell align="center">Anzahl</TableCell>
                        <TableCell align="right">Pfand</TableCell>
                        <TableCell align="right">Summe</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {validatedReceipt.positions.map((position, index) => (
                        <TableRow key={index}>
                          <TableCell>{position.product.name}</TableCell>
                          <TableCell align="center">{position.quantity}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(position.product.price)}
                          </TableCell>
                          <TableCell align="right">
                            {formatCurrency(position.product.price * position.quantity)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6">Gesamtbetrag:</Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatCurrency(validatedReceipt.total)}
                  </Typography>
                </Box>
              </Paper>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          {applied ? 'Schließen' : 'Abbrechen'}
        </Button>
        {validatedReceipt && !applied && (
          <Button
            onClick={handleApplyDeposit}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Zum Warenkorb hinzufügen'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

RedeemDepositDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onDepositRedeemed: PropTypes.func,
  appliedDepositIds: PropTypes.arrayOf(PropTypes.string),
};

export default RedeemDepositDialog;
