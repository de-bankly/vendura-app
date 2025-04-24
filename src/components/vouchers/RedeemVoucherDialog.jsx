import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EuroIcon from '@mui/icons-material/Euro';
import CloseIcon from '@mui/icons-material/Close';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import VerifiedIcon from '@mui/icons-material/Verified';
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
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import GiftCardService from '../../services/GiftCardService';

/**
 * Dialog component for redeeming vouchers
 */
const RedeemVoucherDialog = ({ open, onClose, onVoucherRedeemed, cartTotal = 0 }) => {
  const theme = useTheme();
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

    // Format validation
    if (!GiftCardService.validateGiftCardFormat(voucherCode)) {
      setError('Ungültiges Gutscheinformat. Gutscheincodes bestehen aus 16-19 Ziffern');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get voucher details using GiftCardService
      const voucherData = await GiftCardService.getTransactionalInformation(voucherCode);

      // Additional validations
      if (voucherData.type === 'GIFT_CARD') {
        if (!voucherData.remainingBalance || voucherData.remainingBalance <= 0) {
          setError('Dieser Gutschein hat kein Guthaben mehr');
          setLoading(false);
          return;
        }
      } else if (voucherData.type === 'DISCOUNT_CARD') {
        if (!voucherData.remainingUsages || voucherData.remainingUsages <= 0) {
          setError('Dieser Rabattgutschein hat keine Nutzungen mehr übrig');
          setLoading(false);
          return;
        }
      }

      // Check expiration
      if (voucherData.expirationDate && new Date(voucherData.expirationDate) < new Date()) {
        setError('Dieser Gutschein ist abgelaufen');
        setLoading(false);
        return;
      }

      // Format the voucher data to match component expectations
      const voucher = {
        code: voucherCode,
        value: voucherData.initialBalance || 0,
        remainingValue: voucherData.remainingBalance || 0,
        expiresAt: voucherData.expirationDate
          ? new Date(voucherData.expirationDate).toLocaleDateString('de-DE')
          : 'Keine Ablaufzeit',
        type: voucherData.type,
      };

      // Add discount card specific properties
      if (voucherData.type === 'DISCOUNT_CARD') {
        voucher.discountPercentage = voucherData.discountPercentage || 0;
        voucher.remainingUsages = voucherData.remainingUsages || 0;
        voucher.maximumUsages = voucherData.maximumUsages || 0;
      }

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
      setError(err.message || 'Fehler bei der Validierung des Gutscheins');
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
    const maxAmount =
      cartTotal > 0
        ? Math.min(validatedVoucher?.remainingValue || 0, cartTotal)
        : validatedVoucher?.remainingValue || 0;
    setRedemptionAmount(maxAmount);
  };

  // Handle manual amount input
  const handleManualAmountInput = event => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      const maxAmount =
        cartTotal > 0
          ? Math.min(validatedVoucher?.remainingValue || 0, cartTotal)
          : validatedVoucher?.remainingValue || 0;
      const cappedValue = Math.min(value, maxAmount);
      setRedemptionAmount(cappedValue);
      setUseFullAmount(cappedValue === maxAmount);
    }
  };

  // Handle voucher redemption
  const handleRedeemVoucher = async () => {
    setLoading(true);
    setError(null);

    try {
      let redeemedVoucher;

      if (validatedVoucher.type === 'GIFT_CARD') {
        // Apply the gift card payment using GiftCardService
        const paymentInfo = GiftCardService.applyGiftCardPayment(
          voucherCode,
          redemptionAmount,
          cartTotal || redemptionAmount
        );

        // Format the redeemed voucher data
        redeemedVoucher = {
          ...validatedVoucher,
          id: voucherCode,
          redeemedAmount: redemptionAmount,
          type: 'GIFT_CARD',
          // Add amount property explicitly for price calculation
          amount: redemptionAmount, // This is the key property needed for cart calculations
          value: redemptionAmount, // Keep this for backward compatibility
        };
      } else if (validatedVoucher.type === 'DISCOUNT_CARD') {
        // Apply discount card
        const discountInfo = GiftCardService.applyDiscountCard(
          voucherCode,
          validatedVoucher.discountPercentage || 0,
          cartTotal
        );

        // Format the redeemed discount voucher
        redeemedVoucher = {
          ...validatedVoucher,
          id: voucherCode,
          type: 'DISCOUNT_CARD',
          discountPercentage: validatedVoucher.discountPercentage || 0,
          remainingUsages: (validatedVoucher.remainingUsages || 1) - 1,
        };
      }

      setRedeemed(true);
      if (onVoucherRedeemed && redeemedVoucher) {
        // Pass the voucher with the actual redeemed amount
        onVoucherRedeemed(redeemedVoucher);
      }
    } catch (err) {
      setError(err.message || 'Fehler beim Einlösen des Gutscheins');
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 2.5,
          px: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.2),
                color: 'white',
                width: 42,
                height: 42,
                mr: 2,
                boxShadow: theme.shadows[3],
              }}
            >
              <CardGiftcardIcon sx={{ fontSize: 24 }} />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Gutschein einlösen
            </Typography>
          </Box>
          <IconButton
            color="inherit"
            onClick={handleClose}
            size="large"
            sx={{
              bgcolor: alpha(theme.palette.common.white, 0.1),
              '&:hover': {
                bgcolor: alpha(theme.palette.common.white, 0.2),
              },
            }}
            aria-label="Schließen"
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {redeemed ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
              textAlign: 'center',
              py: 3,
              px: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.success.main, 0.1),
                color: theme.palette.success.main,
                width: 80,
                height: 80,
                mx: 'auto',
                mb: 2,
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="success.main">
              Gutschein erfolgreich eingelöst!
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              Der Gutscheinwert von {redemptionAmount.toFixed(2)} € wurde auf Ihren Einkauf
              angewendet.
            </Typography>

            {validatedVoucher && validatedVoucher.remainingValue > redemptionAmount && (
              <Box
                sx={{
                  display: 'inline-block',
                  p: 2,
                  mt: 1,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  border: `1px solid ${alpha(theme.palette.info.main, 0.3)}`,
                }}
              >
                <Typography variant="body2" color="info.main" fontWeight={500}>
                  Restguthaben auf dem Gutschein:{' '}
                  <strong>
                    {(validatedVoucher.remainingValue - redemptionAmount).toFixed(2)} €
                  </strong>
                </Typography>
              </Box>
            )}

            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Chip
                icon={<ConfirmationNumberIcon />}
                label={validatedVoucher?.code}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 500 }}
              />
            </Box>
          </Box>
        ) : (
          <>
            <Typography variant="body1" paragraph>
              Geben Sie Ihren Gutscheincode ein, um diesen für den aktuellen Einkauf einzulösen.
            </Typography>

            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              sx={{
                display: 'flex',
                mb: 3,
                mt: 2,
              }}
            >
              <TextField
                autoFocus
                label="Gutscheincode"
                fullWidth
                value={voucherCode}
                onChange={handleVoucherCodeChange}
                disabled={loading || !!validatedVoucher}
                variant="outlined"
                placeholder="z.B. WELCOME10"
                sx={{
                  mr: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CardGiftcardIcon fontSize="small" color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleValidateVoucher}
                disabled={loading || !voucherCode.trim() || !!validatedVoucher}
                sx={{
                  minWidth: '120px',
                  borderRadius: 2,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : 'Prüfen'}
              </Button>
            </Box>

            {error && (
              <Alert
                severity="error"
                variant="filled"
                sx={{ mb: 3 }}
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            {validatedVoucher && (
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                variant="outlined"
                sx={{
                  p: 3,
                  mt: 2,
                  borderRadius: 2,
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  bgcolor: alpha(theme.palette.primary.main, 0.03),
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      mr: 2,
                    }}
                  >
                    <VerifiedIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight={600}>
                      Gutschein bestätigt
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {validatedVoucher.code}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Gesamtwert:
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {validatedVoucher.value.toFixed(2)} €
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Verfügbares Guthaben:
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                      {validatedVoucher.remainingValue.toFixed(2)} €
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Gültig bis:
                    </Typography>
                    <Typography variant="subtitle2" fontWeight={500}>
                      {validatedVoucher.expiresAt}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    gutterBottom
                    color="primary.main"
                  >
                    Einzulösender Betrag:
                  </Typography>

                  {validatedVoucher.type === 'GIFT_CARD' ? (
                    <>
                      <Box
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.default, 0.6),
                          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <TextField
                            value={redemptionAmount.toFixed(2)}
                            onChange={handleManualAmountInput}
                            variant="outlined"
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EuroIcon fontSize="small" />
                                </InputAdornment>
                              ),
                              inputProps: {
                                min: 0,
                                max: Math.min(
                                  validatedVoucher.remainingValue,
                                  cartTotal || validatedVoucher.remainingValue
                                ),
                                step: 0.01,
                              },
                              sx: {
                                borderRadius: 1.5,
                              },
                            }}
                            sx={{
                              width: '160px',
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                              },
                            }}
                          />
                          <Button
                            variant={useFullAmount ? 'contained' : 'outlined'}
                            color="primary"
                            onClick={handleUseFullAmountToggle}
                            sx={{
                              borderRadius: 2,
                              boxShadow: useFullAmount ? 2 : 0,
                            }}
                          >
                            Gesamtes Guthaben
                          </Button>
                        </Box>

                        <Slider
                          value={redemptionAmount}
                          onChange={handleRedemptionAmountChange}
                          min={0}
                          max={
                            cartTotal > 0
                              ? Math.min(validatedVoucher.remainingValue, cartTotal)
                              : validatedVoucher.remainingValue
                          }
                          step={0.01}
                          valueLabelDisplay="auto"
                          valueLabelFormat={value => `${value.toFixed(2)} €`}
                          marks={[
                            { value: 0, label: '0 €' },
                            {
                              value:
                                cartTotal > 0
                                  ? Math.min(validatedVoucher.remainingValue, cartTotal)
                                  : validatedVoucher.remainingValue,
                              label: `${(cartTotal > 0 ? Math.min(validatedVoucher.remainingValue, cartTotal) : validatedVoucher.remainingValue).toFixed(2)} €`,
                            },
                          ]}
                          sx={{
                            color: theme.palette.primary.main,
                            '& .MuiSlider-thumb': {
                              height: 20,
                              width: 20,
                            },
                            '& .MuiSlider-valueLabel': {
                              backgroundColor: theme.palette.primary.main,
                            },
                          }}
                        />
                      </Box>
                    </>
                  ) : (
                    <>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Rabatt:</strong> {validatedVoucher.discountPercentage}%
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Verbleibende Nutzungen:</strong> {validatedVoucher.remainingUsages}
                      </Typography>
                      {cartTotal > 0 && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.1),
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            <strong>Warenkorb:</strong> {cartTotal.toFixed(2)} €
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Rabatt:</strong>{' '}
                            {((cartTotal * validatedVoucher.discountPercentage) / 100).toFixed(2)} €
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body1" fontWeight="bold" color="success.main">
                            <strong>Neuer Preis:</strong>{' '}
                            {(
                              cartTotal -
                              (cartTotal * validatedVoucher.discountPercentage) / 100
                            ).toFixed(2)}{' '}
                            €
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Paper>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          p: 3,
          bgcolor: theme.palette.background.default,
          borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Button
          onClick={handleClose}
          color="inherit"
          variant="outlined"
          sx={{
            borderRadius: 2,
            px: 2,
          }}
        >
          {redeemed ? 'Schließen' : 'Abbrechen'}
        </Button>

        {validatedVoucher && !redeemed && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleRedeemVoucher}
                fullWidth
                disabled={
                  !validatedVoucher ||
                  (validatedVoucher.type === 'GIFT_CARD' && redemptionAmount <= 0)
                }
                sx={{
                  py: 1.2,
                  mt: 2,
                  borderRadius: 2,
                  boxShadow: 2,
                }}
              >
                {validatedVoucher?.type === 'DISCOUNT_CARD'
                  ? `${validatedVoucher.discountPercentage}% Rabatt anwenden`
                  : `${redemptionAmount.toFixed(2)} € Gutschein einlösen`}
              </Button>
            )}
          </motion.div>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RedeemVoucherDialog;
