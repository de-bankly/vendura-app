import { useState, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Stack,
} from '../components/ui';
import { Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';

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

  // Add item to cart
  const addToCart = useCallback((product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevItems.filter((item) => item.id !== productId);
      }
    });
  }, []);

  // Delete item from cart
  const deleteFromCart = useCallback((productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  }, []);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calculate total
  const total = useMemo(() => {
    return cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  // Group products by category
  const productsByCategory = useMemo(() => {
    const grouped = {};
    products.forEach((product) => {
      if (!grouped[product.category]) {
        grouped[product.category] = [];
      }
      grouped[product.category].push(product);
    });
    return grouped;
  }, [products]);

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
              bgcolor: 'background.paper' 
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
                    borderColor: 'divider' 
                  }}
                >
                  {category}
                </Typography>
                
                <Grid container spacing={2}>
                  {categoryProducts.map((product) => (
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
              bgcolor: 'background.paper' 
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCartIcon sx={{ mr: 1 }} />
              <Typography variant="h5">
                Warenkorb
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            {/* Cart items */}
            <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
              {cartItems.length === 0 ? (
                <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
                  Der Warenkorb ist leer
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {cartItems.map((item) => (
                    <Paper 
                      key={item.id} 
                      variant="outlined" 
                      sx={{ p: 1.5 }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1">
                          {item.name}
                        </Typography>
                        <Typography variant="subtitle1">
                          {(item.price * item.quantity).toFixed(2)} €
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  disabled={cartItems.length === 0}
                >
                  Bezahlen
                </Button>
              </Stack>
              
              <Button 
                variant="outlined" 
                color="secondary" 
                fullWidth
                startIcon={<ReceiptIcon />}
                sx={{ mt: 2 }}
                disabled={cartItems.length === 0}
              >
                Rechnung drucken
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SalesScreen; 