import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import InventoryIcon from '@mui/icons-material/Inventory';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  Alert,
  Tooltip,
  Container,
  Grid,
  useTheme,
  InputAdornment,
  TextField,
  Chip,
  Divider,
  Avatar,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

import { ProductForm } from '../../components/admin';
import { DeleteConfirmationDialog } from '../../components/ui/modals';
import { ProductService } from '../../services';

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

/**
 * ProductManagementPage - Admin page to manage products
 */
const ProductManagementPage = () => {
  const theme = useTheme();

  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Dialog states
  const [openProductForm, setOpenProductForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formMode, setFormMode] = useState('create');
  const [currentProduct, setCurrentProduct] = useState(null);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ProductService.getProducts({
        page,
        size: rowsPerPage,
      });

      setProducts(response.content || []);
      setFilteredProducts(response.content || []);
      setTotalElements(response.totalElements || 0);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Fehler beim Laden der Produkte. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  // Load products on component mount and when page/rowsPerPage changes
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const lowercaseQuery = searchQuery.toLowerCase();
    const filtered = products.filter(
      product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
        (product.category?.name && product.category.name.toLowerCase().includes(lowercaseQuery)) ||
        (product.brand?.name && product.brand.name.toLowerCase().includes(lowercaseQuery))
    );

    setFilteredProducts(filtered);
  }, [searchQuery, products]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search query change
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  // Open form for creating a new product
  const handleOpenCreateForm = () => {
    setCurrentProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      category: null,
      brand: null,
      supplier: null,
    });
    setFormMode('create');
    setOpenProductForm(true);
  };

  // Open form for editing a product
  const handleOpenEditForm = product => {
    setCurrentProduct(product);
    setFormMode('edit');
    setOpenProductForm(true);
  };

  // Close product form
  const handleCloseProductForm = () => {
    setOpenProductForm(false);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = product => {
    setCurrentProduct(product);
    setOpenDeleteDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Handle form submission (create or update)
  const handleSubmitProductForm = async productData => {
    try {
      setLoading(true);

      if (formMode === 'create') {
        await ProductService.createProduct(productData);
      } else {
        await ProductService.updateProduct(currentProduct.id, productData);
      }

      setOpenProductForm(false);
      fetchProducts();
    } catch (err) {
      console.error(`Error ${formMode === 'create' ? 'creating' : 'updating'} product:`, err);
      setError(`Fehler beim ${formMode === 'create' ? 'Erstellen' : 'Aktualisieren'} des Produkts. 
        Bitte versuchen Sie es später erneut.`);
      setLoading(false);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      await ProductService.deleteProduct(currentProduct.id);
      setOpenDeleteDialog(false);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Fehler beim Löschen des Produkts. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  // Get product count statistics
  const productStats = {
    total: totalElements,
    withStock: products.filter(p => (p.stockQuantity || 0) > 0).length,
    lowStock: products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10)
      .length,
    outOfStock: products.filter(p => (p.stockQuantity || 0) === 0).length,
  };

  // Render product table
  const renderProductTable = () => {
    if (loading && products.length === 0) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      );
    }

    return (
      <>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '& th': {
                    fontWeight: 'bold',
                  },
                }}
              >
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Kategorie</TableCell>
                <TableCell>Marke</TableCell>
                <TableCell align="right">Bestand</TableCell>
                <TableCell align="right">Preis (€)</TableCell>
                <TableCell align="center">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map(product => (
                <TableRow
                  key={product.id}
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.background.default, 0.5)
                          : alpha(theme.palette.background.paper, 0.1),
                    },
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell>{product.brand?.name || '-'}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={product.stockQuantity || 0}
                      color={
                        (product.stockQuantity || 0) === 0
                          ? 'error'
                          : (product.stockQuantity || 0) < 10
                            ? 'warning'
                            : 'success'
                      }
                    />
                  </TableCell>
                  <TableCell align="right">{(product.price ?? 0).toFixed(2)} €</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Bearbeiten">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditForm(product)}
                        disabled={loading}
                        size="small"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Löschen">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(product)}
                        disabled={loading}
                        size="small"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {filteredProducts.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Keine Produkte gefunden
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {searchQuery
                        ? 'Versuchen Sie andere Suchbegriffe oder löschen Sie die Filter'
                        : "Fügen Sie ein neues Produkt mit dem 'Neues Produkt' Button hinzu"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Zeilen pro Seite:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} von ${count}`}
          disabled={loading}
        />
      </>
    );
  };

  return (
    <Box sx={{ py: 3 }}>
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xl">
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Produkt-Verwaltung
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Verwalten Sie alle Produkte im System und behalten Sie den Bestand im Blick.
            </Typography>
          </Box>
        </Container>
      </motion.div>

      <Container maxWidth="xl">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Statistics Cards */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), mr: 2 }}>
                        <InventoryIcon color="primary" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Gesamt
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : productStats.total}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.success.main, 0.1), mr: 2 }}>
                        <InventoryIcon color="success" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Auf Lager
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : productStats.withStock}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), mr: 2 }}>
                        <InventoryIcon color="warning" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Niedriger Bestand
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : productStats.lowStock}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.error.main, 0.1), mr: 2 }}>
                        <InventoryIcon color="error" />
                      </Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Nicht auf Lager
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 700, mb: 0 }}>
                      {loading ? <CircularProgress size={24} /> : productStats.outOfStock}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

          {/* Filter Section */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 2,
                mb: 3,
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder="Produkte suchen..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={fetchProducts}
                      disabled={loading}
                    >
                      Aktualisieren
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<AddIcon />}
                      onClick={handleOpenCreateForm}
                      disabled={loading}
                    >
                      Neues Produkt
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Product Table */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              {renderProductTable()}
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      {/* Product Form Dialog */}
      <ProductForm
        open={openProductForm}
        onClose={handleCloseProductForm}
        onSubmit={handleSubmitProductForm}
        initialData={currentProduct}
        mode={formMode}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProduct}
        title="Produkt löschen"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Sind Sie sicher, dass Sie das Produkt "{currentProduct?.name || ''}" löschen möchten?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'medium' }}>
              Achtung: Das Löschen von Produkten kann zu Inkonsistenzen im System führen! Produkte
              könnten in bestehenden Verkäufen, Bestellungen oder Verbindungen zu anderen Produkten
              verwendet werden. Statt Produkte zu löschen, sollten Sie diese lieber als "nicht
              verfügbar" markieren, wenn sie nicht mehr verkauft werden sollen.
            </Typography>
          </>
        }
        loading={loading}
      />
    </Box>
  );
};

export default ProductManagementPage;
