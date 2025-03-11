import React, { useState, useCallback, useMemo } from 'react';
import { Box, Grid, Paper, Typography, Divider, Stack } from '../components/ui';
import {
  Button,
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
  Slide,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EuroIcon from '@mui/icons-material/Euro';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * SalesScreen component for the point-of-sale system
 * Displays products, cart, and payment options
 */
const SalesScreen = () => {
  // Sample product data - in a real app, this would come from an API
  const products = useMemo(
    () => [
      { id: 1, name: 'Kaffee', price: 2.5, category: 'Getränke' },
      { id: 2, name: 'Espresso', price: 1.8, category: 'Getränke' },
      { id: 3, name: 'Cappuccino', price: 3.2, category: 'Getränke' },
      { id: 4, name: 'Latte Macchiato', price: 3.5, category: 'Getränke' },
      { id: 5, name: 'Tee', price: 2.0, category: 'Getränke' },
      { id: 6, name: 'Croissant', price: 1.5, category: 'Gebäck' },
      { id: 7, name: 'Muffin', price: 2.0, category: 'Gebäck' },
      { id: 8, name: 'Bagel', price: 2.5, category: 'Gebäck' },
      { id: 9, name: 'Sandwich', price: 4.0, category: 'Snacks' },
      { id: 10, name: 'Salat', price: 5.5, category: 'Snacks' },
      { id: 11, name: 'Suppe', price: 4.5, category: 'Snacks' },
      { id: 12, name: 'Wasser', price: 1.0, category: 'Getränke' },
    ],
    []
  );

  // State for cart items
  const [cartItems, setCartItems] = useState([]);

  // State for payment modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');

  // State for success notification
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [receiptReady, setReceiptReady] = useState(false);

  // Add item to cart
  const addToCart = useCallback(product => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback(productId => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      } else {
        return prevItems.filter(item => item.id !== productId);
      }
    });
  }, []);

  // Delete item from cart
  const deleteFromCart = useCallback(productId => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate total
  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped = {};
    products.forEach(product => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [products]);

  // Handle payment modal open
  const handlePaymentModalOpen = useCallback(() => {
    setPaymentModalOpen(true);
    setCashReceived(total.toFixed(2));
  }, [total]);

  // Handle payment modal close
  const handlePaymentModalClose = useCallback(() => {
    setPaymentModalOpen(false);
  }, []);

  // Handle payment method change
  const handlePaymentMethodChange = useCallback(event => {
    setPaymentMethod(event.target.value);
  }, []);

  // Handle cash received change
  const handleCashReceivedChange = useCallback(event => {
    setCashReceived(event.target.value);
  }, []);

  // Calculate change
  const change = useMemo(() => {
    const received = parseFloat(cashReceived) || 0;
    return Math.max(0, received - total).toFixed(2);
  }, [cashReceived, total]);

  // Handle payment completion
  const handlePaymentComplete = useCallback(() => {
    setPaymentModalOpen(false);
    setSuccessSnackbarOpen(true);
    setReceiptReady(true);
    // In a real app, you would send the transaction to a backend
  }, []);

  // Handle print receipt
  const handlePrintReceipt = useCallback(() => {
    // In a real app, this would trigger receipt printing
    console.log('Printing receipt for items:', cartItems);
    alert('Rechnung wird gedruckt...');
  }, [cartItems]);

  // Handle snackbar close
  const handleSnackbarClose = useCallback(() => {
    setSuccessSnackbarOpen(false);
  }, []);

  // Handle new transaction
  const handleNewTransaction = useCallback(() => {
    clearCart();
    setReceiptReady(false);
  }, [clearCart]);

  return (
    <Box sx={{ p: 2, height: '100%' }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verkaufsbildschirm
      </Typography>

      <Grid container spacing={3} sx={{ height: 'calc(100% - 60px)' }}>
        {/* Product selection area */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              overflow: 'auto',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h5" gutterBottom>
              Produkte
            </Typography>

            {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    pb: 0.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  {category}
                </Typography>

                <Grid container spacing={2}>
                  {categoryProducts.map(product => (
                    <Grid item xs={6} sm={4} md={3} key={product.id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: 4,
                          },
                          cursor: 'pointer',
                        }}
                        onClick={() => addToCart(product)}
                      >
                        <Typography variant="subtitle1" component="div" fontWeight="medium">
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.price.toFixed(2)} €
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Cart area */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={3}
            sx={{
              p: 2,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCartIcon sx={{ mr: 1 }} />
              <Typography variant="h5">Warenkorb</Typography>
              {cartItems.length > 0 && (
                <Chip
                  label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                  color="primary"
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>

            <Divider sx={{ mb: 2 }} />

            {/* Cart items */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {cartItems.length === 0 ? (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textAlign: 'center', mt: 4 }}
                >
                  Der Warenkorb ist leer
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {cartItems.map(item => (
                    <Paper key={item.id} variant="outlined" sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">{item.name}</Typography>
                        <Typography variant="subtitle1">
                          {(item.price * item.quantity).toFixed(2)} €
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          {item.price.toFixed(2)} € × {item.quantity}
                        </Typography>

                        <Box>
                          <Button
                            size="small"
                            onClick={() => removeFromCart(item.id)}
                            sx={{ minWidth: '32px', p: 0.5 }}
                          >
                            <RemoveIcon fontSize="small" />
                          </Button>

                          <Button
                            size="small"
                            onClick={() => addToCart(item)}
                            sx={{ minWidth: '32px', p: 0.5 }}
                          >
                            <AddIcon fontSize="small" />
                          </Button>

                          <Button
                            size="small"
                            color="error"
                            onClick={() => deleteFromCart(item.id)}
                            sx={{ minWidth: '32px', p: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Box>

            {/* Cart summary */}
            <Box>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Gesamtsumme:</Typography>
                <Typography variant="h6">{total.toFixed(2)} €</Typography>
              </Box>

              {receiptReady ? (
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    color="success"
                    fullWidth
                    startIcon={<ReceiptIcon />}
                    onClick={handlePrintReceipt}
                  >
                    Rechnung drucken
                  </Button>

                  <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    startIcon={<ShoppingCartIcon />}
                    onClick={handleNewTransaction}
                  >
                    Neuer Verkauf
                  </Button>
                </Stack>
              ) : (
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    startIcon={<DeleteIcon />}
                    onClick={clearCart}
                    disabled={cartItems.length === 0}
                  >
                    Leeren
                  </Button>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<PaymentIcon />}
                    onClick={handlePaymentModalOpen}
                    disabled={cartItems.length === 0}
                  >
                    Bezahlen
                  </Button>
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Payment Modal */}
      <Dialog
        open={paymentModalOpen}
        onClose={handlePaymentModalClose}
        TransitionComponent={Transition}
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
              {cartItems.length} {cartItems.length === 1 ? 'Artikel' : 'Artikel'} im Warenkorb
            </Typography>
          </Box>

          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Zahlungsmethode
            </Typography>

            <RadioGroup
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
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
                onChange={handleCashReceivedChange}
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
                  <strong>Verwendungszweck:</strong> Rechnung{' '}
                  {new Date().toISOString().slice(0, 10)}-{Math.floor(Math.random() * 1000)}
                </Typography>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handlePaymentModalClose} color="inherit">
            Abbrechen
          </Button>
          <Button
            onClick={handlePaymentComplete}
            variant="contained"
            color="primary"
            startIcon={<CheckCircleIcon />}
          >
            Zahlung abschließen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Zahlung erfolgreich abgeschlossen!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SalesScreen;
