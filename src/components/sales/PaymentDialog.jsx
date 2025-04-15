import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EuroIcon from '@mui/icons-material/Euro';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import PaymentIcon from '@mui/icons-material/Payment';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio as MuiRadio,
  InputAdornment,
  Box,
  Paper,
  Typography,
  Button,
  useTheme,
  Divider,
  Zoom,
} from '@mui/material';
import React from 'react';

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
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={TransitionComponent}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 5,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ mr: 1.5, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="bold">
              Zahlung abschließen
            </Typography>
          </Box>
          <Button color="inherit" onClick={onClose} sx={{ minWidth: 'auto', p: 1 }}>
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        <Box
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.primary.main + '15',
            border: `1px solid ${theme.palette.primary.light}`,
          }}
        >
          <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
            {total.toFixed(2)} €
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {cartItemsCount} Artikel im Warenkorb
          </Typography>

          {voucherDiscount > 0 && (
            <Typography variant="body2" color="error.main" sx={{ mt: 1, fontWeight: 'medium' }}>
              Gutschein-Rabatt: {voucherDiscount.toFixed(2)} €
            </Typography>
          )}
        </Box>

        <Typography variant="h6" gutterBottom fontWeight="medium" color="primary.main">
          Zahlungsmethode
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
          <RadioGroup name="payment-method" value={paymentMethod} onChange={onPaymentMethodChange}>
            <Paper
              variant="outlined"
              sx={{
                mb: 1.5,
                borderRadius: 1.5,
                borderColor:
                  paymentMethod === 'cash' ? theme.palette.primary.main : theme.palette.divider,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: 1,
                },
              }}
            >
              <FormControlLabel
                value="cash"
                control={
                  <MuiRadio
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                    <LocalAtmIcon sx={{ mr: 1.5, color: theme.palette.success.main }} />
                    <Typography fontWeight={paymentMethod === 'cash' ? 'medium' : 'normal'}>
                      Bargeld
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0, p: 1 }}
              />
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                mb: 1.5,
                borderRadius: 1.5,
                borderColor:
                  paymentMethod === 'card' ? theme.palette.primary.main : theme.palette.divider,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: 1,
                },
              }}
            >
              <FormControlLabel
                value="card"
                control={
                  <MuiRadio
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                    <CreditCardIcon sx={{ mr: 1.5, color: theme.palette.info.main }} />
                    <Typography fontWeight={paymentMethod === 'card' ? 'medium' : 'normal'}>
                      Kartenzahlung
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0, p: 1 }}
              />
            </Paper>

            <Paper
              variant="outlined"
              sx={{
                borderRadius: 1.5,
                borderColor:
                  paymentMethod === 'bank' ? theme.palette.primary.main : theme.palette.divider,
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: 1,
                },
              }}
            >
              <FormControlLabel
                value="bank"
                control={
                  <MuiRadio
                    sx={{
                      color: theme.palette.primary.main,
                      '&.Mui-checked': {
                        color: theme.palette.primary.main,
                      },
                    }}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', py: 0.5 }}>
                    <AccountBalanceIcon sx={{ mr: 1.5, color: theme.palette.warning.main }} />
                    <Typography fontWeight={paymentMethod === 'bank' ? 'medium' : 'normal'}>
                      Überweisung
                    </Typography>
                  </Box>
                }
                sx={{ width: '100%', m: 0, p: 1 }}
              />
            </Paper>
          </RadioGroup>
        </FormControl>

        <Divider sx={{ my: 2 }} />

        {paymentMethod === 'cash' && (
          <Zoom in={paymentMethod === 'cash'} style={{ transitionDelay: '100ms' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium" color="primary.main">
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
                      <EuroIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: theme.palette.success.light + '20',
                  borderRadius: 1.5,
                  borderColor: theme.palette.success.light,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant="subtitle1" fontWeight="medium">
                  Rückgeld:
                </Typography>
                <Typography variant="h6" color="success.main" fontWeight="bold">
                  {change} €
                </Typography>
              </Paper>
            </Box>
          </Zoom>
        )}

        {paymentMethod === 'card' && (
          <Zoom in={paymentMethod === 'card'} style={{ transitionDelay: '100ms' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium" color="primary.main">
                Kartenzahlung
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                Bitte führen Sie die Karte in das Lesegerät ein oder halten Sie sie an das Terminal.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 4,
                  border: '2px dashed',
                  borderColor: theme.palette.info.light,
                  borderRadius: 2,
                  bgcolor: theme.palette.info.light + '10',
                }}
              >
                <CreditCardIcon
                  sx={{ fontSize: 80, color: theme.palette.info.main, opacity: 0.8 }}
                />
              </Box>
            </Box>
          </Zoom>
        )}

        {paymentMethod === 'bank' && (
          <Zoom in={paymentMethod === 'bank'} style={{ transitionDelay: '100ms' }}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium" color="primary.main">
                Überweisung
              </Typography>

              <Typography variant="body1" gutterBottom>
                Bitte überweisen Sie den Betrag auf folgendes Konto:
              </Typography>

              <Paper
                variant="outlined"
                sx={{
                  p: 2.5,
                  bgcolor: theme.palette.warning.light + '10',
                  borderRadius: 1.5,
                  borderColor: theme.palette.warning.light,
                }}
              >
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
                  <strong>Verwendungszweck:</strong> Rechnung{' '}
                  {new Date().toISOString().slice(0, 10)}-{Math.floor(Math.random() * 1000)}
                </Typography>
              </Paper>
            </Box>
          </Zoom>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5, bgcolor: theme.palette.background.default }}>
        <Button onClick={onClose} color="inherit" variant="outlined" startIcon={<CloseIcon />}>
          Abbrechen
        </Button>
        <Button
          onClick={onComplete}
          variant="contained"
          color="primary"
          startIcon={<CheckCircleIcon />}
          sx={{
            px: 3,
            py: 1,
            boxShadow: 2,
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          Zahlung abschließen
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
