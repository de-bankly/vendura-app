import React, { useState } from 'react';
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
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { validateVoucher, redeemVoucher } from '../../utils/voucherUtils';

/**
 * Dialog component for redeeming vouchers
 */
const RedeemVoucherDialog = ({ open, onClose, onVoucherRedeemed }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validatedVoucher, setValidatedVoucher] = useState(null);
  const [redeemed, setRedeemed] = useState(false);

  // Handle voucher code change
  const handleVoucherCodeChange = event => {
    setVoucherCode(event.target.value.toUpperCase());
    setError(null);
  };

  // Handle voucher validation
  const handleValidateVoucher = async () => {
    if (!voucherCode.trim()) {
      setError('Bitte geben Sie einen Gutscheincode ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const voucher = await validateVoucher(voucherCode);
      setValidatedVoucher(voucher);
    } catch (err) {
      setError(err.message);
      setValidatedVoucher(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle voucher redemption
  const handleRedeemVoucher = async () => {
    setLoading(true);
    setError(null);

    try {
      const redeemedVoucher = await redeemVoucher(voucherCode);
      setRedeemed(true);
      if (onVoucherRedeemed) {
        onVoucherRedeemed(redeemedVoucher);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setVoucherCode('');
    setValidatedVoucher(null);
    setError(null);
    setRedeemed(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CardGiftcardIcon sx={{ mr: 1 }} />
          Gutschein einlösen
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {redeemed ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Gutschein erfolgreich eingelöst!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Der Gutscheinwert von {validatedVoucher.value.toFixed(2)} € wurde angewendet.
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
              label="Gutscheincode eingeben"
              variant="outlined"
              fullWidth
              value={voucherCode}
              onChange={handleVoucherCodeChange}
              disabled={loading || !!validatedVoucher}
              placeholder="z.B. WELCOME10"
              sx={{ mb: 2 }}
            />

            {!validatedVoucher ? (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleValidateVoucher}
                disabled={loading || !voucherCode.trim()}
                sx={{ mb: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Gutschein prüfen'}
              </Button>
            ) : (
              <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Gutscheindetails:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Code:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {validatedVoucher.code}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Wert:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {validatedVoucher.value.toFixed(2)} €
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Gültig bis:
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {validatedVoucher.expiresAt}
                  </Typography>
                </Box>
              </Paper>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          {redeemed ? 'Schließen' : 'Abbrechen'}
        </Button>
        {validatedVoucher && !redeemed && (
          <Button
            onClick={handleRedeemVoucher}
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Gutschein einlösen'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RedeemVoucherDialog;
