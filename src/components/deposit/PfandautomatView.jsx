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
  const [products, setProducts] = useState([]);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);

  // Load products that have deposit items connected to them
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Fetch all products - we'll filter for those with connected products in the UI
        const response = await ProductService.getProducts({ page: 0, size: 100 });
        // Keep only products that have connected products
        const productsWithDeposits = response.content.filter(
          product => product.connectedProducts && product.connectedProducts.length > 0
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

  // Handle product scan - fetch its connected deposit items
  const handleScanProduct = async product => {
    if (!product || !product.id) {
      setError('Invalid product selected');
      return;
    }

    try {
      setIsLoading(true);
      // Fetch the connected deposit items for this product
      const depositItems = await ProductService.getConnectedDepositItems(product.id);

      if (!depositItems || depositItems.length === 0) {
        setError(`No deposit items found for "${product.name}"`);
        return;
      }

      // Add all connected deposit items to scanned items
      const newScannedItems = [...scannedItems];

      depositItems.forEach(item => {
        const existingItemIndex = newScannedItems.findIndex(
          existingItem => existingItem.product.id === item.product.id
        );

        if (existingItemIndex !== -1) {
          // Increment quantity if already scanned
          newScannedItems[existingItemIndex] = {
            ...newScannedItems[existingItemIndex],
            quantity: newScannedItems[existingItemIndex].quantity + 1,
          };
        } else {
          // Add new item if not scanned before
          newScannedItems.push({
            product: item.product,
            quantity: 1,
          });
        }
      });

      setScannedItems(newScannedItems);
      setError(null);
    } catch (err) {
      setError(`Failed to process product: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulate scanning a bottle by product name
  const handleScanBottle = bottleName => {
    // Find a matching product
    const matchedProduct = products.find(product =>
      product.name.toLowerCase().includes(bottleName.toLowerCase())
    );

    if (!matchedProduct) {
      setError(`No matching product found for "${bottleName}"`);
      return;
    }

    // Process the found product
    handleScanProduct(matchedProduct);
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
      return total + (item.product.price || 0) * item.quantity;
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
              products={products} // Pass regular products instead of deposit products
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
