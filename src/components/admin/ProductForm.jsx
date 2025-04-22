import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {
  Box,
  TextField,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Grid,
  Tooltip,
  Typography,
  Divider,
  Chip,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import {
  ProductCategoryService,
  BrandService,
  SupplierService,
  ProductService,
} from '../../services';
import { Form } from '../ui/forms';
import { Select } from '../ui/inputs';

/**
 * ProductForm component for adding and editing products
 */
const ProductForm = ({
  open,
  onClose,
  onSubmit,
  initialData = {
    name: '',
    description: '',
    price: 0,
    category: null,
    brand: null,
    supplier: null,
    standalone: true,
    connectedProducts: [],
  },
  mode = 'create',
}) => {
  // Form data
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    supplier: initialData?.supplier || '',
    standalone: initialData?.standalone !== false, // Default to true unless explicitly set to false
    connectedProducts: initialData?.connectedProducts || [],
  });

  // Options for dropdowns
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // Entity creation states
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [creatingSupplier, setCreatingSupplier] = useState(false);

  // New entity names
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');

  // New supplier fields
  const [newSupplierStreet, setNewSupplierStreet] = useState('');
  const [newSupplierStreetNo, setNewSupplierStreetNo] = useState('');
  const [newSupplierCity, setNewSupplierCity] = useState('');
  const [newSupplierZip, setNewSupplierZip] = useState('');
  const [newSupplierCountry, setNewSupplierCountry] = useState('Deutschland');

  // Load data and reset form when dialog opens
  useEffect(() => {
    if (open) {
      // Reset form data
      setFormData({
        id: initialData?.id || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        category: initialData?.category || '',
        brand: initialData?.brand || '',
        supplier: initialData?.supplier || '',
        standalone: initialData?.standalone !== false, // Default to true unless explicitly set to false
        connectedProducts: initialData?.connectedProducts || [],
      });

      // Fetch options
      fetchOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialData]);

  // Fetch dropdown options
  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const [categoriesData, brandsData, suppliersData, productsData] = await Promise.all([
        ProductCategoryService.getProductCategories({ page: 0, size: 100 }),
        BrandService.getBrands({ page: 0, size: 100 }),
        SupplierService.getSuppliers({ page: 0, size: 100 }),
        ProductService.getAllProductsForSelection(),
      ]);

      setCategories(categoriesData.content || []);
      setBrands(brandsData.content || []);
      setSuppliers(suppliersData.content || []);

      // Filter out the current product (if in edit mode)
      const filteredProducts = initialData?.id
        ? productsData.filter(p => p.id !== initialData.id)
        : productsData;
      setAvailableProducts(filteredProducts);
    } catch (err) {
      console.error('Error fetching options:', err);
    } finally {
      setLoadingOptions(false);
    }
  };

  // Format dropdown options
  const formatCategoryOptions = () => {
    return categories.map(category => ({
      value: category,
      label: category?.name || '',
      key: `category-${category?.id || Math.random()}`,
    }));
  };

  const formatBrandOptions = () => {
    return brands.map(brand => ({
      value: brand,
      label: brand?.name || '',
      key: `brand-${brand?.id || Math.random()}`,
    }));
  };

  const formatSupplierOptions = () => {
    return suppliers.map(supplier => ({
      value: supplier,
      label: supplier?.legalName || supplier?.name || '',
      key: `supplier-${supplier?.id || Math.random()}`,
    }));
  };

  const formatProductOptions = () => {
    return availableProducts.map(product => ({
      value: product,
      label: product?.name || '',
      key: `product-${product?.id || Math.random()}`,
    }));
  };

  // Handle text field changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    // Convert numeric values
    const parsedValue = name === 'price' ? parseFloat(value) || 0 : value;

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  // Handle dropdown changes
  const handleSelectChange = e => {
    const { name, value } = e.target;

    // Make sure we're capturing the full object for our references
    // For our Select components, value is the full object (category, brand, supplier)
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Create new category
  const handleCreateCategory = async () => {
    try {
      if (!newCategoryName.trim()) return;

      const categoryData = { name: newCategoryName.trim() };
      const newCategory = await ProductCategoryService.createProductCategory(categoryData);

      // Add to categories list
      setCategories(prev => [...prev, newCategory]);

      // Update form data
      setFormData({
        ...formData,
        category: newCategory,
      });

      // Reset state
      setNewCategoryName('');
      setCreatingCategory(false);
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  // Create new brand
  const handleCreateBrand = async () => {
    try {
      if (!newBrandName.trim()) return;

      const brandData = { name: newBrandName.trim() };
      const newBrand = await BrandService.createBrand(brandData);

      // Add to brands list
      setBrands(prev => [...prev, newBrand]);

      // Update form data
      setFormData({
        ...formData,
        brand: newBrand,
      });

      // Reset state
      setNewBrandName('');
      setCreatingBrand(false);
    } catch (err) {
      console.error('Error creating brand:', err);
    }
  };

  // Create new supplier
  const handleCreateSupplier = async () => {
    try {
      if (!newSupplierName.trim()) return;

      const supplierData = {
        legalName: newSupplierName.trim(),
        street: newSupplierStreet,
        streetNo: newSupplierStreetNo,
        city: newSupplierCity,
        zip: newSupplierZip,
        country: newSupplierCountry,
      };
      const newSupplier = await SupplierService.createSupplier(supplierData);

      // Add to suppliers list
      setSuppliers(prev => [...prev, newSupplier]);

      // Update form data
      setFormData({
        ...formData,
        supplier: newSupplier,
      });

      // Reset state
      setNewSupplierName('');
      setNewSupplierStreet('');
      setNewSupplierStreetNo('');
      setNewSupplierCity('');
      setNewSupplierZip('');
      setNewSupplierCountry('');
      setCreatingSupplier(false);
    } catch (err) {
      console.error('Error creating supplier:', err);
    }
  };

  // Handle connected products changes
  const handleConnectedProductSelect = product => {
    if (!product) return;

    // Add the product if not already in the list
    if (!formData.connectedProducts.some(p => p.id === product.id)) {
      setFormData(prev => ({
        ...prev,
        connectedProducts: [...prev.connectedProducts, product],
        standalone: false, // If connected products are added, set standalone to false
      }));
    }
  };

  // Remove a connected product
  const handleRemoveConnectedProduct = productId => {
    setFormData(prev => ({
      ...prev,
      connectedProducts: prev.connectedProducts.filter(p => p.id !== productId),
      // If no connected products left, standalone can be true
      standalone:
        prev.connectedProducts.filter(p => p.id !== productId).length === 0
          ? prev.standalone
          : false,
    }));
  };

  // Handle standalone toggle
  const handleStandaloneToggle = e => {
    const isStandalone = e.target.checked;
    setFormData(prev => ({
      ...prev,
      standalone: isStandalone,
    }));
  };

  // Form validation
  const isFormValid = () => {
    const nameValid = formData?.name?.trim() !== '';
    const priceValid = formData?.price >= 0;
    const categoryValid = Boolean(formData?.category);
    const brandValid = Boolean(formData?.brand);
    const supplierValid = Boolean(formData?.supplier);

    // ID is optional, so we don't validate it

    return nameValid && priceValid && categoryValid && brandValid && supplierValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!isFormValid()) return;

    // Create different submission data based on mode
    let submitData = {
      ...formData,
      // Ensure proper field mapping for backend
      productCategory: formData.category, // Backend expects 'productCategory', not 'category'
      defaultSupplier: formData.supplier, // Backend expects 'defaultSupplier', not 'supplier'
    };

    // Only add price history for new products or when price changed in edit mode
    if (
      mode === 'create' ||
      (mode === 'edit' && initialData.price !== parseFloat(formData.price))
    ) {
      submitData.priceHistories = [
        {
          timestamp: new Date(),
          price: parseFloat(formData.price) || 0,
          purchasePrice: (parseFloat(formData.price) || 0) * 0.7, // Default purchase price
          supplier: formData.supplier, // Use the selected supplier
        },
      ];
    }

    onSubmit(submitData);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {mode === 'create' ? 'Neues Produkt erstellen' : 'Produkt bearbeiten'}
        </DialogTitle>
        <DialogContent>
          {loadingOptions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Form sx={{ mt: 2 }}>
              <TextField
                autoFocus
                name="name"
                label="Name"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleInputChange}
                required
              />

              {mode === 'create' && (
                <TextField
                  name="id"
                  label="ID (optional)"
                  fullWidth
                  variant="outlined"
                  value={formData.id}
                  onChange={handleInputChange}
                  helperText="Wenn keine ID angegeben wird, wird automatisch eine generiert"
                />
              )}

              <TextField
                name="description"
                label="Beschreibung"
                fullWidth
                variant="outlined"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={3}
              />

              <TextField
                name="price"
                label="Preis (€)"
                type="number"
                fullWidth
                variant="outlined"
                value={formData.price}
                onChange={handleInputChange}
                inputProps={{ min: 0, step: 0.01 }}
                required
              />

              {/* Category Selection with Add Button */}
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Select
                    name="category"
                    label="Kategorie"
                    value={formData.category}
                    onChange={handleSelectChange}
                    options={formatCategoryOptions()}
                    placeholder="Kategorie auswählen"
                    required
                    disabled={loadingOptions}
                  />
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Neue Kategorie erstellen">
                    <IconButton color="primary" onClick={() => setCreatingCategory(true)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {/* Brand Selection with Add Button */}
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Select
                    name="brand"
                    label="Marke"
                    value={formData.brand}
                    onChange={handleSelectChange}
                    options={formatBrandOptions()}
                    placeholder="Marke auswählen"
                    required
                    disabled={loadingOptions}
                  />
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Neue Marke erstellen">
                    <IconButton color="primary" onClick={() => setCreatingBrand(true)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {/* Supplier Selection with Add Button */}
              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Select
                    name="supplier"
                    label="Lieferant"
                    value={formData.supplier}
                    onChange={handleSelectChange}
                    options={formatSupplierOptions()}
                    placeholder="Lieferant auswählen"
                    required
                    disabled={loadingOptions}
                  />
                </Grid>
                <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                  <Tooltip title="Neuen Lieferanten erstellen">
                    <IconButton color="primary" onClick={() => setCreatingSupplier(true)}>
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>

              {/* Divider for Connected Products Section */}
              <Divider sx={{ my: 2 }}>
                <Chip label="Verbundene Produkte" />
              </Divider>

              {/* Standalone Switch */}
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.standalone}
                    onChange={handleStandaloneToggle}
                    color="primary"
                  />
                }
                label="Dieses Produkt kann einzeln verkauft werden"
              />

              {/* Connected Products Dropdown */}
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Wählen Sie Produkte aus, die automatisch mit diesem Produkt verkauft werden
                    sollen:
                  </Typography>
                  <Select
                    name="connectedProduct"
                    label="Verbundenes Produkt hinzufügen"
                    onChange={e => handleConnectedProductSelect(e.target.value)}
                    options={formatProductOptions()}
                    placeholder="Produkt auswählen"
                    disabled={loadingOptions}
                    value=""
                  />
                </Grid>
              </Grid>

              {/* Connected Products List */}
              {formData.connectedProducts.length > 0 && (
                <Box sx={{ mt: 2, border: 1, borderColor: 'divider', borderRadius: 1 }}>
                  <List dense>
                    {formData.connectedProducts.map(product => (
                      <ListItem key={product.id}>
                        <ListItemText
                          primary={product.name}
                          secondary={`${product.price.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                          })}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveConnectedProduct(product.id)}
                            color="error"
                            size="small"
                          >
                            <RemoveCircleOutlineIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Form>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Abbrechen</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!isFormValid() || loadingOptions}
          >
            {mode === 'create' ? 'Erstellen' : 'Aktualisieren'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Category Dialog */}
      <Dialog open={creatingCategory} onClose={() => setCreatingCategory(false)}>
        <DialogTitle>Neue Kategorie erstellen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="newCategoryName"
            label="Kategoriename"
            type="text"
            fullWidth
            variant="outlined"
            value={newCategoryName}
            onChange={e => setNewCategoryName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatingCategory(false)}>Abbrechen</Button>
          <Button
            onClick={handleCreateCategory}
            variant="contained"
            disabled={!newCategoryName.trim()}
          >
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Brand Dialog */}
      <Dialog open={creatingBrand} onClose={() => setCreatingBrand(false)}>
        <DialogTitle>Neue Marke erstellen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="newBrandName"
            label="Markenname"
            type="text"
            fullWidth
            variant="outlined"
            value={newBrandName}
            onChange={e => setNewBrandName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatingBrand(false)}>Abbrechen</Button>
          <Button onClick={handleCreateBrand} variant="contained" disabled={!newBrandName.trim()}>
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Supplier Dialog */}
      <Dialog open={creatingSupplier} onClose={() => setCreatingSupplier(false)}>
        <DialogTitle>Neuer Lieferant erstellen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="newSupplierName"
            label="Lieferantenname"
            type="text"
            fullWidth
            variant="outlined"
            value={newSupplierName}
            onChange={e => setNewSupplierName(e.target.value)}
          />
          <TextField
            margin="dense"
            name="newSupplierStreet"
            label="Straße"
            type="text"
            fullWidth
            variant="outlined"
            value={newSupplierStreet}
            onChange={e => setNewSupplierStreet(e.target.value)}
          />
          <TextField
            margin="dense"
            name="newSupplierStreetNo"
            label="Hausnummer"
            type="text"
            fullWidth
            variant="outlined"
            value={newSupplierStreetNo}
            onChange={e => setNewSupplierStreetNo(e.target.value)}
          />
          <TextField
            margin="dense"
            name="newSupplierCity"
            label="Ort"
            type="text"
            fullWidth
            variant="outlined"
            value={newSupplierCity}
            onChange={e => setNewSupplierCity(e.target.value)}
          />
          <TextField
            margin="dense"
            name="newSupplierZip"
            label="PLZ"
            type="text"
            fullWidth
            variant="outlined"
            value={newSupplierZip}
            onChange={e => setNewSupplierZip(e.target.value)}
          />
          <TextField
            margin="dense"
            name="newSupplierCountry"
            label="Land"
            type="text"
            fullWidth
            variant="outlined"
            value={newSupplierCountry}
            onChange={e => setNewSupplierCountry(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreatingSupplier(false)}>Abbrechen</Button>
          <Button
            onClick={handleCreateSupplier}
            variant="contained"
            disabled={
              !newSupplierName.trim() ||
              !newSupplierStreet.trim() ||
              !newSupplierStreetNo.trim() ||
              !newSupplierCity.trim() ||
              !newSupplierZip.trim() ||
              !newSupplierCountry.trim()
            }
          >
            Erstellen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

ProductForm.propTypes = {
  /**
   * Dialog open state
   */
  open: PropTypes.bool.isRequired,
  /**
   * Callback when dialog is closed
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Callback when form is submitted
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Initial data for the form
   */
  initialData: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    category: PropTypes.object,
    brand: PropTypes.object,
    supplier: PropTypes.object,
    standalone: PropTypes.bool,
    connectedProducts: PropTypes.array,
  }),
  /**
   * Form mode - 'create' or 'edit'
   */
  mode: PropTypes.oneOf(['create', 'edit']),
};

export default ProductForm;
