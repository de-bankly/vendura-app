import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
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
  Avatar,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

import { ProductForm } from '../../components/admin';
import { DeleteConfirmationDialog } from '../../components/ui/modals';
import { ProductService } from '../../services';

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
 * ProductManagementPage - Admin page to manage products.
 * Displays product statistics, allows searching and filtering,
 * provides actions to create, edit, and delete products.
 */
const ProductManagementPage = () => {
  const theme = useTheme();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [openProductForm, setOpenProductForm] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [formMode, setFormMode] = useState('create'); // 'create' or 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);

  /**
   * Fetches products from the backend based on current pagination settings.
   */
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

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      // If search is empty, show all products from the current page
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

  /**
   * Handles changing the current page in pagination.
   * @param {React.MouseEvent<HTMLButtonElement> | null} event - The event source of the callback.
   * @param {number} newPage - The new page number.
   */
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  /**
   * Handles changing the number of rows displayed per page.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - The event source of the callback.
   */
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  /**
   * Updates the search query state.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  /**
   * Opens the ProductForm dialog in 'create' mode.
   */
  const handleOpenCreateForm = () => {
    setCurrentProduct({
      id: '',
      name: '',
      description: '',
      price: 0,
      stockQuantity: 0,
      category: null,
      brand: null,
      supplier: null,
    });
    setFormMode('create');
    setOpenProductForm(true);
  };

  /**
   * Opens the ProductForm dialog in 'edit' mode with the selected product's data.
   * @param {object} product - The product to edit.
   */
  const handleOpenEditForm = product => {
    setCurrentProduct(product);
    setFormMode('edit');
    setOpenProductForm(true);
  };

  /**
   * Closes the ProductForm dialog.
   */
  const handleCloseProductForm = () => {
    setOpenProductForm(false);
    setCurrentProduct(null); // Clear current product selection
  };

  /**
   * Opens the delete confirmation dialog for the selected product.
   * @param {object} product - The product to delete.
   */
  const handleOpenDeleteDialog = product => {
    setCurrentProduct(product);
    setOpenDeleteDialog(true);
  };

  /**
   * Closes the delete confirmation dialog.
   */
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCurrentProduct(null); // Clear current product selection
  };

  /**
   * Handles the submission of the ProductForm (create or update).
   * @param {object} productData - The product data from the form.
   */
  const handleSubmitProductForm = async productData => {
    try {
      setLoading(true);

      if (formMode === 'create') {
        await ProductService.createProduct(productData);
      } else if (currentProduct?.id) {
        await ProductService.updateProduct(currentProduct.id, productData);
      }

      setOpenProductForm(false);
      fetchProducts();
    } catch (err) {
      console.error(`Error ${formMode === 'create' ? 'creating' : 'updating'} product:`, err);
      setError(
        `Fehler beim ${
          formMode === 'create' ? 'Erstellen' : 'Aktualisieren'
        } des Produkts. Bitte versuchen Sie es später erneut.`
      );
      setLoading(false);
    }
  };

  /**
   * Handles the confirmation of product deletion.
   */
  const handleDeleteProduct = async () => {
    if (!currentProduct?.id) return;

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

  // Calculate statistics based on the *currently loaded* products page
  // For global stats, this would need a separate API endpoint or calculation
  const productStats = {
    total: totalElements, // Use totalElements from API for accurate total count
    withStock: products.filter(p => (p.stockQuantity || 0) > 0).length,
    lowStock: products.filter(p => (p.stockQuantity || 0) > 0 && (p.stockQuantity || 0) < 10)
      .length,
    outOfStock: products.filter(p => (p.stockQuantity || 0) === 0).length,
  };

  /**
   * Renders the main table displaying products.
   * @returns {JSX.Element} The table component or loading/empty state.
   */
  const renderProductTable = () => {
    // Show loading spinner only if loading and no products are displayed yet
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
          <Table stickyHeader>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '& th': {
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
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
              {/* Display loading indicator overlay if loading more data */}
              {loading && products.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} sx={{ position: 'relative', p: 0, border: 0 }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: alpha(theme.palette.background.paper, 0.7),
                        zIndex: 1,
                      }}
                    >
                      <CircularProgress size={30} />
                    </Box>
                  </TableCell>
                </TableRow>
              )}

              {filteredProducts.map(product => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{
                    '&:nth-of-type(odd)': {
                      backgroundColor:
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.grey[100], 0.7)
                          : alpha(theme.palette.grey[800], 0.3),
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{product.id}</TableCell>
                  <TableCell sx={{ minWidth: 150 }}>{product.name}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell>{product.brand?.name || '-'}</TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      label={product.stockQuantity ?? 0}
                      color={
                        (product.stockQuantity ?? 0) === 0
                          ? 'error'
                          : (product.stockQuantity ?? 0) < 10
                            ? 'warning'
                            : 'success'
                      }
                      sx={{ fontWeight: 'medium' }}
                    />
                  </TableCell>
                  <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                    {(product.price ?? 0).toFixed(2)} €
                  </TableCell>
                  <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
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

              {/* Display message when no products match filters or exist */}
              {filteredProducts.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      Keine Produkte gefunden
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {searchQuery
                        ? 'Versuchen Sie andere Suchbegriffe oder löschen Sie die Filter.'
                        : "Fügen Sie ein neues Produkt mit dem 'Neues Produkt' Button hinzu."}
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
          sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
        />
      </>
    );
  };

  return (
    <Box sx={{ py: 3 }}>
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
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Statistics Cards */}
              <Grid item xs={12} sm={6} md={3}>
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
                      {loading && totalElements === 0 ? (
                        <CircularProgress size={24} />
                      ) : (
                        productStats.total
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
                      {loading && products.length === 0 ? (
                        <CircularProgress size={24} />
                      ) : (
                        productStats.withStock
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
                      {loading && products.length === 0 ? (
                        <CircularProgress size={24} />
                      ) : (
                        productStats.lowStock
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
                      {loading && products.length === 0 ? (
                        <CircularProgress size={24} />
                      ) : (
                        productStats.outOfStock
                      )}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>

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
                    placeholder="Produkte suchen (Name, Beschreibung, Kategorie, Marke)..."
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
                    disabled={loading && products.length === 0}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: { xs: 'flex-start', md: 'flex-end' },
                      gap: 1,
                      flexWrap: 'wrap',
                    }}
                  >
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

          {error && (
            <motion.div variants={itemVariants}>
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            </motion.div>
          )}

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

      {/* Dialogs */}
      <ProductForm
        open={openProductForm}
        onClose={handleCloseProductForm}
        onSubmit={handleSubmitProductForm}
        initialData={currentProduct}
        mode={formMode}
        key={formMode === 'edit' ? currentProduct?.id : 'create'}
      />

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteProduct}
        title="Produkt löschen"
        content={
          <>
            <Typography variant="body1" gutterBottom>
              Sind Sie sicher, dass Sie das Produkt "{currentProduct?.name || ''}" (ID:{' '}
              {currentProduct?.id || ''}) löschen möchten?
            </Typography>
            <Typography variant="body2" color="error" sx={{ mt: 2, fontWeight: 'medium' }}>
              Achtung: Diese Aktion kann nicht rückgängig gemacht werden. Das Löschen von Produkten
              kann zu Inkonsistenzen führen, wenn das Produkt in Bestellungen oder anderen
              Systembereichen verwendet wird. Erwägen Sie stattdessen, das Produkt als "nicht
              verfügbar" zu markieren.
            </Typography>
          </>
        }
        loading={loading}
      />
    </Box>
  );
};

export default ProductManagementPage;
