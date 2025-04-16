import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EuroIcon from '@mui/icons-material/Euro';
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
  InputAdornment,
} from '@mui/material';
import React, { useState } from 'react';

import { issueVoucher } from '../../utils/voucherUtils';

/**
 * Dialog component for issuing new vouchers
 */
const IssueVoucherDialog = ({ open, onClose }) => {
  const [voucherValue, setVoucherValue] = useState('');
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [issuedVoucher, setIssuedVoucher] = useState(null);
  const [copied, setCopied] = useState(false);

  // Handle voucher value change
  const handleVoucherValueChange = event => {
    const value = event.target.value;
    if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0)) {
      setVoucherValue(value);
    }
    setError(null);
  };

  // Handle expiry date change
  const handleExpiryDateChange = event => {
    setExpiryDate(event.target.value);
  };

  // Handle voucher issuance
  const handleIssueVoucher = async () => {
    if (!voucherValue || parseFloat(voucherValue) <= 0) {
      setError('Bitte geben Sie einen gültigen Gutscheinwert ein');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const voucher = await issueVoucher(voucherValue, expiryDate);
      setIssuedVoucher(voucher);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle copy to clipboard
  const handleCopyCode = () => {
    if (issuedVoucher) {
      navigator.clipboard.writeText(issuedVoucher.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    setVoucherValue('');
    setExpiryDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setIssuedVoucher(null);
    setError(null);
    setCopied(false);
    onClose();
  };

  // Handle create new voucher
  const handleCreateNew = () => {
    setIssuedVoucher(null);
    setVoucherValue('');
    setError(null);
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CardGiftcardIcon sx={{ mr: 1 }} />
          Gutschein ausstellen
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {issuedVoucher ? (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Gutschein erfolgreich erstellt!
            </Typography>

            <Paper
              variant="outlined"
              sx={{ p: 3, my: 2, maxWidth: '300px', mx: 'auto', bgcolor: 'background.default' }}
            >
              <Typography variant="subtitle1" gutterBottom>
                Gutscheincode:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h5" component="div" fontWeight="bold" sx={{ mr: 1 }}>
                  {issuedVoucher.code}
                </Typography>
                <Button
                  size="small"
                  onClick={handleCopyCode}
                  color={copied ? 'success' : 'primary'}
                  sx={{ minWidth: '32px' }}
                >
                  {copied ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </Button>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Wert:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {issuedVoucher.value.toFixed(2)} €
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Gültig bis:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {issuedVoucher.expiresAt}
                </Typography>
              </Box>
            </Paper>

            <Button variant="outlined" color="primary" onClick={handleCreateNew} sx={{ mt: 1 }}>
              Neuen Gutschein erstellen
            </Button>
          </Box>
        ) : (
          <>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              label="Gutscheinwert"
              variant="outlined"
              fullWidth
              value={voucherValue}
              onChange={handleVoucherValueChange}
              disabled={loading}
              type="text"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EuroIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />

            <TextField
              label="Gültig bis"
              type="date"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().split('T')[0],
              }}
              sx={{ mb: 2 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Der Gutschein wird automatisch mit einem eindeutigen Code generiert und kann beim
              Verkauf eingelöst werden.
            </Typography>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Schließen
        </Button>
        {!issuedVoucher && (
          <Button
            onClick={handleIssueVoucher}
            variant="contained"
            color="primary"
            disabled={loading || !voucherValue}
          >
            {loading ? <CircularProgress size={24} /> : 'Gutschein erstellen'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default IssueVoucherDialog;
