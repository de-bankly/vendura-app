import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  useTheme,
  useMediaQuery,
  Avatar,
  alpha,
} from '@mui/material';
import RecyclingIcon from '@mui/icons-material/Recycling';
import { DepositService, ProductService } from '../../services';
import { useBarcodeScan } from '../../contexts/BarcodeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrinter } from '../../hooks';
import DepositStats from './subcomponents/DepositStats';
import InstructionsCard from './subcomponents/InstructionsCard';
import DepositReceiptDialog from './subcomponents/DepositReceiptDialog';
import DepositListCard from './subcomponents/DepositListCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * Renders the main view for the Pfandautomat (deposit return machine).
 * Handles barcode scanning, product lookup, item management, receipt generation,
 * and displays relevant information and controls.
 * @returns {JSX.Element} The PfandautomatView component.
 */
const PfandautomatView = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [receiptGenerated, setReceiptGenerated] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [itemAdded, setItemAdded] = useState(false);
  const {
    pendingDepositItems,
    clearPendingDepositItems,
    scannedValue,
    resetScan,
    enableScanner,
    error: scanError,
  } = useBarcodeScan();
  const { printDepositReceipt, isLoading: isPrinting, error: printerError } = usePrinter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    enableScanner();
    return () => {};
  }, [enableScanner]);

  /**
   * Adds a product to the list of scanned deposit items or increments its quantity if already present.
   * Triggers a visual feedback state (`itemAdded`).
   * @param {object} product - The Pfand product object to add.
   */
  const addToScannedItems = useCallback(product => {
    setScannedItems(prev => {
      const existingItemIndex = prev.findIndex(item => item.product.id === product.id);

      if (existingItemIndex !== -1) {
        const newItems = [...prev];
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newItems[existingItemIndex].quantity + 1,
        };
        return newItems;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });

    setItemAdded(true);
    setTimeout(() => setItemAdded(false), 1500);
  }, []);

  /**
   * Looks up a product by its barcode to determine if it's a valid deposit item.
   * Adds the corresponding Pfand product(s) to the scanned items list if found.
   * Sets an error state if the product is not found or not a deposit item.
   * @param {string} code - The scanned barcode string.
   * @returns {Promise<boolean>} A promise that resolves to true if a Pfand item was found and added, false otherwise.
   */
  const handlePfandProductLookup = useCallback(
    async code => {
      setIsLoading(true);
      setError(null);
      try {
        const product = await ProductService.getProductById(code, true);

        if (!product) {
          setError(`Kein Produkt mit Barcode ${code} gefunden.`);
          return false;
        }

        const isPfandProduct = product.category?.name === 'Pfand';
        if (isPfandProduct) {
          addToScannedItems(product);
          return true;
        }

        const pfandProducts =
          product.connectedProducts?.filter(cp => cp.category?.name === 'Pfand') || [];

        if (pfandProducts.length > 0) {
          pfandProducts.forEach(pfandProduct => {
            addToScannedItems(pfandProduct);
          });
          return true;
        }

        setError(`Produkt ${product.name} (${code}) ist kein Pfandartikel.`);
        return false;
      } catch (err) {
        console.error(`PfandautomatView: Error looking up product ${code}:`, err);
        setError(`Fehler beim Produkt-Lookup: ${err.message}`);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [addToScannedItems]
  );

  useEffect(() => {
    if (scannedValue) {
      (async () => {
        try {
          await handlePfandProductLookup(scannedValue);
        } catch (err) {
          console.error('PfandautomatView: Error during Pfand lookup execution:', err);
          setError(`Unerwarteter Fehler beim Scannen: ${err.message}`);
        } finally {
          resetScan();
        }
      })();
    }
  }, [scannedValue, resetScan, handlePfandProductLookup]);

  useEffect(() => {
    if (scanError) {
      setError(`Scanner Fehler: ${scanError}`);
      resetScan();
    }
  }, [scanError, resetScan]);

  useEffect(() => {
    if (pendingDepositItems.length > 0) {
      const updatedItems = [...scannedItems];
      let itemsWereAdded = false;

      pendingDepositItems.forEach(pendingItem => {
        const existingItemIndex = updatedItems.findIndex(
          item => item.product.id === pendingItem.product.id
        );

        if (existingItemIndex !== -1) {
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + pendingItem.quantity,
          };
        } else {
          updatedItems.push({ ...pendingItem });
        }
        itemsWereAdded = true;
      });

      if (itemsWereAdded) {
        setScannedItems(updatedItems);
        setItemAdded(true);
        setTimeout(() => setItemAdded(false), 1500);
      }
      clearPendingDepositItems();
    }
  }, [pendingDepositItems, clearPendingDepositItems, scannedItems]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await ProductService.getProducts({ page: 0, size: 100 });
        const productsWithDeposits = response.content.filter(product =>
          product.connectedProducts?.some(cp => cp?.category?.name === 'Pfand')
        );
        setProducts(productsWithDeposits);
      } catch (err) {
        setError('Fehler beim Laden der Produktdaten.');
        console.error('PfandautomatView: Failed to load products:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /**
   * Generates a deposit receipt based on the currently scanned items.
   * Calls the DepositService to create the receipt, updates state,
   * triggers printing, displays a confirmation dialog, and clears the scanned items list.
   * Sets an error state if receipt generation fails.
   * @returns {Promise<void>}
   */
  const handleGenerateReceipt = async () => {
    if (scannedItems.length === 0) {
      setError('Keine Artikel gescannt. Fügen Sie Artikel hinzu, um einen Bon zu erstellen.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const depositReceiptData = {
        positions: scannedItems.map(item => ({
          quantity: item.quantity,
          product: item.product,
        })),
      };

      const response = await DepositService.createDepositReceipt(depositReceiptData);

      setReceiptData(response.data);
      setReceiptGenerated(true);
      setShowReceiptDialog(true);

      try {
        await printDepositReceipt(response.data);
      } catch (printError) {
        console.error('PfandautomatView: Error printing deposit receipt:', printError);
        setError(`Bon erstellt, aber Fehler beim Drucken: ${printError.message || printError}`);
      }

      setScannedItems([]);
    } catch (err) {
      setError(`Fehler beim Erstellen des Bons: ${err.message}`);
      console.error('PfandautomatView: Failed to generate receipt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Calculates the total monetary value of all scanned deposit items.
   * @returns {number} The total deposit value.
   */
  const calculateTotal = () => {
    return scannedItems.reduce((total, item) => {
      const price = Number(item.product?.price) || 0;
      return total + price * item.quantity;
    }, 0);
  };

  /**
   * Calculates the total number of individual bottles/items scanned.
   * @returns {number} The total count of items.
   */
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
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            style={{ marginBottom: theme.spacing(3) }}
          >
            <Alert severity="error" onClose={() => setError(null)}>
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
        <Grid item xs={12}>
          <DepositStats totalBottles={calculateTotalBottles()} totalValue={calculateTotal()} />
        </Grid>

        <Grid item xs={12} md={7} lg={8}>
          <DepositListCard
            scannedItems={scannedItems}
            isLoading={isLoading}
            itemAdded={itemAdded}
            totalBottles={calculateTotalBottles()}
            totalValue={calculateTotal()}
            handleGenerateReceipt={handleGenerateReceipt}
            isGeneratingReceipt={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={5} lg={4}>
          <InstructionsCard />
        </Grid>
      </Grid>

      <DepositReceiptDialog
        open={showReceiptDialog}
        onClose={() => setShowReceiptDialog(false)}
        receiptData={receiptData}
      />
    </Container>
  );
};

export default PfandautomatView;
