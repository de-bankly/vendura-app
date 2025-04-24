import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import {
  CardGiftcard as CardGiftcardIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import GiftCardService from '../../services/GiftCardService';

/**
 * Komponente zur Verarbeitung von Geschenkkarten-Zahlungen im Kassensystem.
 * Ermöglicht das Eingeben, Validieren und Anwenden von Geschenkkarten auf eine Bestellung.
 *
 * @param {object} props - Die Eigenschaften der Komponente.
 * @param {function(object): void} props.onGiftCardApplied - Callback, der aufgerufen wird, wenn eine Geschenkkarte erfolgreich angewendet wurde. Erhält ein Objekt mit den Kartendetails ({ id, type, amount, remainingBalance }).
 * @param {Array<{id: string, type: string, amount: number, remainingBalance: number}>} [props.appliedGiftCards=[]] - Eine Liste der bereits auf die Bestellung angewendeten Geschenkkarten.
 * @param {function(string): void} props.onGiftCardRemoved - Callback, der aufgerufen wird, wenn eine angewendete Geschenkkarte entfernt werden soll. Erhält die ID der zu entfernenden Karte.
 * @param {number} [props.orderTotal=0] - Der Gesamtbetrag der aktuellen Bestellung.
 * @param {boolean} [props.disabled=false] - Wenn true, sind alle Interaktionen in dieser Sektion deaktiviert.
 */
const GiftCardPaymentSection = ({
  onGiftCardApplied,
  appliedGiftCards = [],
  onGiftCardRemoved,
  orderTotal = 0,
  disabled = false,
}) => {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [giftCardInfo, setGiftCardInfo] = useState(null);
  const [useFullAmount, setUseFullAmount] = useState(true);
  const [amountToUse, setAmountToUse] = useState(0);

  const handleGiftCardCodeChange = e => {
    setGiftCardCode(e.target.value);
    setError(null);
    setGiftCardInfo(null);
  };

  const validateGiftCard = async () => {
    if (!giftCardCode.trim()) {
      setError('Bitte geben Sie einen Gutscheincode ein');
      return;
    }

    if (!GiftCardService.validateGiftCardFormat(giftCardCode)) {
      setError('Ungültiges Gutscheinformat. Gutscheincodes bestehen aus 16 Ziffern');
      return;
    }

    if (appliedGiftCards.some(card => card.id === giftCardCode)) {
      setError('Diese Geschenkkarte wurde bereits hinzugefügt');
      return;
    }

    setLoading(true);
    setError(null);
    setGiftCardInfo(null);

    try {
      const cardInfo = await GiftCardService.getTransactionalInformation(giftCardCode);

      if (cardInfo.type !== 'GIFT_CARD') {
        setError('Nur Geschenkkarten können für Zahlungen verwendet werden');
        setLoading(false);
        return;
      }

      if (!cardInfo.remainingBalance || cardInfo.remainingBalance <= 0) {
        setError('Diese Geschenkkarte hat kein Guthaben mehr');
        setLoading(false);
        return;
      }

      if (cardInfo.expirationDate && new Date(cardInfo.expirationDate) < new Date()) {
        setError('Diese Geschenkkarte ist abgelaufen');
        setLoading(false);
        return;
      }

      setGiftCardInfo(cardInfo);
      const currentAppliedAmount = appliedGiftCards.reduce(
        (sum, card) => sum + (card.amount || 0),
        0
      );
      const remainingOrderTotal = Math.max(0, orderTotal - currentAppliedAmount);
      const maxAmount = Math.min(cardInfo.remainingBalance, remainingOrderTotal);
      setAmountToUse(maxAmount);
      setUseFullAmount(true);
    } catch (error) {
      console.error('Error validating gift card:', error);
      setError(
        error.response?.status === 404
          ? 'Geschenkkarte nicht gefunden'
          : error.response?.data?.message || 'Fehler bei der Überprüfung der Geschenkkarte'
      );
    } finally {
      setLoading(false);
    }
  };

  const applyGiftCard = () => {
    if (!giftCardInfo) return;

    const currentAppliedAmount = appliedGiftCards.reduce(
      (sum, card) => sum + (card.amount || 0),
      0
    );
    const remainingOrderTotal = Math.max(0, orderTotal - currentAppliedAmount);
    const safeAmount = Math.min(amountToUse, giftCardInfo.remainingBalance, remainingOrderTotal);

    if (safeAmount <= 0) {
      setError('Betrag muss größer als 0 sein oder Bestellbetrag ist bereits gedeckt.');
      return;
    }

    onGiftCardApplied({
      id: giftCardInfo.id,
      type: 'GIFT_CARD',
      amount: safeAmount,
      remainingBalance: giftCardInfo.remainingBalance,
    });

    setGiftCardCode('');
    setGiftCardInfo(null);
    setAmountToUse(0);
    setError(null);
  };

  const handleAmountChange = e => {
    const value = parseFloat(e.target.value);
    const currentAppliedAmount = appliedGiftCards.reduce(
      (sum, card) => sum + (card.amount || 0),
      0
    );
    const remainingOrderTotal = Math.max(0, orderTotal - currentAppliedAmount);

    if (!isNaN(value) && value >= 0) {
      setAmountToUse(Math.min(value, giftCardInfo?.remainingBalance || 0, remainingOrderTotal));
      setUseFullAmount(false);
    } else if (e.target.value === '') {
      setAmountToUse(0);
      setUseFullAmount(false);
    }
  };

  const totalGiftCardAmount = appliedGiftCards.reduce((sum, card) => sum + (card.amount || 0), 0);
  const remainingToPay = Math.max(0, orderTotal - totalGiftCardAmount);

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <CardGiftcardIcon sx={{ mr: 1 }} />
        Geschenkkarten-Zahlung
      </Typography>

      {appliedGiftCards.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Angewendete Geschenkkarten:
          </Typography>

          {appliedGiftCards.map(card => (
            <Box
              key={card.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                mb: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                bgcolor: 'background.paper',
              }}
            >
              <Box>
                <Typography variant="body2" fontWeight="medium">
                  {`**** **** **** ${card.id.slice(-4)}`}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Restguthaben nach Zahlung: {(card.remainingBalance - card.amount).toFixed(2)} €
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  label={`${card.amount.toFixed(2)} €`}
                  color="primary"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onGiftCardRemoved(card.id)}
                  disabled={disabled}
                  aria-label={`Geschenkkarte ${card.id.slice(-4)} entfernen`}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          ))}

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 2,
              p: 1,
              bgcolor: 'primary.light',
              color: 'primary.contrastText',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Gesamtbetrag durch Geschenkkarten:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {totalGiftCardAmount.toFixed(2)} €
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
              p: 1,
              bgcolor: remainingToPay > 0 ? 'background.paper' : 'success.light',
              color: remainingToPay > 0 ? 'text.primary' : 'success.contrastText',
              borderRadius: 1,
              border: '1px solid',
              borderColor: remainingToPay > 0 ? 'divider' : 'success.main',
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Noch zu zahlen:
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {remainingToPay.toFixed(2)} €
            </Typography>
          </Box>
        </Box>
      )}

      {remainingToPay > 0 && !disabled && (
        <>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <TextField
                label="Geschenkkarten-Code"
                variant="outlined"
                fullWidth
                value={giftCardCode}
                onChange={handleGiftCardCodeChange}
                disabled={loading || disabled}
                placeholder="16-stelligen Code eingeben"
                InputProps={{
                  startAdornment: <CardGiftcardIcon color="action" sx={{ mr: 1, opacity: 0.6 }} />,
                }}
                sx={{ mr: 1 }}
                error={!!error && !giftCardInfo}
                helperText={error && !giftCardInfo ? error : ''}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={validateGiftCard}
                disabled={loading || !giftCardCode.trim() || disabled || !!giftCardInfo}
                sx={{ minWidth: 100, height: 56 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Prüfen'}
              </Button>
            </Box>

            {error && !giftCardInfo && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            <Collapse in={!!giftCardInfo && !error}>
              <Paper
                variant="outlined"
                sx={{
                  mt: 1,
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  border: '1px solid',
                  borderColor: 'primary.dark',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    Geschenkkarte gültig
                  </Typography>
                  <Chip
                    icon={<CheckCircleIcon sx={{ color: 'white !important' }} />}
                    label="Verfügbar"
                    sx={{ bgcolor: 'success.main', color: 'white' }}
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Verfügbares Guthaben:</strong>{' '}
                    {giftCardInfo?.remainingBalance.toFixed(2)} €
                  </Typography>
                  <Typography variant="body2">
                    <strong>Maximal anwendbar:</strong>{' '}
                    {Math.min(giftCardInfo?.remainingBalance || 0, remainingToPay).toFixed(2)} €
                  </Typography>
                </Box>

                <Divider sx={{ my: 1, borderColor: 'primary.light' }} />

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Zu verwendender Betrag:
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <TextField
                      variant="outlined"
                      type="number"
                      size="small"
                      value={amountToUse}
                      onChange={handleAmountChange}
                      InputProps={{
                        endAdornment: '€',
                        inputProps: {
                          min: 0,
                          max: Math.min(giftCardInfo?.remainingBalance || 0, remainingToPay),
                          step: '0.01',
                        },
                      }}
                      sx={{
                        flexGrow: 1,
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.15)',
                          '& fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&:hover fieldset': {
                            borderColor: 'primary.light',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'primary.light',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'primary.contrastText',
                        },
                        '& .MuiInputBase-input::-webkit-outer-spin-button, & .MuiInputBase-input::-webkit-inner-spin-button':
                          {
                            '-webkit-appearance': 'none',
                            margin: 0,
                          },
                        '& .MuiInputBase-input[type=number]': {
                          '-moz-appearance': 'textfield',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        setAmountToUse(Math.min(giftCardInfo.remainingBalance, remainingToPay));
                        setUseFullAmount(true);
                      }}
                      size="small"
                      disabled={!giftCardInfo}
                      sx={{ flexShrink: 0 }}
                    >
                      Max
                    </Button>
                  </Box>
                  {error && giftCardInfo && (
                    <Typography
                      color="error.light"
                      variant="caption"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {error}
                    </Typography>
                  )}
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={applyGiftCard}
                  sx={{ mt: 2 }}
                  startIcon={<ArrowForwardIcon />}
                  disabled={!giftCardInfo || amountToUse <= 0 || loading}
                >
                  {`Betrag von ${amountToUse.toFixed(2)} € anwenden`}
                </Button>
              </Paper>
            </Collapse>
          </Box>
        </>
      )}

      {remainingToPay <= 0 && appliedGiftCards.length > 0 && (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
          Der gesamte Bestellbetrag wurde durch Geschenkkarten abgedeckt.
        </Alert>
      )}

      {appliedGiftCards.length === 0 &&
        !giftCardInfo &&
        !error &&
        !loading &&
        remainingToPay > 0 &&
        !disabled && (
          <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 1 }}>
            Geben Sie einen Geschenkkarten-Code ein, um einen Teil oder den gesamten Betrag zu
            bezahlen.
          </Alert>
        )}
    </Paper>
  );
};

export default GiftCardPaymentSection;
