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
} from '@mui/material';
import { DepositService, ProductService } from '../../services';
import BottleScanner from './BottleScanner';
import DepositItemsList from './DepositItemsList';
import DepositReceipt from './DepositReceipt';

const PfandautomatView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [depositProducts, setDepositProducts] = useState([]);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  // Load deposit products from the backend
  useEffect(() => {
    const fetchDepositProducts = async () => {
      try {
        setIsLoading(true);
        // Fetch deposit products directly using the dedicated method
        const depositItems = await ProductService.getDepositProducts({ page: 0, size: 50 });
        setDepositProducts(depositItems);
      } catch (err) {
        setError('Failed to load deposit products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepositProducts();
  }, []);

  // Simulate scanning a bottle
  const handleScanBottle = bottleType => {
    // Find a matching deposit product
    const matchedProduct = depositProducts.find(product =>
      product.name.toLowerCase().includes(bottleType.toLowerCase())
    );

    if (!matchedProduct) {
      setError(`No matching product found for "${bottleType}"`);
      return;
    }

    // Add to scanned items
    const existingItemIndex = scannedItems.findIndex(item => item.product.id === matchedProduct.id);

    if (existingItemIndex !== -1) {
      // Increment quantity if already scanned
      const updatedItems = [...scannedItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + 1,
      };
      setScannedItems(updatedItems);
    } else {
      // Add new item if not scanned before
      setScannedItems([
        ...scannedItems,
        {
          product: matchedProduct,
          quantity: 1,
        },
      ]);
    }

    // Clear any previous errors
    setError(null);
  };

  // Remove an item from the scanned list
  const handleRemoveItem = index => {
    const updatedItems = [...scannedItems];
    updatedItems.splice(index, 1);
    setScannedItems(updatedItems);
  };

  // Update item quantity
  const handleUpdateQuantity = (index, newQuantity) => {
    const updatedItems = [...scannedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      quantity: newQuantity,
    };
    setScannedItems(updatedItems);
  };

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

      setReceiptData(response.data);
      setReceiptGenerated(true);
      setShowReceiptDialog(true);

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
      // Verwende depositValue statt price für die Berechnung des Pfandwerts
      return total + (item.product.depositValue || item.product.price) * item.quantity;
    }, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Pfandautomat
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Bottle Scanner Section */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <BottleScanner
              onScanBottle={handleScanBottle}
              isLoading={isLoading}
              depositProducts={depositProducts}
            />
          </Paper>
        </Grid>

        {/* Deposit Items List */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Gescannte Flaschen
            </Typography>

            {isLoading ? (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
              </Box>
            ) : (
              <DepositItemsList
                items={scannedItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
            )}

            <Box
              sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="h6">Gesamt: {calculateTotal().toFixed(2)} €</Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerateReceipt}
                disabled={isLoading || scannedItems.length === 0}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Bon erstellen'}
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Receipt Dialog */}
      <Dialog
        open={showReceiptDialog}
        onClose={() => setShowReceiptDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Pfandbon erstellt</DialogTitle>
        <DialogContent>{receiptData && <DepositReceipt receipt={receiptData} />}</DialogContent>
        <DialogActions>
          <Button onClick={() => setShowReceiptDialog(false)}>Schließen</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setShowReceiptDialog(false);
              // Here you could add logic to print the receipt
            }}
          >
            Drucken
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PfandautomatView;
