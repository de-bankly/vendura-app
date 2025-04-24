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
 * @typedef {object} Voucher
 * @property {string} id - The voucher code/ID.
 * @property {'GIFT_CARD' | 'DISCOUNT_CARD'} type - The type of the voucher.
 * @property {number} [remainingBalance] - Remaining balance (for gift cards).
 * @property {number} [amount] - Amount to use from the gift card.
 * @property {number} [discountPercentage] - Discount percentage (for discount cards).
 * @property {number} [remainingUsages] - Remaining usages (for discount cards).
 * @property {string} [expirationDate] - ISO date string for expiration.
 */

/**
 * @typedef {object} VoucherInfo
 * @property {string} id - The voucher code/ID.
 * @property {'GIFT_CARD' | 'DISCOUNT_CARD'} type - The type of the voucher.
 * @property {number} [remainingBalance] - Remaining balance (for gift cards).
 * @property {number} [discountPercentage] - Discount percentage (for discount cards).
 * @property {number} [remainingUsages] - Remaining usages (for discount cards).
 * @property {string} [expirationDate] - ISO date string for expiration.
 */

/**
 * VoucherInputField component for entering and validating gift cards/vouchers.
 * @param {object} props - The component props.
 * @param {(voucher: Voucher) => void} props.onVoucherApplied - Callback function when a valid voucher is applied.
 * @param {Voucher[]} [props.appliedVouchers=[]] - Array of vouchers already applied.
 * @param {number} [props.currentTotal=0] - The current total amount of the cart/order.
 */
const VoucherInputField = ({ onVoucherApplied, appliedVouchers = [], currentTotal = 0 }) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /** @type {[VoucherInfo | null, React.Dispatch<React.SetStateAction<VoucherInfo | null>>]} */
  const [voucherInfo, setVoucherInfo] = useState(null);
  const [amountToUse, setAmountToUse] = useState(0);
  const [useFullAmount, setUseFullAmount] = useState(true);

  useEffect(() => {
    if (voucherInfo && voucherInfo.type === 'GIFT_CARD') {
      if (useFullAmount) {
        setAmountToUse(Math.min(voucherInfo.remainingBalance, currentTotal));
      } else if (amountToUse > voucherInfo.remainingBalance) {
        setAmountToUse(voucherInfo.remainingBalance);
      } else if (amountToUse > currentTotal) {
        setAmountToUse(currentTotal);
      }
    }
  }, [voucherInfo, useFullAmount, currentTotal, amountToUse]);

  const handleInputChange = e => {
    setVoucherCode(e.target.value);
    setError(null);
    setVoucherInfo(null);
  };

  const handleAmountChange = (event, newValue) => {
    setAmountToUse(newValue);
  };

  const handleUseFullAmountToggle = event => {
    setUseFullAmount(event.target.checked);
  };

  const validateVoucher = async () => {
    setError(null);
    setVoucherInfo(null);

    if (!voucherCode.trim()) {
      setError('Bitte geben Sie einen Gutscheincode ein');
      return;
    }

    if (!GiftCardService.validateGiftCardFormat(voucherCode)) {
      setError('Ungültiges Gutscheinformat. Gutscheincodes bestehen aus 16 Ziffern');
      return;
    }

    if (appliedVouchers.some(voucher => voucher.id === voucherCode)) {
      setError('Dieser Gutschein wurde bereits angewendet');
      return;
    }

    setLoading(true);
    try {
      const voucherData = await GiftCardService.getTransactionalInformation(voucherCode);
      setVoucherInfo(voucherData);

      if (voucherData.type === 'GIFT_CARD') {
        if (!voucherData.remainingBalance || voucherData.remainingBalance <= 0) {
          setError('Dieser Gutschein hat kein Guthaben mehr');
          setVoucherInfo(null);
          return;
        }
      } else if (voucherData.type === 'DISCOUNT_CARD') {
        if (!voucherData.remainingUsages || voucherData.remainingUsages <= 0) {
          setError('Dieser Rabattgutschein hat keine Verwendungen mehr übrig');
          setVoucherInfo(null);
          return;
        }
      }

      if (voucherData.expirationDate && new Date(voucherData.expirationDate) < new Date()) {
        setError('Dieser Gutschein ist abgelaufen');
        setVoucherInfo(null);
        return;
      }

      if (voucherData.type === 'GIFT_CARD') {
        setUseFullAmount(true);
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
      setVoucherInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const applyVoucher = () => {
    if (!voucherInfo) return;

    if (voucherInfo.type === 'GIFT_CARD') {
      if (voucherInfo.remainingBalance <= 0) {
        setError('Dieser Gutschein hat kein Guthaben mehr');
        return;
      }
      if (amountToUse <= 0) {
        setError('Bitte wählen Sie einen Betrag größer als 0 €');
        return;
      }

      const safeAmount = Math.min(amountToUse, voucherInfo.remainingBalance, currentTotal);

      onVoucherApplied({
        id: voucherInfo.id,
        type: voucherInfo.type,
        remainingBalance: voucherInfo.remainingBalance,
        amount: safeAmount,
        expirationDate: voucherInfo.expirationDate,
      });
    } else if (voucherInfo.type === 'DISCOUNT_CARD') {
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

    setVoucherCode('');
    setVoucherInfo(null);
    setAmountToUse(0);
    setError(null);
    setUseFullAmount(true);
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
          helperText={error || 'Geben Sie Ihren Gutscheincode ein (16 Ziffern)'}
          error={!!error}
          InputProps={{
            startAdornment: <CardGiftcardIcon color="action" sx={{ mr: 1, opacity: 0.6 }} />,
          }}
          sx={{ mr: 1 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={validateVoucher}
          disabled={loading || !voucherCode.trim() || !!voucherInfo}
          sx={{ minWidth: 120, height: 56 }}
        >
          {loading ? <CircularProgress size={24} /> : 'Prüfen'}
        </Button>
      </Box>

      {error && !voucherInfo && (
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
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1,
            }}
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

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" fontWeight="medium" gutterBottom>
                    Wie viel möchten Sie verwenden? (Maximal{' '}
                    {Math.min(voucherInfo.remainingBalance, currentTotal).toFixed(2)} € möglich)
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

                  <Collapse in={!useFullAmount}>
                    <Slider
                      value={amountToUse}
                      onChange={handleAmountChange}
                      aria-labelledby="gift-card-amount-slider"
                      valueLabelDisplay="auto"
                      valueLabelFormat={value => `${value.toFixed(2)} €`}
                      step={0.01}
                      min={0.01}
                      max={Math.min(voucherInfo.remainingBalance, currentTotal)}
                      color="secondary"
                      sx={{
                        mb: 1,
                        mt: 1,
                        '& .MuiSlider-thumb': {
                          color: 'secondary.main',
                        },
                        '& .MuiSlider-track': {
                          color: 'secondary.main',
                        },
                        '& .MuiSlider-rail': {
                          color: 'rgba(255, 255, 255, 0.3)',
                        },
                      }}
                    />

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 2,
                      }}
                    >
                      <TextField
                        value={amountToUse.toFixed(2)}
                        onChange={e => {
                          const value = parseFloat(e.target.value);
                          if (!isNaN(value) && value >= 0) {
                            setAmountToUse(
                              Math.min(value, voucherInfo.remainingBalance, currentTotal)
                            );
                          }
                        }}
                        variant="outlined"
                        size="small"
                        type="number"
                        inputProps={{ step: '0.01', min: '0.01' }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EuroIcon fontSize="small" sx={{ color: 'primary.contrastText' }} />
                            </InputAdornment>
                          ),
                          sx: { color: 'primary.contrastText' },
                        }}
                        sx={{
                          width: '130px',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(255, 255, 255, 0.5)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'primary.contrastText',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: 'secondary.main',
                            },
                          },
                        }}
                      />
                      <Typography variant="body2" color="primary.contrastText">
                        Verbleibendes Guthaben:{' '}
                        {(voucherInfo.remainingBalance - amountToUse).toFixed(2)} €
                      </Typography>
                    </Box>
                  </Collapse>
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

          {error && voucherInfo?.type === 'GIFT_CARD' && (
            <Alert severity="warning" icon={<ErrorIcon />} sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={applyVoucher}
            disabled={loading || (voucherInfo?.type === 'GIFT_CARD' && amountToUse <= 0)}
            sx={{ mt: 2 }}
            startIcon={<CheckCircleIcon />}
          >
            {voucherInfo?.type === 'GIFT_CARD'
              ? `Gutschein für ${amountToUse.toFixed(2)} € anwenden`
              : 'Rabatt anwenden'}
          </Button>

          {voucherInfo?.type === 'DISCOUNT_CARD' && (
            <Alert
              icon={<InfoIcon />}
              severity="info"
              sx={{ mt: 1, bgcolor: 'info.dark', color: 'info.contrastText' }}
            >
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
