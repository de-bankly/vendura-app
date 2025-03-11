import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  InputAdornment,
  Box,
  Paper,
  Typography,
  Button,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EuroIcon from '@mui/icons-material/Euro';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/**
 * PaymentDialog component for processing payments
 */
const PaymentDialog = ({
  open,
  onClose,
  onComplete,
  total,
  cartItemsCount,
  voucherDiscount,
  paymentMethod,
  onPaymentMethodChange,
  cashReceived,
  onCashReceivedChange,
  change,
  TransitionComponent,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionComponent}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PaymentIcon sx={{ mr: 1 }} />
          Zahlung abschließen
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Gesamtbetrag: {total.toFixed(2)} €
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {cartItemsCount} {cartItemsCount === 1 ? 'Artikel' : 'Artikel'} im Warenkorb
          </Typography>

          {voucherDiscount > 0 && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1 }}>
              Gutschein-Rabatt: {voucherDiscount.toFixed(2)} €
            </Typography>
          )}
        </Box>

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Zahlungsmethode
          </Typography>

          <RadioGroup name="payment-method" value={paymentMethod} onChange={onPaymentMethodChange}>
            <Paper variant="outlined" sx={{ mb: 1, p: 1 }}>
              <FormControlLabel
                value="cash"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocalAtmIcon sx={{ mr: 1 }} />
                    <Typography>Bargeld</Typography>
                  </Box>
                }
              />
            </Paper>

            <Paper variant="outlined" sx={{ mb: 1, p: 1 }}>
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CreditCardIcon sx={{ mr: 1 }} />
                    <Typography>Kartenzahlung</Typography>
                  </Box>
                }
              />
            </Paper>

            <Paper variant="outlined" sx={{ p: 1 }}>
              <FormControlLabel
                value="bank"
                control={<Radio />}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceIcon sx={{ mr: 1 }} />
                    <Typography>Überweisung</Typography>
                  </Box>
                }
              />
            </Paper>
          </RadioGroup>
        </FormControl>

        {paymentMethod === 'cash' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Bargeld
            </Typography>

            <TextField
              label="Erhaltener Betrag"
              variant="outlined"
              fullWidth
              value={cashReceived}
              onChange={onCashReceivedChange}
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EuroIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                bgcolor: 'background.default',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="subtitle1">Rückgeld:</Typography>
              <Typography variant="h6" color="primary.main">
                {change} €
              </Typography>
            </Paper>
          </Box>
        )}

        {paymentMethod === 'card' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Bitte führen Sie die Karte in das Lesegerät ein oder halten Sie sie an das Terminal.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 3,
                border: '1px dashed',
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <CreditCardIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.7 }} />
            </Box>
          </Box>
        )}

        {paymentMethod === 'bank' && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" gutterBottom>
              Bitte überweisen Sie den Betrag auf folgendes Konto:
            </Typography>

            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
              <Typography variant="body2" gutterBottom>
                <strong>Kontoinhaber:</strong> Vendura GmbH
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>IBAN:</strong> DE12 3456 7890 1234 5678 90
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>BIC:</strong> DEUTDEDBXXX
              </Typography>
              <Typography variant="body2">
                <strong>Verwendungszweck:</strong> Rechnung {new Date().toISOString().slice(0, 10)}-
                {Math.floor(Math.random() * 1000)}
              </Typography>
            </Paper>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} color="inherit">
          Abbrechen
        </Button>
        <Button
          onClick={onComplete}
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
        >
          Zahlung abschließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
