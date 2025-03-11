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
  Slider,
  InputAdornment,
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EuroIcon from '@mui/icons-material/Euro';
import { validateVoucher, redeemVoucher } from '../../utils/voucherUtils';

/**
 * Dialog component for redeeming vouchers
 */
const RedeemVoucherDialog = ({ open, onClose, onVoucherRedeemed, cartTotal = 0 }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validatedVoucher, setValidatedVoucher] = useState(null);
  const [redeemed, setRedeemed] = useState(false);
  const [redemptionAmount, setRedemptionAmount] = useState(0);
  const [useFullAmount, setUseFullAmount] = useState(true);

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

      // Set initial redemption amount based on cart total or voucher value
      if (cartTotal > 0) {
        const initialAmount = Math.min(voucher.remainingValue, cartTotal);
        setRedemptionAmount(initialAmount);
        setUseFullAmount(initialAmount === voucher.remainingValue);
      } else {
        setRedemptionAmount(voucher.remainingValue);
        setUseFullAmount(true);
      }
    } catch (err) {
      setError(err.message);
      setValidatedVoucher(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle redemption amount change
  const handleRedemptionAmountChange = (event, newValue) => {
    setRedemptionAmount(newValue);
    setUseFullAmount(newValue === validatedVoucher?.remainingValue);
  };

  // Handle use full amount toggle
  const handleUseFullAmountToggle = () => {
    if (useFullAmount) {
      // If already using full amount, do nothing
      return;
    }
    setUseFullAmount(true);
    setRedemptionAmount(validatedVoucher?.remainingValue || 0);
  };

  // Handle manual amount input
  const handleManualAmountInput = event => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      const cappedValue = Math.min(value, validatedVoucher?.remainingValue || 0);
      setRedemptionAmount(cappedValue);
      setUseFullAmount(cappedValue === validatedVoucher?.remainingValue);
    }
  };

  // Handle voucher redemption
  const handleRedeemVoucher = async () => {
    setLoading(true);
    setError(null);

    try {
      const redeemedVoucher = await redeemVoucher(voucherCode, redemptionAmount);
      setRedeemed(true);
      if (onVoucherRedeemed) {
        // Pass the voucher with the actual redeemed amount
        onVoucherRedeemed({
          ...redeemedVoucher,
          value: redeemedVoucher.redeemedAmount, // Use the redeemed amount as the value for discount calculation
        });
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
    setRedemptionAmount(0);
    setUseFullAmount(true);
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
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Der Gutscheinwert von {redemptionAmount.toFixed(2)} € wurde angewendet.
            </Typography>
            {validatedVoucher && validatedVoucher.remainingValue > 0 && (
              <Typography variant="body1" color="primary" fontWeight="medium">
                Restguthaben auf dem Gutschein: {validatedVoucher.remainingValue.toFixed(2)} €
              </Typography>
            )}
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

            {!validatedVoucher && (
              <Button
                onClick={handleValidateVoucher}
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || !voucherCode.trim()}
              >
                {loading ? <CircularProgress size={24} /> : 'Gutschein prüfen'}
              </Button>
            )}

            {validatedVoucher && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Gutscheindetails:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Code:</Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {validatedVoucher.code}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Gesamtwert:</Typography>
                  <Typography variant="body1">{validatedVoucher.value.toFixed(2)} €</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Verfügbares Guthaben:</Typography>
                  <Typography variant="body1" color="primary" fontWeight="medium">
                    {validatedVoucher.remainingValue.toFixed(2)} €
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body1">Gültig bis:</Typography>
                  <Typography variant="body1">{validatedVoucher.expiresAt}</Typography>
                </Box>

                <Box sx={{ mt: 3, mb: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Einzulösender Betrag:
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <TextField
                      value={redemptionAmount.toFixed(2)}
                      onChange={handleManualAmountInput}
                      type="number"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EuroIcon />
                          </InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                          max: validatedVoucher.remainingValue,
                          step: 0.01,
                        },
                      }}
                      sx={{ width: '150px' }}
                    />
                    <Button
                      variant={useFullAmount ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={handleUseFullAmountToggle}
                      size="small"
                    >
                      Gesamtes Guthaben
                    </Button>
                  </Box>
                  <Slider
                    value={redemptionAmount}
                    onChange={handleRedemptionAmountChange}
                    min={0}
                    max={validatedVoucher.remainingValue}
                    step={0.01}
                    valueLabelDisplay="auto"
                    valueLabelFormat={value => `${value.toFixed(2)} €`}
                  />
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
            disabled={loading || redemptionAmount <= 0}
          >
            {loading ? <CircularProgress size={24} /> : 'Gutschein einlösen'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RedeemVoucherDialog;
