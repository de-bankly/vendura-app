import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  LocalShipping as LocalShippingIcon,
  Refresh as RefreshIcon,
  WarningAmber as WarningIcon,
} from '@mui/icons-material';
import { InventoryManagementService, ProductService, SupplierOrderService } from '../services';
import { InventoryProductList, StockAdjustmentDialog } from '../components/inventory';
import SupplierOrdersList from '../components/inventory/SupplierOrdersList';
import SupplierOrderForm from '../components/inventory/SupplierOrderForm';

const InventoryManagementPage = () => {
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
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <WarningIcon color="warning" sx={{ mr: 1 }} />
              <Typography variant="h6">Low Stock Products</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {lowStockProducts.length} products below minimum stock level
              {lowStockProducts.filter(p => p.currentStock === 0).length > 0 && (
                <Typography variant="body2" color="error.main" sx={{ mt: 1 }} component="span">
                  {lowStockProducts.filter(p => p.currentStock === 0).length} products out of stock!
                </Typography>
              )}
            </Typography>
            <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => setActiveTab(1)}>
              View All
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h6">Pending Orders</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {pendingOrders.length} supplier orders pending delivery
            </Typography>
            <Button variant="outlined" size="small" sx={{ mt: 1 }} onClick={() => setActiveTab(2)}>
              View All
            </Button>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AssessmentIcon color="info" sx={{ mr: 1 }} />
              <Typography variant="h6">Inventory Actions</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button variant="contained" onClick={handleTriggerReorderCheck}>
                Run Automatic Reordering
              </Button>
              <Button variant="contained" onClick={handleCreateOrder}>
                Create Supplier Order
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderLowStockProducts = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Low Stock Products</Typography>
        <Button startIcon={<RefreshIcon />} onClick={handleRefresh}>
          Refresh
        </Button>
      </Box>

      {lowStockProducts.length > 0 ? (
        <InventoryProductList
          products={lowStockProducts}
          onAdjustStock={handleOpenStockAdjustment}
        />
      ) : (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>No products are below minimum stock levels.</Typography>
        </Paper>
      )}
    </Box>
  );

  const renderSupplierOrders = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6">Supplier Orders</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="contained" onClick={handleCreateOrder}>
            Create Order
          </Button>
          <Button startIcon={<RefreshIcon />} onClick={handleRefresh}>
            Refresh
          </Button>
        </Box>
      </Box>

      <SupplierOrdersList orders={pendingOrders} onRefresh={handleRefresh} />
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Inventory Management
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Dashboard" />
          <Tab label="Low Stock" />
          <Tab label="Supplier Orders" />
        </Tabs>
      </Box>

      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ mt: 3 }}>
          {activeTab === 0 && renderDashboard()}
          {activeTab === 1 && renderLowStockProducts()}
          {activeTab === 2 && renderSupplierOrders()}
        </Box>
      )}

      {currentProduct && (
        <StockAdjustmentDialog
          open={showStockAdjustment}
          onClose={handleStockAdjustmentClose}
          product={currentProduct}
          onSuccess={handleStockAdjustmentSuccess}
        />
      )}

      {showOrderForm && (
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <SupplierOrderForm onSubmit={handleOrderFormSubmit} onCancel={handleOrderFormCancel} />
          </Paper>
        </Box>
      )}
    </Container>
  );
};

export default InventoryManagementPage;
