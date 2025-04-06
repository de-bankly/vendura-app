import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import {
  ProductService,
  ProductCategoryService,
  BrandService,
  SupplierService,
} from '../../services';

/**
 * ProductManagementPage - Admin page to manage products
 */
const ProductManagementPage = () => {
  // State for products
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for categories, brands, and suppliers
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);

  // Dialog states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Form states
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    brandId: '',
    supplierId: '',
  });

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

  // Fetch options (categories, brands, suppliers)
  const fetchOptions = useCallback(async () => {
    try {
      setLoadingOptions(true);

      const [categoriesData, brandsData, suppliersData] = await Promise.all([
        ProductCategoryService.getProductCategories({ page: 0, size: 100 }),
        BrandService.getBrands({ page: 0, size: 100 }),
        SupplierService.getSuppliers({ page: 0, size: 100 }),
      ]);

      setCategories(categoriesData.content || []);
      setBrands(brandsData.content || []);
      setSuppliers(suppliersData.content || []);
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Fehler beim Laden der Optionen. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  // Load products and options on component mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle form input change
  const handleInputChange = e => {
    const { name, value } = e.target;

    // Convert numeric values
    const parsedValue = name === 'price' ? parseFloat(value) || 0 : value;

    setCurrentProduct({
      ...currentProduct,
      [name]: parsedValue,
    });
  };

  // Open create dialog
  const handleOpenCreateDialog = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      brandId: '',
      supplierId: '',
    });
    setOpenCreateDialog(true);
  };

  // Close create dialog
  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false);
  };

  // Open edit dialog
  const handleOpenEditDialog = product => {
    setCurrentProduct({
      ...product,
      categoryId: product.category?.id || '',
      brandId: product.brand?.id || '',
      supplierId: product.supplier?.id || '',
    });
    setOpenEditDialog(true);
  };

  // Close edit dialog
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  // Open delete dialog
  const handleOpenDeleteDialog = product => {
    setCurrentProduct(product);
    setOpenDeleteDialog(true);
  };

  // Close delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Prepare product data for API
  const prepareProductData = data => {
    return {
      ...data,
      category: categories.find(cat => cat.id === data.categoryId) || null,
      brand: brands.find(brand => brand.id === data.brandId) || null,
      supplier: suppliers.find(supplier => supplier.id === data.supplierId) || null,
    };
  };

  // Create product
  const handleCreateProduct = async () => {
    try {
      setLoading(true);
      const productData = prepareProductData(currentProduct);
      await ProductService.createProduct(productData);
      handleCloseCreateDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error creating product:', err);
      setError('Fehler beim Erstellen des Produkts. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  // Update product
  const handleUpdateProduct = async () => {
    try {
      setLoading(true);
      const productData = prepareProductData(currentProduct);
      await ProductService.updateProduct(currentProduct.id, productData);
      handleCloseEditDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      setError('Fehler beim Aktualisieren des Produkts. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    try {
      setLoading(true);
      await ProductService.deleteProduct(currentProduct.id);
      handleCloseDeleteDialog();
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setError('Fehler beim Löschen des Produkts. Bitte versuchen Sie es später erneut.');
      setLoading(false);
    }
  };

  // Check if form is valid
  const isFormValid = product => {
    return (
      product.name.trim() !== '' &&
      product.price > 0 &&
      product.categoryId !== '' &&
      product.brandId !== '' &&
      product.supplierId !== ''
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
          onClick={handleOpenCreateDialog}
          disabled={loading || loadingOptions}
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
        <CardContent>
          {loading && products.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
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
                          <IconButton
                            color="primary"
                            onClick={() => handleOpenEditDialog(product)}
                            disabled={loading}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleOpenDeleteDialog(product)}
                            disabled={loading}
                          >
                            <DeleteIcon />
                          </IconButton>
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
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog - Shared form */}
      <Dialog
        open={openCreateDialog || openEditDialog}
        onClose={openCreateDialog ? handleCloseCreateDialog : handleCloseEditDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {openCreateDialog ? 'Neues Produkt erstellen' : 'Produkt bearbeiten'}
        </DialogTitle>
        <DialogContent>
          {loadingOptions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                fullWidth
                variant="outlined"
                value={currentProduct.name}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                name="description"
                label="Beschreibung"
                fullWidth
                variant="outlined"
                value={currentProduct.description}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />

              <TextField
                margin="dense"
                name="price"
                label="Preis (€)"
                type="number"
                fullWidth
                variant="outlined"
                value={currentProduct.price}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="category-label">Kategorie</InputLabel>
                <Select
                  labelId="category-label"
                  name="categoryId"
                  value={currentProduct.categoryId}
                  label="Kategorie"
                  onChange={handleInputChange}
                >
                  {categories.map(category => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="brand-label">Marke</InputLabel>
                <Select
                  labelId="brand-label"
                  name="brandId"
                  value={currentProduct.brandId}
                  label="Marke"
                  onChange={handleInputChange}
                >
                  {brands.map(brand => (
                    <MenuItem key={brand.id} value={brand.id}>
                      {brand.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel id="supplier-label">Lieferant</InputLabel>
                <Select
                  labelId="supplier-label"
                  name="supplierId"
                  value={currentProduct.supplierId}
                  label="Lieferant"
                  onChange={handleInputChange}
                >
                  {suppliers.map(supplier => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={openCreateDialog ? handleCloseCreateDialog : handleCloseEditDialog}>
            Abbrechen
          </Button>
          <Button
            onClick={openCreateDialog ? handleCreateProduct : handleUpdateProduct}
            variant="contained"
            disabled={!isFormValid(currentProduct) || loadingOptions}
          >
            {openCreateDialog ? 'Erstellen' : 'Aktualisieren'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Produkt löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Sind Sie sicher, dass Sie das Produkt "{currentProduct.name}" löschen möchten? Diese
            Aktion kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Abbrechen</Button>
          <Button onClick={handleDeleteProduct} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductManagementPage;
