import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import InventoryIcon from '@mui/icons-material/Inventory';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Paper,
  Alert as MuiAlert,
  CardContent,
  Slide,
  Snackbar,
  useTheme,
  alpha,
  Container,
  Card,
  IconButton,
  Tooltip,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useCallback, useMemo, useEffect } from 'react';

import { useToast, Chip } from '../components/ui/feedback';
import { ProductGrid, ShoppingCart, PaymentDialog } from '../components/sales';
import {
  RedeemVoucherDialog,
  VoucherManagementDialog,
  PurchaseVoucherDialog,
} from '../components/vouchers';
import { RedeemDepositDialog } from '../components/deposit';
import { ProductService, CartService } from '../services';
import { getUserFriendlyErrorMessage } from '../utils/errorUtils';

// Transition for dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
Transition.displayName = 'Transition';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * SalesScreen component for the point-of-sale system
 * Displays products, cart, and payment options
 */
const SalesScreen = () => {
  const theme = useTheme();
  const { showToast } = useToast();

  // --- State Declarations ---
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // For initial product load
  const [error, setError] = useState(null); // For product load error
  const [productsByCategory, setProductsByCategory] = useState({});
  const [cartItems, setCartItems] = useState([]);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cashReceived, setCashReceived] = useState('');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expirationDate: '',
    cvv: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false); // Loading state for payment submission
  const [receiptReady, setReceiptReady] = useState(false);
  const [redeemVoucherDialogOpen, setRedeemVoucherDialogOpen] = useState(false);
  const [voucherManagementDialogOpen, setVoucherManagementDialogOpen] = useState(false);
  const [purchaseVoucherDialogOpen, setPurchaseVoucherDialogOpen] = useState(false);
  const [appliedVouchers, setAppliedVouchers] = useState([]);
  const [appliedDeposits, setAppliedDeposits] = useState([]);
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [giftCardPayment, setGiftCardPayment] = useState(0);
  const [cartUndoEnabled, setCartUndoEnabled] = useState(false);
  const [cartRedoEnabled, setCartRedoEnabled] = useState(false);
  const [depositCredit, setDepositCredit] = useState(0);
  const [redeemDepositDialogOpen, setRedeemDepositDialogOpen] = useState(false);

  // --- Data Fetching ---
  useEffect(() => {
    let isMounted = true; // Prevent state update on unmounted component
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null); // Clear previous errors
        const productData = await ProductService.getProducts({ page: 0, size: 100 }); // Consider pagination/infinite load
        if (isMounted) {
          // Filter products to only include those with stock quantity > 0
          const products = (productData.content || []).filter(product => product.stockQuantity > 0);
          setProducts(products);
          const groupedProducts = ProductService.groupByCategory(products);
          setProductsByCategory(groupedProducts);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching products:', err);
          // Use error message from service if available
          setError(err.message || 'Fehler beim Laden der Produkte.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    }; // Cleanup function
  }, []);

  // --- Memoized Calculations ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);
  }, [cartItems]);

  // Calculate product discount
  const productDiscount = useMemo(() => CartService.calculateTotalDiscount(cartItems), [cartItems]);

  // Calculate voucher discount
  const calculateVoucherDiscount = useCallback((subtotal, vouchers) => {
    if (!vouchers || vouchers.length === 0) return 0;

    // Get discount vouchers
    const discountVouchers = vouchers.filter(v => v.type === 'DISCOUNT_CARD');
    if (discountVouchers.length === 0) return 0;

    // For simplicity, we'll just use the first discount voucher
    // In a real implementation, you might want to stack discounts or use the highest one
    const discountVoucher = discountVouchers[0];
    const discountPercentage = parseFloat(discountVoucher.discountPercentage) || 0;

    // Calculate the actual discount amount, ensuring it's a valid number
    return subtotal * (discountPercentage / 100);
  }, []);

  // Calculate gift card payment
  const calculateGiftCardPayment = useCallback((afterDiscountTotal, vouchers) => {
    if (!vouchers || vouchers.length === 0) return 0;

    // Get gift card vouchers
    const giftCardVouchers = vouchers.filter(v => v.type === 'GIFT_CARD');
    if (giftCardVouchers.length === 0) return 0;

    // We now sum up the pre-specified amounts for each gift card
    let totalGiftCardPayment = 0;

    for (const voucher of giftCardVouchers) {
      // Only add gift cards with a specified amount
      const voucherAmount = parseFloat(voucher.amount) || 0;
      if (voucherAmount > 0) {
        totalGiftCardPayment += voucherAmount;
      }
    }

    // Make sure the total doesn't exceed the amount due
    return Math.min(totalGiftCardPayment, afterDiscountTotal);
  }, []);

  useEffect(() => {
    const calculatedDiscount = calculateVoucherDiscount(subtotal, appliedVouchers);
    setVoucherDiscount(calculatedDiscount);

    const afterDiscountTotal = subtotal - calculatedDiscount;
    const calculatedGiftCardPayment = calculateGiftCardPayment(afterDiscountTotal, appliedVouchers);
    setDepositCredit(calculatedGiftCardPayment);
  }, [subtotal, appliedVouchers, calculateVoucherDiscount, calculateGiftCardPayment]);

  const total = useMemo(() => {
    let calculatedTotal = subtotal - voucherDiscount - depositCredit;
    return calculatedTotal > 0 ? calculatedTotal : 0;
  }, [subtotal, voucherDiscount, depositCredit]);

  // Calculate change for cash payment
  const change = useMemo(() => {
    if (paymentMethod !== 'cash' || !cashReceived) {
      return 0;
    }
    const cashValue = parseFloat(cashReceived);
    return cashValue > total ? cashValue - total : 0;
  }, [paymentMethod, cashReceived, total]);

  // Replace the useEffect that monitors undo/redo availability
  useEffect(() => {
    // Check if undo/redo is available
    setCartUndoEnabled(CartService.canUndoCartState());
    setCartRedoEnabled(CartService.canRedoCartState());

    // Set up interval to periodically check if service is loaded
    const checkInterval = setInterval(() => {
      setCartUndoEnabled(CartService.canUndoCartState());
      setCartRedoEnabled(CartService.canRedoCartState());
    }, 500);

    return () => clearInterval(checkInterval);
  }, [cartItems, appliedVouchers]);

  // Replace the undo handler
  const handleUndoCartState = useCallback(async () => {
    try {
      const result = await CartService.undoCartState();
      if (result) {
        setCartItems(result.cartItems);
        setAppliedVouchers(result.appliedVouchers || []);
      }
    } catch (err) {
      console.error('Failed to undo cart state:', err);
    }
  }, []);

  // Replace the redo handler
  const handleRedoCartState = useCallback(async () => {
    try {
      const result = await CartService.redoCartState();
      if (result) {
        setCartItems(result.cartItems);
        setAppliedVouchers(result.appliedVouchers || []);
      }
    } catch (err) {
      console.error('Failed to redo cart state:', err);
    }
  }, []);

  // Modify the addToCart function to handle async operations
  const addToCart = useCallback(
    product => {
      // Update UI immediately
      const updatedItems = CartService.addToCart([...cartItems], product);
      setCartItems(updatedItems);

      // Save state in background
      CartService.saveCartState(updatedItems, appliedVouchers).catch(err => {
        console.error('Failed to save cart state after adding item:', err);
      });
    },
    [cartItems, appliedVouchers]
  );

  // Modify the removeFromCart function to handle async operations
  const removeFromCart = useCallback(
    productId => {
      // Update UI immediately
      const updatedItems = CartService.removeFromCart([...cartItems], productId);
      setCartItems(updatedItems);

      // Save state in background
      CartService.saveCartState(updatedItems, appliedVouchers).catch(err => {
        console.error('Failed to save cart state after removing item:', err);
      });
    },
    [cartItems, appliedVouchers]
  );

  // Modify the deleteFromCart function to handle async operations
  const deleteFromCart = useCallback(
    productId => {
      // Update UI immediately
      const updatedItems = CartService.deleteFromCart([...cartItems], productId);
      setCartItems(updatedItems);

      // Save state in background
      CartService.saveCartState(updatedItems, appliedVouchers).catch(err => {
        console.error('Failed to save cart state after deleting item:', err);
      });
    },
    [cartItems, appliedVouchers]
  );

  // Modify the clearCart function to handle async operations
  const clearCart = useCallback(() => {
    // Update UI immediately
    setCartItems([]);
    setAppliedVouchers([]);
    setAppliedDeposits([]);
    setVoucherDiscount(0);
    setDepositCredit(0);
    setCardDetails({
      cardNumber: '',
      cardHolderName: '',
      expirationDate: '',
      cvv: '',
    });

    // Clear cart history in background
    CartService.clearCartHistory().catch(err => {
      console.error('Failed to clear cart history:', err);
    });
  }, []);

  // Modify the handleApplyVoucher function to handle async operations
  const handleApplyVoucher = useCallback(
    voucher => {
      // Update UI immediately
      const updatedVouchers = [...appliedVouchers, voucher];
      setAppliedVouchers(updatedVouchers);

      // Save state in background with a label
      CartService.saveCartState(cartItems, updatedVouchers, 'Applied voucher').catch(err => {
        console.error('Failed to save cart state after applying voucher:', err);
      });
    },
    [cartItems, appliedVouchers]
  );

  // Modify the handleRemoveVoucher function to handle async operations
  const handleRemoveVoucher = useCallback(
    voucherId => {
      // Update UI immediately
      const updatedVouchers = appliedVouchers.filter(v => v.id !== voucherId);
      setAppliedVouchers(updatedVouchers);

      // Save state in background with a label
      CartService.saveCartState(cartItems, updatedVouchers, 'Removed voucher').catch(err => {
        console.error('Failed to save cart state after removing voucher:', err);
      });
    },
    [cartItems, appliedVouchers]
  );

  // --- Callback Handlers ---
  const handlePaymentModalOpen = useCallback(() => {
    setPaymentModalOpen(true);
    setCashReceived(total.toFixed(2));
  }, [total]);

  const handlePaymentModalClose = useCallback(() => {
    setPaymentModalOpen(false);
  }, []);

  const handlePaymentMethodChange = useCallback(event => {
    setPaymentMethod(event.target.value);
  }, []);

  const handleCashReceivedChange = useCallback(event => {
    setCashReceived(event.target.value);
  }, []);

  const handleCardDetailsChange = useCallback((field, value) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePaymentSubmit = useCallback(async () => {
    setPaymentLoading(true); // Indicate loading
    try {
      // Round the total for payment processing
      const roundedTotal = Math.round(total * 100) / 100;

      // Prepare transaction data for the backend
      const transactionData = {
        cartItems: cartItems.map(item => ({
          id: item.id,
          quantity: item.quantity,
          price: Math.round(item.price * 100) / 100,
          discount: item.discount || 0,
        })),
        paymentMethod: paymentMethod,
        total: roundedTotal,
        subtotal: Math.round(subtotal * 100) / 100,
        appliedVouchers: appliedVouchers,
        voucherDiscount: Math.round(voucherDiscount * 100) / 100,
        depositReceipts: appliedDeposits,
        depositCredit: Math.round(depositCredit * 100) / 100,
        // Include additional payment details based on payment method
        cashReceived: paymentMethod === 'cash' ? parseFloat(cashReceived) : 0,
        change: paymentMethod === 'cash' ? parseFloat(cashReceived) - roundedTotal : 0,
        cardDetails:
          paymentMethod === 'card'
            ? {
                ...cardDetails,
                cardNumber: cardDetails.cardNumber.replace(/\s/g, ''),
              }
            : null,
      };

      // Submit transaction to backend
      // Backend will handle deposit receipt redemption as part of the transaction
      const response = await TransactionService.createSaleTransaction(transactionData);

      // Show success message
      showToast({
        message: 'Zahlung erfolgreich',
        severity: 'success',
      });

      // Update UI to show receipt
      setReceiptReady(true);
      setPaymentModalOpen(false);

      // Set success snackbar to open
      setSuccessSnackbarOpen(true);
    } catch (error) {
      console.error('Payment error:', error);
      showToast({
        message: getUserFriendlyErrorMessage(error, 'Zahlungsfehler'),
        severity: 'error',
      });
    } finally {
      setPaymentLoading(false);
    }
  }, [
    cartItems,
    total,
    subtotal,
    paymentMethod,
    cashReceived,
    cardDetails,
    showToast,
    appliedVouchers,
    voucherDiscount,
    appliedDeposits,
    depositCredit,
  ]);

  const handlePrintReceipt = useCallback(() => {
    alert('Rechnung wird gedruckt...'); // Placeholder
  }, []);

  const handleSnackbarClose = useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccessSnackbarOpen(false);
  }, []);

  const handleNewTransaction = useCallback(() => {
    clearCart();
    setReceiptReady(false);
    setPaymentMethod('cash');
    setCashReceived('');
    setError(null); // Clear any previous product load errors
    // Potentially refetch products if needed
  }, [clearCart]);

  const handleRedeemVoucherDialog = () => {
    setRedeemVoucherDialogOpen(true);
  };

  const handleRedeemVoucherDialogClose = useCallback(() => {
    setRedeemVoucherDialogOpen(false);
  }, []);

  const handleVoucherManagementDialog = () => {
    setVoucherManagementDialogOpen(true);
  };

  const handleVoucherManagementDialogClose = useCallback(() => {
    setVoucherManagementDialogOpen(false);
  }, []);

  const handlePurchaseVoucherDialog = () => {
    setPurchaseVoucherDialogOpen(true);
  };

  const handlePurchaseVoucherDialogClose = useCallback(() => {
    setPurchaseVoucherDialogOpen(false);
  }, []);

  const handleVoucherApplied = useCallback(
    voucherData => {
      setAppliedVouchers(prev => [...prev, voucherData]);
      showToast({ severity: 'success', message: 'Gutschein erfolgreich angewendet!' });
    },
    [showToast]
  );

  // Deposit handlers
  const handleRedeemDepositDialogOpen = useCallback(() => {
    setRedeemDepositDialogOpen(true);
  }, []);

  const handleRedeemDepositDialogClose = useCallback(() => {
    setRedeemDepositDialogOpen(false);
  }, []);

  const handleDepositRedeemed = useCallback(
    depositReceipt => {
      // Check if this deposit receipt has already been applied
      const isAlreadyApplied = appliedDeposits.some(deposit => deposit.id === depositReceipt.id);

      if (isAlreadyApplied) {
        // Close the dialog
        setRedeemDepositDialogOpen(false);

        // Show error message
        showToast({
          message: 'Dieser Pfandbeleg wurde bereits angewendet',
          severity: 'error',
        });
        return;
      }

      // Add the deposit receipt to applied deposits
      setAppliedDeposits(prev => [...prev, depositReceipt]);

      // Update the deposit credit amount
      setDepositCredit(prev => prev + depositReceipt.value);

      // Close the dialog
      setRedeemDepositDialogOpen(false);

      // Show success message
      showToast({
        message: `Pfandbeleg im Wert von ${depositReceipt.value.toFixed(2)} € zum Warenkorb hinzugefügt`,
        severity: 'success',
      });
    },
    [showToast, appliedDeposits]
  );

  // --- Render Logic ---
  return (
    <Box
      sx={{
        height: '100%', // Consider using calc(100vh - AppBarHeight) if needed
        background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${alpha(
          theme.palette.primary.light,
          0.1
        )} 100%)`,
        overflow: 'hidden', // Prevent outer scroll, inner components should scroll
        display: 'flex',
        flexDirection: 'column',
        pt: 2, // Add padding top
      }}
    >
      <Container maxWidth="xl" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Page Header */}
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
                pb: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.6)}`,
              }}
            >
              <PointOfSaleIcon
                sx={{
                  fontSize: 40,
                  mr: 2,
                  color: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  p: 1,
                  borderRadius: theme.shape.borderRadius,
                }}
              />
              <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
                Verkaufsbildschirm
              </Typography>
            </Box>
          </motion.div>

          {/* Sales Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {/* Cart Summary Card */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Warenkorb</Typography>
                      <Chip
                        size="small"
                        icon={<ShoppingCartIcon fontSize="small" />}
                        label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        color="primary"
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}
                    >
                      {(parseFloat(total) || 0).toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cartItems.length} Artikel
                      {cartItems.length !== 1 ? '' : ''} {/* Adjust grammar if needed */}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Product Summary Card */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Produkte</Typography>
                      <Chip
                        size="small"
                        icon={<InventoryIcon fontSize="small" />}
                        label={products.length}
                        color="success"
                      />
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      {Object.keys(productsByCategory).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Kategorien
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Voucher Summary Card */}
            <Grid item xs={12} sm={6} md={4}>
              <motion.div variants={itemVariants}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Gutscheine</Typography>
                      <Chip
                        size="small"
                        icon={<CardGiftcardIcon fontSize="small" />}
                        label={appliedVouchers.length}
                        color="info"
                      />
                    </Box>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, mb: 1, wordBreak: 'break-word' }}
                    >
                      {voucherDiscount.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                      })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rabatt angewendet
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, overflow: 'hidden', mb: 2 }}>
          {' '}
          {/* Allow this box to grow and hide overflow */}
          {loading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
              }}
            >
              <CircularProgress />
            </Box>
          ) : error ? (
            <MuiAlert severity="error" sx={{ m: 2 }}>
              {error}
            </MuiAlert>
          ) : (
            <Grid container spacing={3} sx={{ height: '100%' }}>
              {/* Product Grid */}
              <Grid item xs={12} md={7} lg={8} sx={{ height: '100%' }}>
                <motion.div variants={itemVariants} style={{ height: '100%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: theme.shape.borderRadius,
                      border: `1px solid ${theme.palette.divider}`,
                      height: '100%', // Take full height of grid item
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <ProductGrid
                      productsByCategory={productsByCategory}
                      onProductSelect={addToCart}
                    />
                  </Paper>
                </motion.div>
              </Grid>

              {/* Shopping Cart with additional Memento pattern buttons */}
              <Grid
                item
                xs={12}
                md={4}
                sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  {/* Cart header with undo/redo buttons */}
                  <Box
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      background: theme.palette.background.paper,
                    }}
                  >
                    <Typography variant="h6">Warenkorb</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Tooltip title="Rückgängig">
                        <span>
                          {' '}
                          {/* Tooltip requires a wrapper when child is disabled */}
                          <IconButton
                            size="small"
                            disabled={!cartUndoEnabled}
                            onClick={handleUndoCartState}
                            sx={{ mr: 0.5 }}
                          >
                            <UndoIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Wiederherstellen">
                        <span>
                          {' '}
                          {/* Tooltip requires a wrapper when child is disabled */}
                          <IconButton
                            size="small"
                            disabled={!cartRedoEnabled}
                            onClick={handleRedoCartState}
                            sx={{ mr: 0.5 }}
                          >
                            <RedoIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Chip
                        icon={<ShoppingCartIcon fontSize="small" />}
                        label={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        color="primary"
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <ShoppingCart
                    cartItems={cartItems}
                    appliedVouchers={appliedVouchers}
                    subtotal={subtotal}
                    voucherDiscount={voucherDiscount}
                    total={total}
                    receiptReady={receiptReady}
                    onAddItem={addToCart}
                    onRemoveItem={removeFromCart}
                    onDeleteItem={deleteFromCart}
                    onClearCart={clearCart}
                    onPayment={handlePaymentModalOpen}
                    onPrintReceipt={handlePrintReceipt}
                    onNewTransaction={handleNewTransaction}
                    onRemoveVoucher={handleRemoveVoucher}
                    onRedeemVoucher={handleRedeemVoucherDialog}
                    onManageVouchers={handleVoucherManagementDialog}
                    onPurchaseVoucher={handlePurchaseVoucherDialog}
                  />
                </Paper>
              </Grid>
            </Grid>
          )}
        </Box>
      </Container>

      {/* Dialogs and Snackbar */}
      <PaymentDialog
        open={paymentModalOpen}
        onClose={handlePaymentModalClose}
        onComplete={handlePaymentSubmit}
        total={total}
        cartItemsCount={cartItems.length}
        voucherDiscount={voucherDiscount}
        depositCredit={depositCredit}
        appliedVouchers={appliedVouchers}
        paymentMethod={paymentMethod}
        cashReceived={cashReceived}
        cardDetails={cardDetails}
        onPaymentMethodChange={handlePaymentMethodChange}
        onCashReceivedChange={handleCashReceivedChange}
        onCardDetailsChange={handleCardDetailsChange}
        change={change}
        TransitionComponent={Transition}
        loading={paymentLoading} // Pass loading state
      />

      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
          elevation={6} // Add elevation for visibility
          sx={{ width: '100%' }}
        >
          Zahlung erfolgreich abgeschlossen!
        </MuiAlert>
      </Snackbar>

      {/* Redeem Voucher Dialog */}
      <RedeemVoucherDialog
        open={redeemVoucherDialogOpen}
        onClose={handleRedeemVoucherDialogClose}
        onVoucherRedeemed={handleVoucherApplied}
        cartTotal={total}
      />

      {/* Redeem Deposit Receipt Dialog */}
      <RedeemDepositDialog
        open={redeemDepositDialogOpen}
        onClose={handleRedeemDepositDialogClose}
        onDepositRedeemed={handleDepositRedeemed}
        appliedDepositIds={appliedDeposits.map(deposit => deposit.id)}
      />

      {/* Voucher Management Dialog */}
      <VoucherManagementDialog
        open={voucherManagementDialogOpen}
        onClose={handleVoucherManagementDialogClose}
      />

      {/* Purchase Voucher Dialog */}
      <PurchaseVoucherDialog
        open={purchaseVoucherDialogOpen}
        onClose={handlePurchaseVoucherDialogClose}
        onVoucherIssued={handleVoucherApplied}
      />
    </Box>
  );
};

export default SalesScreen;
