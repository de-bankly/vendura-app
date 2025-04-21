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
import GiftCardPaymentService from '../../services/GiftCardPaymentService';

/**
 * Komponente zur Verarbeitung von Geschenkkarten-Zahlungen im Kassensystem
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
  };

  const validateGiftCard = async () => {
    if (!giftCardCode.trim()) {
      setError('Bitte geben Sie einen Gutscheincode ein');
      return;
    }

    // Prüfen, ob das Format korrekt ist
    if (!GiftCardService.validateGiftCardFormat(giftCardCode)) {
      setError('Ungültiges Gutscheinformat. Gutscheincodes bestehen aus 16 Ziffern');
      return;
    }

    // Prüfen, ob die Geschenkkarte bereits verwendet wurde
    if (appliedGiftCards.some(card => card.id === giftCardCode)) {
      setError('Diese Geschenkkarte wurde bereits hinzugefügt');
      return;
    }

    setLoading(true);
    setError(null);
    setGiftCardInfo(null);

    try {
      // Geschenkkarten-Informationen abrufen
      const cardInfo = await GiftCardService.getTransactionalInformation(giftCardCode);

      // Nur Geschenkkarten akzeptieren (keine Rabattkarten)
      if (cardInfo.type !== 'GIFT_CARD') {
        setError('Nur Geschenkkarten können für Zahlungen verwendet werden');
        return;
      }

      // Prüfen, ob die Karte ein Guthaben hat
      if (!cardInfo.remainingBalance || cardInfo.remainingBalance <= 0) {
        setError('Diese Geschenkkarte hat kein Guthaben mehr');
        return;
      }

      // Ablaufdatum prüfen
      if (cardInfo.expirationDate && new Date(cardInfo.expirationDate) < new Date()) {
        setError('Diese Geschenkkarte ist abgelaufen');
        return;
      }

      setGiftCardInfo(cardInfo);

      // Standardmäßig den vollen verfügbaren Betrag verwenden (oder den Bestellwert, falls kleiner)
      const maxAmount = Math.min(cardInfo.remainingBalance, orderTotal);
      setAmountToUse(maxAmount);
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

    // Sicherstellen, dass der zu verwendende Betrag nicht höher ist als das Guthaben oder der Bestellwert
    const safeAmount = Math.min(amountToUse, giftCardInfo.remainingBalance, orderTotal);

    onGiftCardApplied({
      id: giftCardInfo.id,
      type: 'GIFT_CARD',
      amount: safeAmount,
      remainingBalance: giftCardInfo.remainingBalance,
    });

    // Formular zurücksetzen
    setGiftCardCode('');
    setGiftCardInfo(null);
  };

  const handleAmountChange = e => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      // Sicherstellen, dass der Wert nicht höher ist als das Guthaben oder der Bestellwert
      setAmountToUse(Math.min(value, giftCardInfo?.remainingBalance || 0, orderTotal));
    }
  };

  // Berechnung des Gesamtbetrags der angewendeten Geschenkkarten
  const totalGiftCardAmount = appliedGiftCards.reduce((sum, card) => sum + (card.amount || 0), 0);

  // Berechnung des noch zu zahlenden Betrags
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
                  {card.id}
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
            <Box sx={{ display: 'flex', mb: 1 }}>
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
              />
              <Button
                variant="contained"
                color="primary"
                onClick={validateGiftCard}
                disabled={loading || !giftCardCode.trim() || disabled}
                sx={{ minWidth: 100 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Prüfen'}
              </Button>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mt: 1 }}>
                {error}
              </Alert>
            )}

            <Collapse in={!!giftCardInfo && !error}>
              <Paper
                variant="outlined"
                sx={{
                  mt: 2,
                  p: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
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
                    icon={<CheckCircleIcon />}
                    label="Verfügbar"
                    color="success"
                    variant="filled"
                    size="small"
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Verfügbares Guthaben:</strong>{' '}
                    {giftCardInfo?.remainingBalance.toFixed(2)} €
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
                      }}
                      sx={{
                        width: '130px',
                        '& .MuiOutlinedInput-root': {
                          bgcolor: 'rgba(255, 255, 255, 0.2)',
                          '& fieldset': {
                            borderColor: 'primary.light',
                          },
                        },
                        '& .MuiInputBase-input': {
                          color: 'primary.contrastText',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() =>
                        setAmountToUse(
                          Math.min(giftCardInfo.remainingBalance, orderTotal - totalGiftCardAmount)
                        )
                      }
                      size="small"
                    >
                      Max
                    </Button>
                  </Box>
                </Box>

                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={applyGiftCard}
                  sx={{ mt: 2 }}
                  startIcon={<ArrowForwardIcon />}
                  disabled={!giftCardInfo || amountToUse <= 0}
                >
                  {`${amountToUse.toFixed(2)} € anwenden`}
                </Button>
              </Paper>
            </Collapse>
          </Box>
        </>
      )}

      {remainingToPay <= 0 && (
        <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mt: 2 }}>
          Der gesamte Bestellbetrag wurde durch Geschenkkarten abgedeckt.
        </Alert>
      )}

      {appliedGiftCards.length === 0 && !giftCardInfo && !error && !loading && (
        <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 1 }}>
          Geben Sie einen Geschenkkarten-Code ein, um einen Teil oder den gesamten Betrag zu
          bezahlen.
        </Alert>
      )}
    </Paper>
  );
};

export default GiftCardPaymentSection;
