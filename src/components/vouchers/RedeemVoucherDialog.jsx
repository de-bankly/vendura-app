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
 * @typedef {object} ValidatedVoucher
 * @property {string} code - The voucher code.
 * @property {number} value - The initial value or discount percentage of the voucher.
 * @property {number} [remainingValue] - The remaining balance for gift cards.
 * @property {string} expiresAt - Formatted expiration date or 'Keine Ablaufzeit'.
 * @property {'GIFT_CARD' | 'DISCOUNT_CARD'} type - The type of the voucher.
 * @property {number} [discountPercentage] - The discount percentage for discount cards.
 * @property {number} [remainingUsages] - The remaining usages for discount cards.
 * @property {number} [maximumUsages] - The maximum usages for discount cards.
 * @property {string} id - The voucher code (used as ID).
 * @property {number} [redeemedAmount] - The amount redeemed from a gift card.
 * @property {number} [amount] - The amount redeemed (for cart calculation).
 */

/**
 * @typedef {object} RedeemedVoucher
 * @property {string} code - The voucher code.
 * @property {number} value - The initial value or redeemed amount/discount percentage.
 * @property {number} [remainingValue] - The remaining balance for gift cards after redemption.
 * @property {string} expiresAt - Formatted expiration date or 'Keine Ablaufzeit'.
 * @property {'GIFT_CARD' | 'DISCOUNT_CARD'} type - The type of the voucher.
 * @property {number} [discountPercentage] - The discount percentage for discount cards.
 * @property {number} [remainingUsages] - The remaining usages for discount cards after redemption.
 * @property {number} [maximumUsages] - The maximum usages for discount cards.
 * @property {string} id - The voucher code (used as ID).
 * @property {number} [redeemedAmount] - The amount redeemed from a gift card.
 * @property {number} [amount] - The amount redeemed (for cart calculation).
 */

/**
 * Dialog component for redeeming gift cards and discount vouchers.
 * Allows users to enter a voucher code, validate it, and apply it to their cart.
 * Handles both fixed amount gift cards and percentage-based discount cards.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {() => void} props.onClose - Callback function when the dialog is closed.
 * @param {(voucher: RedeemedVoucher) => void} props.onVoucherRedeemed - Callback function when a voucher is successfully redeemed. Passes the redeemed voucher details.
 * @param {number} [props.cartTotal=0] - The current total amount of the shopping cart. Used to calculate maximum redemption amount for gift cards and discount value for discount cards.
 * @returns {React.ReactElement} The RedeemVoucherDialog component.
 */
const RedeemVoucherDialog = ({ open, onClose, onVoucherRedeemed, cartTotal = 0 }) => {
  const theme = useTheme();
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  /** @type {[ValidatedVoucher | null, React.Dispatch<React.SetStateAction<ValidatedVoucher | null>>]} */
  const [validatedVoucher, setValidatedVoucher] = useState(null);
  const [redeemed, setRedeemed] = useState(false);
  const [redemptionAmount, setRedemptionAmount] = useState(0);
  const [useFullAmount, setUseFullAmount] = useState(true);

  const handleVoucherCodeChange = event => {
    setVoucherCode(event.target.value.toUpperCase());
    setError(null);
    if (validatedVoucher) {
      setValidatedVoucher(null);
      setRedemptionAmount(0);
      setUseFullAmount(true);
    }
  };

  const handleValidateVoucher = async () => {
    if (!voucherCode.trim()) {
      setError('Bitte geben Sie einen Gutscheincode ein');
      return;
    }

    if (!GiftCardService.validateGiftCardFormat(voucherCode)) {
      setError('Ungültiges Gutscheinformat. Gutscheincodes bestehen aus 13-19 Ziffern');
      return;
    }

    setLoading(true);
    setError(null);
    setValidatedVoucher(null);

    try {
      const voucherData = await GiftCardService.getTransactionalInformation(voucherCode);

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

      if (voucherData.expirationDate && new Date(voucherData.expirationDate) < new Date()) {
        setError('Dieser Gutschein ist abgelaufen');
        setLoading(false);
        return;
      }

      /** @type {ValidatedVoucher} */
      const voucher = {
        code: voucherCode,
        value: voucherData.initialBalance || 0,
        remainingValue: voucherData.remainingBalance || 0,
        expiresAt: voucherData.expirationDate
          ? new Date(voucherData.expirationDate).toLocaleDateString('de-DE')
          : 'Keine Ablaufzeit',
        type: voucherData.type,
        id: voucherCode,
      };

      if (voucherData.type === 'DISCOUNT_CARD') {
        voucher.discountPercentage = voucherData.discountPercentage || 0;
        voucher.remainingUsages = voucherData.remainingUsages || 0;
        voucher.maximumUsages = voucherData.maximumUsages || 0;
        voucher.value = voucherData.discountPercentage || 0;
      }

      setValidatedVoucher(voucher);

      if (voucher.type === 'GIFT_CARD') {
        const maxPossibleRedemption =
          cartTotal > 0 ? Math.min(voucher.remainingValue, cartTotal) : voucher.remainingValue;
        setRedemptionAmount(maxPossibleRedemption);
        setUseFullAmount(true);
      } else {
        setRedemptionAmount(0);
        setUseFullAmount(false);
      }
    } catch (err) {
      setError(err.message || 'Fehler bei der Validierung des Gutscheins');
      setValidatedVoucher(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRedemptionAmountChange = (event, newValue) => {
    if (validatedVoucher?.type !== 'GIFT_CARD') return;
    const maxAmount =
      cartTotal > 0
        ? Math.min(validatedVoucher.remainingValue, cartTotal)
        : validatedVoucher.remainingValue;
    const cappedValue = Math.min(Math.max(0, newValue), maxAmount);
    setRedemptionAmount(cappedValue);
    setUseFullAmount(cappedValue === validatedVoucher.remainingValue);
  };

  const handleUseFullAmountToggle = () => {
    if (validatedVoucher?.type !== 'GIFT_CARD') return;
    const maxAmount =
      cartTotal > 0
        ? Math.min(validatedVoucher.remainingValue, cartTotal)
        : validatedVoucher.remainingValue;
    setRedemptionAmount(maxAmount);
    setUseFullAmount(true);
  };

  const handleManualAmountInput = event => {
    if (validatedVoucher?.type !== 'GIFT_CARD') return;
    const value = parseFloat(event.target.value);
    if (!isNaN(value) && value >= 0) {
      const maxAmount =
        cartTotal > 0
          ? Math.min(validatedVoucher.remainingValue, cartTotal)
          : validatedVoucher.remainingValue;
      const cappedValue = Math.min(value, maxAmount);
      setRedemptionAmount(cappedValue);
      setUseFullAmount(cappedValue === validatedVoucher.remainingValue);
    } else if (event.target.value === '') {
      setRedemptionAmount(0);
      setUseFullAmount(false);
    }
  };

  const handleRedeemVoucher = async () => {
    if (!validatedVoucher) return;

    setLoading(true);
    setError(null);

    try {
      /** @type {RedeemedVoucher | null} */
      let redeemedVoucher = null;

      if (validatedVoucher.type === 'GIFT_CARD') {
        const paymentInfo = GiftCardService.applyGiftCardPayment(
          voucherCode,
          redemptionAmount,
          cartTotal || redemptionAmount
        );

        redeemedVoucher = {
          ...validatedVoucher,
          redeemedAmount: redemptionAmount,
          amount: redemptionAmount,
          value: redemptionAmount,
          remainingValue: validatedVoucher.remainingValue - redemptionAmount,
        };
      } else if (validatedVoucher.type === 'DISCOUNT_CARD') {
        const discountInfo = GiftCardService.applyDiscountCard(
          voucherCode,
          validatedVoucher.discountPercentage || 0,
          cartTotal
        );

        redeemedVoucher = {
          ...validatedVoucher,
          remainingUsages: (validatedVoucher.remainingUsages || 1) - 1,
        };
      }

      setRedeemed(true);
      if (onVoucherRedeemed && redeemedVoucher) {
        onVoucherRedeemed(redeemedVoucher);
      }
    } catch (err) {
      setError(err.message || 'Fehler beim Einlösen des Gutscheins');
      setRedeemed(false);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setVoucherCode('');
    setValidatedVoucher(null);
    setError(null);
    setRedeemed(false);
    setRedemptionAmount(0);
    setUseFullAmount(true);
    onClose();
  };

  const getMaxRedemptionValue = () => {
    if (!validatedVoucher || validatedVoucher.type !== 'GIFT_CARD') return 0;
    return cartTotal > 0
      ? Math.min(validatedVoucher.remainingValue, cartTotal)
      : validatedVoucher.remainingValue;
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
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
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
            {validatedVoucher?.type === 'GIFT_CARD' && (
              <Typography variant="body1" paragraph color="text.secondary">
                Der Gutscheinwert von {redemptionAmount.toFixed(2)} € wurde auf Ihren Einkauf
                angewendet.
              </Typography>
            )}
            {validatedVoucher?.type === 'DISCOUNT_CARD' && (
              <Typography variant="body1" paragraph color="text.secondary">
                Der {validatedVoucher.discountPercentage}% Rabatt wurde auf Ihren Einkauf
                angewendet.
              </Typography>
            )}

            {validatedVoucher &&
              validatedVoucher.type === 'GIFT_CARD' &&
              validatedVoucher.remainingValue > redemptionAmount && (
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
                placeholder="z.B. 1234-5678-9012-3456"
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Prüfen'}
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
                  {validatedVoucher.type === 'GIFT_CARD' && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Ursprünglicher Wert:
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
                    </>
                  )}
                  {validatedVoucher.type === 'DISCOUNT_CARD' && (
                    <>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Rabatt:
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={600} color="primary.main">
                          {validatedVoucher.discountPercentage}%
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">
                          Verbleibende Nutzungen:
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={500}>
                          {validatedVoucher.remainingUsages} / {validatedVoucher.maximumUsages}
                        </Typography>
                      </Grid>
                    </>
                  )}
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
                  {validatedVoucher.type === 'GIFT_CARD' ? (
                    <>
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                        color="primary.main"
                      >
                        Einzulösender Betrag:
                      </Typography>
                      <Box
                        sx={{
                          p: 2,
                          mb: 2,
                          borderRadius: 2,
                          bgcolor: alpha(theme.palette.background.default, 0.6),
                          border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 2,
                            mb: 2,
                            flexWrap: 'wrap',
                          }}
                        >
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
                                max: getMaxRedemptionValue(),
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
                            disabled={redemptionAmount === getMaxRedemptionValue()}
                            sx={{
                              borderRadius: 2,
                              boxShadow: useFullAmount ? 2 : 0,
                            }}
                          >
                            {cartTotal > 0 && validatedVoucher.remainingValue > cartTotal
                              ? 'Warenkorbwert nutzen'
                              : 'Volles Guthaben nutzen'}
                          </Button>
                        </Box>

                        <Slider
                          value={redemptionAmount}
                          onChange={handleRedemptionAmountChange}
                          min={0}
                          max={getMaxRedemptionValue()}
                          step={0.01}
                          valueLabelDisplay="auto"
                          valueLabelFormat={value => `${value.toFixed(2)} €`}
                          marks={[
                            { value: 0, label: '0 €' },
                            {
                              value: getMaxRedemptionValue(),
                              label: `${getMaxRedemptionValue().toFixed(2)} €`,
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
                      <Typography
                        variant="subtitle1"
                        fontWeight={600}
                        gutterBottom
                        color="primary.main"
                      >
                        Rabattdetails:
                      </Typography>
                      {cartTotal > 0 ? (
                        <Box
                          sx={{
                            mt: 1,
                            p: 2,
                            bgcolor: alpha(theme.palette.success.main, 0.05),
                            borderRadius: 1,
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                          }}
                        >
                          <Typography variant="body2" gutterBottom>
                            <strong>Aktueller Warenkorbwert:</strong> {cartTotal.toFixed(2)} €
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            <strong>Rabatt ({validatedVoucher.discountPercentage}%):</strong> -
                            {((cartTotal * validatedVoucher.discountPercentage) / 100).toFixed(2)} €
                          </Typography>
                          <Divider sx={{ my: 1 }} />
                          <Typography variant="body1" fontWeight="bold" color="success.dark">
                            <strong>Neuer Preis:</strong>{' '}
                            {(
                              cartTotal -
                              (cartTotal * validatedVoucher.discountPercentage) / 100
                            ).toFixed(2)}{' '}
                            €
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Der Rabatt wird auf den Warenkorb angewendet, sobald Artikel hinzugefügt
                          wurden.
                        </Typography>
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

        {!redeemed && validatedVoucher && (
          <Box sx={{ position: 'relative', ml: 'auto' }}>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleRedeemVoucher}
                disabled={
                  loading ||
                  (validatedVoucher.type === 'GIFT_CARD' &&
                    (redemptionAmount <= 0 ||
                      redemptionAmount > validatedVoucher.remainingValue)) ||
                  (validatedVoucher.type === 'DISCOUNT_CARD' &&
                    cartTotal <= 0) /* Disable discount if cart is empty */
                }
                sx={{
                  py: 1.2,
                  px: 3,
                  borderRadius: 2,
                  boxShadow: 2,
                  minWidth: '180px', // Ensure button has enough width
                }}
              >
                {validatedVoucher?.type === 'DISCOUNT_CARD'
                  ? `${validatedVoucher.discountPercentage}% Rabatt anwenden`
                  : `${redemptionAmount.toFixed(2)} € einlösen`}
              </Button>
            </motion.div>
            {loading && (
              <CircularProgress
                size={24}
                color="primary"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RedeemVoucherDialog;
