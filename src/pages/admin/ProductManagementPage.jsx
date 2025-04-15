import React, { useState, useEffect, useCallback } from 'react';
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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { ProductService } from '../../services';
import { ProductForm } from '../../components/admin';
import { DeleteConfirmationDialog } from '../../components/ui/modals';

/**
 * ProductManagementPage - Admin page to manage products
 */
const ProductManagementPage = () => {
  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Open form for creating a new product
  const handleOpenCreateForm = () => {
    setCurrentProduct({
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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Kategorie</TableCell>
                <TableCell>Marke</TableCell>
                <TableCell align="right">Preis (€)</TableCell>
                <TableCell align="center">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || '-'}</TableCell>
                  <TableCell>{product.brand?.name || '-'}</TableCell>
                  <TableCell align="right">{(product.price ?? 0).toFixed(2)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Bearbeiten">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditForm(product)}
                        disabled={loading}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Löschen">
                      <IconButton
                        color="error"
                        onClick={() => handleOpenDeleteDialog(product)}
                        disabled={loading}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {products.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Keine Produkte gefunden
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
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
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Produkt-Verwaltung
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreateForm}
          disabled={loading}
        >
          Neues Produkt
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card>
        <CardContent>{renderProductTable()}</CardContent>
      </Card>

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
        content="Sind Sie sicher, dass Sie dieses Produkt löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden."
        itemName={currentProduct?.name}
      />
    </Box>
  );
};

export default ProductManagementPage;
