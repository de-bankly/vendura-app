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
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import EuroIcon from '@mui/icons-material/Euro';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { issueVoucher } from '../../utils/voucherUtils';

/**
 * Dialog component for purchasing vouchers
 */
const PurchaseVoucherDialog = ({ open, onClose, onAddToCart }) => {
  const [voucherValue, setVoucherValue] = useState('');
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Predefined voucher values
  const predefinedValues = [10, 20, 25, 50, 100];

  // Handle voucher value change
  const handleVoucherValueChange = event => {
    const value = event.target.value;
    if (value === '' || (/^\d*\.?\d{0,2}$/.test(value) && parseFloat(value) >= 0)) {
      setVoucherValue(value);
    }
    setError(null);
  };

  // Handle predefined value selection
  const handlePredefinedValue = value => {
    setVoucherValue(value.toString());
  };

  // Handle expiry date change
  const handleExpiryDateChange = event => {
    setExpiryDate(event.target.value);
  };

  // Handle quantity change
  const handleQuantityChange = event => {
    setQuantity(event.target.value);
  };

  // Handle add to cart
  const handleAddToCart = () => {
    if (!voucherValue || parseFloat(voucherValue) <= 0) {
      setError('Bitte geben Sie einen gültigen Gutscheinwert ein');
      return;
    }

    const voucherProduct = {
      id: `voucher-${Date.now()}`,
      name: `Gutschein ${parseFloat(voucherValue).toFixed(2)} €`,
      price: parseFloat(voucherValue),
      quantity: quantity,
      isVoucher: true,
      expiryDate: expiryDate,
    };

    onAddToCart(voucherProduct);
    handleClose();
  };

  // Handle dialog close
  const handleClose = () => {
    setVoucherValue('');
    setExpiryDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setQuantity(1);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CardGiftcardIcon sx={{ mr: 1 }} />
          Gutschein kaufen
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="subtitle1" gutterBottom>
          Wählen Sie einen Gutscheinwert:
        </Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {predefinedValues.map(value => (
            <Button
              key={value}
              variant={voucherValue === value.toString() ? 'contained' : 'outlined'}
              onClick={() => handlePredefinedValue(value)}
              sx={{ minWidth: '80px' }}
            >
              {value} €
            </Button>
          ))}
        </Box>

        <TextField
          label="Gutscheinwert"
          variant="outlined"
          fullWidth
          value={voucherValue}
          onChange={handleVoucherValueChange}
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
          sx={{ mb: 3 }}
        />

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="quantity-label">Anzahl</InputLabel>
          <Select
            labelId="quantity-label"
            value={quantity}
            label="Anzahl"
            onChange={handleQuantityChange}
          >
            {[1, 2, 3, 4, 5, 10].map(num => (
              <MenuItem key={num} value={num}>
                {num}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.default' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Gutscheinwert:</Typography>
            <Typography variant="body1">
              {voucherValue ? `${parseFloat(voucherValue).toFixed(2)} €` : '0.00 €'}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Anzahl:</Typography>
            <Typography variant="body1">{quantity}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Gesamtbetrag:
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              {voucherValue ? `${(parseFloat(voucherValue) * quantity).toFixed(2)} €` : '0.00 €'}
            </Typography>
          </Box>
        </Paper>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Der Gutschein wird nach dem Bezahlvorgang ausgestellt und kann ausgedruckt oder digital
          übermittelt werden.
        </Typography>

        <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
          Hinweis: Gutscheine können auch teilweise eingelöst werden. Das Restguthaben bleibt
          erhalten.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} color="inherit">
          Abbrechen
        </Button>
        <Button
          onClick={handleAddToCart}
          variant="contained"
          color="primary"
          startIcon={<ShoppingCartIcon />}
          disabled={!voucherValue || parseFloat(voucherValue) <= 0}
        >
          In den Warenkorb
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PurchaseVoucherDialog;
