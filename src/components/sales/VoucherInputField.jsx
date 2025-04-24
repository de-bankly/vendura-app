import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  Collapse,
  Divider,
  Chip,
  Slider,
  InputAdornment,
  FormControlLabel,
  Switch,
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import EuroIcon from '@mui/icons-material/Euro';
import GiftCardService from '../../services/GiftCardService';

/**
 * VoucherInputField component for entering and validating gift cards
 */
const VoucherInputField = ({ onVoucherApplied, appliedVouchers = [], currentTotal = 0 }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [amountToUse, setAmountToUse] = useState(0);
  const [useFullAmount, setUseFullAmount] = useState(true);

  // Update amount to use when voucher info changes or use full amount toggle changes
  useEffect(() => {
    if (voucherInfo && voucherInfo.type === 'GIFT_CARD') {
      if (useFullAmount) {
        // If using full amount, use either the full balance or the current total (whichever is less)
        setAmountToUse(Math.min(voucherInfo.remainingBalance, currentTotal));
      } else if (amountToUse > voucherInfo.remainingBalance) {
        // Make sure we don't exceed the remaining balance
        setAmountToUse(voucherInfo.remainingBalance);
      } else if (amountToUse > currentTotal) {
        // Make sure we don't exceed the current total
        setAmountToUse(currentTotal);
      }
    }
  }, [voucherInfo, useFullAmount, currentTotal]);

  const handleInputChange = e => {
    setVoucherCode(e.target.value);
    setError(null);
  };

  const handleAmountChange = (event, newValue) => {
    setAmountToUse(newValue);
  };

  const handleUseFullAmountToggle = event => {
    setUseFullAmount(event.target.checked);
  };

  const validateVoucher = async () => {
    // Clear previous states
    setError(null);
    setVoucherInfo(null);

    // Basic validation
    if (!voucherCode.trim()) {
      setError('Bitte geben Sie einen Gutscheincode ein');
      return;
    }

    // Format validation
    if (!GiftCardService.validateGiftCardFormat(voucherCode)) {
      setError('Ungültiges Gutscheinformat. Gutscheincodes bestehen aus 16 Ziffern');
      return;
    }

    // Check if already applied
    if (appliedVouchers.some(voucher => voucher.id === voucherCode)) {
      setError('Dieser Gutschein wurde bereits angewendet');
      return;
    }

    setLoading(true);
    try {
      // API call to validate and get voucher details
      const voucherData = await GiftCardService.getTransactionalInformation(voucherCode);
      setVoucherInfo(voucherData);

      // Check if voucher is valid for use
      if (voucherData.type === 'GIFT_CARD') {
        if (!voucherData.remainingBalance || voucherData.remainingBalance <= 0) {
          setError('Dieser Gutschein hat kein Guthaben mehr');
          return;
        }
      } else if (voucherData.type === 'DISCOUNT_CARD') {
        if (!voucherData.remainingUsages || voucherData.remainingUsages <= 0) {
          setError('Dieser Rabattgutschein hat keine Verwendungen mehr übrig');
          return;
        }
      }

      // Check expiration
      if (voucherData.expirationDate && new Date(voucherData.expirationDate) < new Date()) {
        setError('Dieser Gutschein ist abgelaufen');
        return;
      }

      // Set initial amount to use (for gift cards)
      if (voucherData.type === 'GIFT_CARD') {
        setAmountToUse(Math.min(voucherData.remainingBalance, currentTotal));
      }
    } catch (err) {
      console.error('Voucher validation error:', err);
      setError(
        err.response?.status === 404
          ? 'Gutschein nicht gefunden'
          : err.response?.data?.message ||
              'Es ist ein Fehler bei der Überprüfung des Gutscheins aufgetreten'
      );
    } finally {
      setLoading(false);
    }
  };

  const applyVoucher = () => {
    if (voucherInfo) {
      if (voucherInfo.type === 'GIFT_CARD') {
        // Only apply the gift card if there's a remaining balance
        if (voucherInfo.remainingBalance <= 0) {
          setError('Dieser Gutschein hat kein Guthaben mehr');
          return;
        }

        // Ensure amount to use doesn't exceed remaining balance
        const safeAmount = Math.min(amountToUse, voucherInfo.remainingBalance, currentTotal);

        onVoucherApplied({
          id: voucherInfo.id,
          type: voucherInfo.type,
          remainingBalance: voucherInfo.remainingBalance,
          amount: safeAmount,
          expirationDate: voucherInfo.expirationDate,
        });
      } else if (voucherInfo.type === 'DISCOUNT_CARD') {
        // Only apply the discount card if there are remaining usages
        if (voucherInfo.remainingUsages <= 0) {
          setError('Dieser Rabattgutschein hat keine Verwendungen mehr übrig');
          return;
        }

        onVoucherApplied({
          id: voucherInfo.id,
          type: voucherInfo.type,
          discountPercentage: voucherInfo.discountPercentage,
          remainingUsages: voucherInfo.remainingUsages,
          expirationDate: voucherInfo.expirationDate,
        });
      }

      // Reset the form
      setVoucherCode('');
      setVoucherInfo(null);
      setAmountToUse(0);
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CardGiftcardIcon color="primary" sx={{ mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="medium">
          Gutschein einlösen
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', mb: 1 }}>
        <TextField
          label="Gutscheincode"
          variant="outlined"
          fullWidth
          value={voucherCode}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="16-stelligen Code eingeben"
          helperText="Geben Sie Ihren Gutscheincode ein (16 Ziffern)"
          InputProps={{
            startAdornment: <CardGiftcardIcon color="action" sx={{ mr: 1, opacity: 0.6 }} />,
          }}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={validateVoucher}
          disabled={loading || !voucherCode.trim()}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Prüfen'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" icon={<ErrorIcon />} sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      <Collapse in={!!voucherInfo && !error}>
        <Paper
          variant="outlined"
          sx={{
            mt: 2,
            p: 2,
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            borderColor: 'primary.main',
          }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {voucherInfo?.type === 'GIFT_CARD' ? (
                <CardGiftcardIcon sx={{ mr: 1 }} />
              ) : (
                <LocalOfferIcon sx={{ mr: 1 }} />
              )}
              <Typography variant="subtitle2" fontWeight="bold">
                {voucherInfo?.type === 'GIFT_CARD' ? 'Geschenkkarte' : 'Rabattkarte'}
              </Typography>
            </Box>
            <Chip
              icon={<CheckCircleIcon />}
              label="Gültig"
              color="success"
              size="small"
              variant="filled"
            />
          </Box>

          <Divider sx={{ my: 1, borderColor: 'primary.contrastText', opacity: 0.2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
            <Typography variant="body2">
              <strong>ID:</strong> {voucherInfo?.id}
            </Typography>

            {voucherInfo?.type === 'GIFT_CARD' && (
              <>
                <Typography variant="body2">
                  <strong>Verfügbares Guthaben:</strong> {voucherInfo?.remainingBalance?.toFixed(2)}{' '}
                  €
                </Typography>

                {/* Amount selection section for gift cards */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Wie viel möchten Sie verwenden?
                  </Typography>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={useFullAmount}
                        onChange={handleUseFullAmountToggle}
                        color="secondary"
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Maximal verfügbaren Betrag verwenden{' '}
                        {useFullAmount
                          ? `(${Math.min(voucherInfo.remainingBalance, currentTotal).toFixed(2)} €)`
                          : ''}
                      </Typography>
                    }
                    sx={{ mb: 1 }}
                  />

                  {!useFullAmount && (
                    <>
                      <Slider
                        value={amountToUse}
                        onChange={handleAmountChange}
                        aria-labelledby="gift-card-amount-slider"
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => `${value.toFixed(2)} €`}
                        step={0.01}
                        min={0}
                        max={Math.min(voucherInfo.remainingBalance, currentTotal)}
                        sx={{ mb: 2 }}
                      />

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <TextField
                          value={amountToUse.toFixed(2)}
                          onChange={e => {
                            const value = parseFloat(e.target.value);
                            if (!isNaN(value)) {
                              setAmountToUse(
                                Math.min(value, voucherInfo.remainingBalance, currentTotal)
                              );
                            }
                          }}
                          variant="outlined"
                          size="small"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EuroIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          sx={{ width: '120px' }}
                        />
                        <Typography variant="body2" color="primary.contrastText">
                          Verbleibendes Guthaben:{' '}
                          {(voucherInfo.remainingBalance - amountToUse).toFixed(2)} €
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
              </>
            )}

            {voucherInfo?.type === 'DISCOUNT_CARD' && (
              <>
                <Typography variant="body2">
                  <strong>Rabatt:</strong> {voucherInfo?.discountPercentage}%
                </Typography>
                <Typography variant="body2">
                  <strong>Verbleibende Nutzungen:</strong> {voucherInfo?.remainingUsages || 0}
                </Typography>
              </>
            )}

            {voucherInfo?.expirationDate && (
              <Typography variant="body2">
                <strong>Gültig bis:</strong>{' '}
                {new Date(voucherInfo?.expirationDate).toLocaleDateString()}
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={applyVoucher}
            sx={{ mt: 2 }}
            startIcon={<CheckCircleIcon />}
          >
            {voucherInfo?.type === 'GIFT_CARD'
              ? useFullAmount
                ? 'Geschenkkarte für maximalen Betrag verwenden'
                : `Geschenkkarte für ${amountToUse.toFixed(2)} € verwenden`
              : 'Rabatt anwenden'}
          </Button>

          {voucherInfo?.type === 'DISCOUNT_CARD' && (
            <Alert icon={<InfoIcon />} severity="info" sx={{ mt: 1 }}>
              Dieser Rabatt von {voucherInfo?.discountPercentage}% wird auf den Gesamtbetrag
              angewendet.
            </Alert>
          )}
        </Paper>
      </Collapse>
    </Paper>
  );
};

export default VoucherInputField;
