import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
  Avatar,
  alpha,
  Badge,
  Chip,
  Stack,
  Fade,
} from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import PrintIcon from '@mui/icons-material/Print';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BottleAltIcon from '@mui/icons-material/WineBarOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BarcodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { DepositService, ProductService } from '../../services';
import DepositItemsList from './DepositItemsList';
import DepositReceipt from './DepositReceipt';
import { useBarcodeScan } from '../../contexts/BarcodeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrinter } from '../../hooks';

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
      stiffness: 300,
      damping: 24,
    },
  },
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.02, 1],
    boxShadow: [
      '0px 4px 12px rgba(0,0,0,0.05)',
      '0px 8px 24px rgba(0,0,0,0.12)',
      '0px 4px 12px rgba(0,0,0,0.05)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
};

const PfandautomatView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);
  const { pendingDepositItems, clearPendingDepositItems } = useBarcodeScan();
  const { printDepositReceipt, isLoading: isPrinting, error: printerError } = usePrinter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Process pendingDepositItems from BarcodeContext
  useEffect(() => {
    if (pendingDepositItems.length > 0) {
      // Merge with existing scanned items
      const updatedItems = [...scannedItems];

      pendingDepositItems.forEach(pendingItem => {
        const existingItemIndex = updatedItems.findIndex(
          item => item.product.id === pendingItem.product.id
        );

        if (existingItemIndex !== -1) {
          // Increment quantity if already in list
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + pendingItem.quantity,
          };
        } else {
          // Add new item if not in list
          updatedItems.push({ ...pendingItem });
        }
      });

      setScannedItems(updatedItems);
      // Show animation for added item
      setItemAdded(true);
      setTimeout(() => setItemAdded(false), 1500);
      // Clear the pending items after processing them
      clearPendingDepositItems();
    }
  }, [pendingDepositItems, clearPendingDepositItems, scannedItems]);

  // Load products that have deposit items connected to them
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Fetch all products - we'll filter for those with connected products in the UI
        const response = await ProductService.getProducts({ page: 0, size: 100 });
        // Keep only products that have at least one connected product in the "Pfand" category
        const productsWithDeposits = response.content.filter(
          product =>
            product.connectedProducts &&
            product.connectedProducts.some(
              connectedProduct => connectedProduct?.category?.name === 'Pfand'
            )
        );
        setProducts(productsWithDeposits);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Generate deposit receipt
  const handleGenerateReceipt = async () => {
    if (scannedItems.length === 0) {
      setError('No items have been scanned yet.');
      return;
    }

    try {
      setIsLoading(true);

      // Format data for API
      const depositReceiptData = {
        positions: scannedItems.map(item => ({
          quantity: item.quantity,
          product: item.product,
        })),
      };

      // Make API call to create receipt
      const response = await DepositService.createDepositReceipt(depositReceiptData);

      // Set receipt data for display
      setReceiptData(response.data);
      setReceiptGenerated(true);
      setShowReceiptDialog(true);

      // Print the receipt (automatically)
      try {
        await printDepositReceipt(response.data);
      } catch (printError) {
        console.error('Error printing deposit receipt:', printError);
        // We don't want to show an error for print failures
        // as the receipt generation was successful
      }

      // Reset scanned items after successful receipt generation
      setScannedItems([]);
    } catch (err) {
      setError('Failed to generate receipt. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate total deposit value
  const calculateTotal = () => {
    return scannedItems.reduce((total, item) => {
      return total + (item.product.price || 0) * item.quantity;
    }, 0);
  };

  // Calculate total bottles
  const calculateTotalBottles = () => {
    return scannedItems.reduce((total, item) => {
      return total + item.quantity;
    }, 0);
  };

  return (
    <Container
      maxWidth="lg"
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      sx={{ py: 4 }}
    >
      <Box
        sx={{ mb: 4, display: 'flex', alignItems: 'center' }}
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Avatar
          sx={{
            bgcolor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            width: 56,
            height: 56,
            mr: 2,
            boxShadow: theme.shadows[2],
          }}
          component={motion.div}
          whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <RecyclingIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="medium">
            Pfandautomat
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Scannen Sie Ihre Pfandflaschen ein, um einen Bon zu erhalten
          </Typography>
        </Box>
      </Box>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <Grid
        container
        spacing={3}
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Stats Cards Row */}
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <Grid container spacing={2}>
              {/* Total Bottles Card */}
              <Grid item xs={12} sm={4}>
                <Card
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[2],
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.info.main, 0.1),
                        color: theme.palette.info.main,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <BottleAltIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Flaschen gesamt
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {calculateTotalBottles()}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Total Value Card */}
              <Grid item xs={12} sm={4}>
                <Card
                  component={motion.div}
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[2],
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.success.main, 0.1),
                        color: theme.palette.success.main,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <LocalAtmIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Pfandwert
                      </Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {calculateTotal().toFixed(2)} €
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Action Card */}
              <Grid item xs={12} sm={4}>
                <Card
                  component={motion.div}
                  variants={pulseVariants}
                  animate="pulse"
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.shadows[2],
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.3)} 100%)`,
                  }}
                >
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                    >
                      <BarcodeScannerIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        Pfandflaschen scannen
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Halte den Barcode vor den Scanner
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        </Grid>

        {/* Deposit Items List */}
        <Grid item xs={12} md={7} lg={8}>
          <motion.div variants={itemVariants}>
            <Card
              elevation={2}
              sx={{
                height: '100%',
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={itemAdded ? { opacity: 1 } : { opacity: 0 }}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 10,
                  p: 1,
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.success.main, 0.9),
                  color: 'white',
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'text-bottom' }} />
                  Pfandartikel hinzugefügt!
                </Typography>
              </Box>

              <CardContent sx={{ p: 0 }}>
                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: 'background.paper',
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge
                      badgeContent={calculateTotalBottles()}
                      color="primary"
                      showZero
                      sx={{ mr: 2 }}
                    >
                      <BottleAltIcon color="primary" />
                    </Badge>
                    <Typography variant="h6" fontWeight="medium">
                      Gescannte Flaschen
                    </Typography>
                  </Box>
                  <Tooltip title="Bitte scannen Sie die Barcodes Ihrer Pfandflaschen ein">
                    <IconButton
                      size="small"
                      component={motion.button}
                      whileHover={{ rotate: 15 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <InfoOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box sx={{ p: 2, minHeight: '350px' }}>
                  {isLoading ? (
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{ height: '300px' }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : (
                    <AnimatePresence>
                      <DepositItemsList
                        items={scannedItems}
                        onRemoveItem={null}
                        onUpdateQuantity={null}
                        readOnly={true}
                      />
                    </AnimatePresence>
                  )}
                </Box>

                <Divider />

                <Box
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    bgcolor: theme.palette.grey[50],
                  }}
                >
                  <Box>
                    <Typography variant="subtitle1" color="text.secondary">
                      Gesamtwert:
                    </Typography>
                    <Typography variant="h5" color="primary" fontWeight="bold">
                      {calculateTotal().toFixed(2)} €
                    </Typography>
                  </Box>

                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      startIcon={<ReceiptIcon />}
                      onClick={handleGenerateReceipt}
                      disabled={isLoading || scannedItems.length === 0}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderRadius: theme.shape.borderRadius,
                        boxShadow: theme.shadows[4],
                      }}
                    >
                      {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Bon erstellen'}
                    </Button>
                  </motion.div>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Instructions and Information */}
        <Grid item xs={12} md={5} lg={4}>
          <motion.div variants={itemVariants}>
            <Card
              elevation={2}
              sx={{
                mb: 3,
                borderRadius: theme.shape.borderRadius,
                border: `1px solid ${theme.palette.divider}`,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Typography variant="h6" fontWeight="medium">
                  Anleitung
                </Typography>
              </Box>

              <CardContent>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem',
                        mr: 1.5,
                      }}
                    >
                      1
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Flasche scannen
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Halten Sie den Barcode vor den Scanner
                      </Typography>
                    </Box>
                  </Box>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                      <ArrowForwardIcon color="primary" />
                    </Box>
                  </motion.div>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem',
                        mr: 1.5,
                      }}
                    >
                      2
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Pfandwert wird berechnet
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Der Wert wird automatisch addiert
                      </Typography>
                    </Box>
                  </Box>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
                      <ArrowForwardIcon color="primary" />
                    </Box>
                  </motion.div>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar
                      sx={{
                        width: 28,
                        height: 28,
                        bgcolor: theme.palette.primary.main,
                        fontSize: '0.875rem',
                        mr: 1.5,
                      }}
                    >
                      3
                    </Avatar>
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        Pfandbon erstellen
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lösen Sie den Bon an der Kasse ein
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* Receipt Dialog */}
      <Dialog
        open={showReceiptDialog}
        onClose={() => setShowReceiptDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Fade}
        TransitionProps={{ timeout: 300 }}
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, y: 50, scale: 0.9 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: { type: 'spring', duration: 0.5 },
          sx: {
            borderRadius: 3,
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            alignItems: 'center',
            background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
            color: 'white',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha('#ffffff', 0.2),
                width: 40,
                height: 40,
                mr: 2,
              }}
            >
              <ReceiptIcon />
            </Avatar>
            <Typography variant="h5" fontWeight="bold">
              Pfandbon erstellt
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {receiptData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <DepositReceipt receipt={receiptData} />
            </motion.div>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button onClick={() => setShowReceiptDialog(false)} variant="outlined">
            Schließen
          </Button>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<PrintIcon />}
              onClick={() => {
                if (receiptData) {
                  printDepositReceipt(receiptData);
                }
              }}
              disabled={isPrinting}
            >
              {isPrinting ? <CircularProgress size={24} color="inherit" /> : 'Erneut drucken'}
            </Button>
          </motion.div>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PfandautomatView;
