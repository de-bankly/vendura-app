import {
  Assessment as AssessmentIcon,
  LocalShipping as LocalShippingIcon,
  Refresh as RefreshIcon,
  WarningAmber as WarningIcon,
  Inventory2 as InventoryIcon,
  ArrowBack as ArrowBackIcon,
  AltRoute as AltRouteIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
  Paper,
  alpha,
  useTheme,
  Chip,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { InventoryProductList, StockAdjustmentDialog } from '../components/inventory';
import SupplierOrderForm from '../components/inventory/SupplierOrderForm';
import SupplierOrdersList from '../components/inventory/SupplierOrdersList';
import { InventoryManagementService, SupplierOrderService } from '../services';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const InventoryManagementPage = () => {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [showStockAdjustment, setShowStockAdjustment] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchData();
  }, [activeTab, refreshTrigger]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 0 || activeTab === 1) {
        // Fetch low stock products
        const lowStockData = await InventoryManagementService.getLowStockProducts();
        setLowStockProducts(lowStockData);
      }

      if (activeTab === 0 || activeTab === 2) {
        // Fetch pending supplier orders
        const pendingOrdersData = await InventoryManagementService.getPendingSupplierOrders();
        setPendingOrders(pendingOrdersData);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error loading inventory data:', err);
      setError('Failed to load inventory data. Please try again.');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleTriggerReorderCheck = async () => {
    try {
      await InventoryManagementService.triggerReorderCheck();
      handleRefresh();
    } catch (err) {
      console.error('Error triggering reorder check:', err);
      setError('Failed to trigger reorder check.');
    }
  };

  const handleOpenStockAdjustment = product => {
    setCurrentProduct(product);
    setShowStockAdjustment(true);
  };

  const handleStockAdjustmentClose = () => {
    setShowStockAdjustment(false);
    setCurrentProduct(null);
  };

  const handleStockAdjustmentSuccess = () => {
    handleRefresh();
  };

  const handleCreateOrder = () => {
    setShowOrderForm(true);
  };

  const handleOrderFormSubmit = async formData => {
    try {
      await SupplierOrderService.createSupplierOrder(formData);
      setShowOrderForm(false);
      handleRefresh();
    } catch (err) {
      console.error('Error creating supplier order:', err);
      setError('Failed to create supplier order.');
    }
  };

  const handleOrderFormCancel = () => {
    setShowOrderForm(false);
  };

  const renderDashboard = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Grid container spacing={3}>
        {/* Low Stock Products Card */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <WarningIcon color="warning" />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Niedrige Bestände
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{lowStockProducts.length}</strong> Produkte unter dem Mindestbestand
                </Typography>

                {lowStockProducts.filter(p => p.currentStock === 0).length > 0 && (
                  <Chip
                    label={`${lowStockProducts.filter(p => p.currentStock === 0).length} Produkte nicht verfügbar!`}
                    color="error"
                    size="small"
                    sx={{ my: 1 }}
                  />
                )}
              </Box>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 2,
                  alignSelf: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  px: 2,
                }}
                onClick={() => setActiveTab(1)}
              >
                Alle anzeigen
              </Button>
            </Paper>
          </motion.div>
        </Grid>

        {/* Pending Orders Card */}
        <Grid item xs={12} md={6}>
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <LocalShippingIcon color="primary" />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Bestellungen
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>{pendingOrders.length}</strong> ausstehende Lieferungen
                </Typography>

                {pendingOrders.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    Klicken Sie auf "Alle anzeigen", um Details zu sehen und den Status zu
                    aktualisieren.
                  </Typography>
                )}
              </Box>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 2,
                  alignSelf: 'flex-start',
                  textTransform: 'none',
                  borderRadius: 1.5,
                  px: 2,
                }}
                onClick={() => setActiveTab(2)}
              >
                Alle anzeigen
              </Button>
            </Paper>
          </motion.div>
        </Grid>

        {/* Inventory Actions Card */}
        <Grid item xs={12}>
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box
                  sx={{
                    backgroundColor: alpha(theme.palette.info.main, 0.1),
                    borderRadius: 1,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <AssessmentIcon color="info" />
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  Inventaraktionen
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AltRouteIcon />}
                  onClick={handleTriggerReorderCheck}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 1.5,
                    px: 3,
                  }}
                >
                  Automatische Nachbestellung
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<LocalShippingIcon />}
                  onClick={handleCreateOrder}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 1.5,
                    px: 3,
                  }}
                >
                  Lieferantenbestellung erstellen
                </Button>
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderLowStockProducts = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.warning.main, 0.1),
                  borderRadius: 1,
                  p: 1,
                  mr: 2,
                }}
              >
                <WarningIcon color="warning" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Niedrige Bestände
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Produkte, die nachbestellt werden sollten
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: 1.5,
                  px: 2,
                }}
              >
                Aktualisieren
              </Button>
            </Box>
          </Box>

          {lowStockProducts.length > 0 ? (
            <InventoryProductList
              products={lowStockProducts}
              onAdjustStock={handleOpenStockAdjustment}
            />
          ) : (
            <Box
              sx={{
                p: 4,
                textAlign: 'center',
                bgcolor: alpha(theme.palette.success.light, 0.1),
                borderRadius: 2,
                border: `1px dashed ${alpha(theme.palette.success.main, 0.3)}`,
              }}
            >
              <Typography variant="h6" color="success.dark" fontWeight={500}>
                Alle Produkte haben ausreichende Bestände
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Es gibt derzeit keine Produkte unter dem Mindestbestand.
              </Typography>
            </Box>
          )}
        </Paper>
      </motion.div>
    </motion.div>
  );

  const renderSupplierOrders = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div variants={itemVariants}>
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: 1,
                  p: 1,
                  mr: 2,
                }}
              >
                <LocalShippingIcon color="primary" />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Lieferantenbestellungen
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ausstehende und kürzlich abgeschlossene Bestellungen
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LocalShippingIcon />}
                onClick={handleCreateOrder}
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: 1.5,
                  px: 2,
                }}
              >
                Bestellung erstellen
              </Button>
              <Button
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                variant="outlined"
                size="small"
                sx={{
                  textTransform: 'none',
                  borderRadius: 1.5,
                  px: 2,
                }}
              >
                Aktualisieren
              </Button>
            </Box>
          </Box>

          <SupplierOrdersList orders={pendingOrders} onRefresh={handleRefresh} />
        </Paper>
      </motion.div>
    </motion.div>
  );

  return (
    <Box sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: { xs: 'flex-start', sm: 'center' },
              justifyContent: 'space-between',
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Button
                  component={Link}
                  to="/inventory"
                  startIcon={<ArrowBackIcon />}
                  sx={{
                    mr: 2,
                    textTransform: 'none',
                    color: theme.palette.text.secondary,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    },
                  }}
                >
                  Zurück
                </Button>
                <Typography variant="h4" component="h1" fontWeight={700}>
                  Bestandsverwaltung
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Chip
                  label="Verwaltung"
                  size="small"
                  color="secondary"
                  sx={{
                    borderRadius: 1,
                    fontWeight: 500,
                    mr: 1,
                    backgroundColor: theme.palette.secondary.main,
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  Bestände prüfen, bestellen und Lieferungen verwalten
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ mb: 3, mt: 4 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '1rem',
                  minWidth: 120,
                },
              }}
            >
              <Tab label="Dashboard" />
              <Tab label="Niedrige Bestände" />
              <Tab label="Lieferantenbestellungen" />
            </Tabs>
          </Box>

          {error && (
            <Paper
              sx={{
                p: 2,
                mb: 3,
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                borderRadius: 2,
              }}
            >
              <Typography color="error">{error}</Typography>
            </Paper>
          )}
        </Container>
      </motion.div>

      {loading ? (
        <Container maxWidth="xl">
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={3}>
              {[...Array(3)].map((_, index) => (
                <Grid item xs={12} key={index}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 2,
                      height: 100,
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      ) : (
        <Container maxWidth="xl">
          <Box>
            {activeTab === 0 && renderDashboard()}
            {activeTab === 1 && renderLowStockProducts()}
            {activeTab === 2 && renderSupplierOrders()}
          </Box>
        </Container>
      )}

      {/* Stock Adjustment Dialog */}
      {currentProduct && (
        <StockAdjustmentDialog
          open={showStockAdjustment}
          onClose={handleStockAdjustmentClose}
          product={currentProduct}
          onSuccess={handleStockAdjustmentSuccess}
        />
      )}

      {/* Supplier Order Form */}
      {showOrderForm && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1300,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            overflow: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: '100%',
              maxWidth: 800,
              maxHeight: '90vh',
              overflow: 'auto',
              borderRadius: 2,
            }}
          >
            <SupplierOrderForm onSubmit={handleOrderFormSubmit} onCancel={handleOrderFormCancel} />
          </Paper>
        </Box>
      )}
    </Box>
  );
};

export default InventoryManagementPage;
