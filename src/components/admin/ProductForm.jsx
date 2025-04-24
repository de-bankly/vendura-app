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
 * ProductForm component for adding and editing products.
 * Handles data fetching for related entities (categories, brands, suppliers, products),
 * allows inline creation of new categories, brands, and suppliers,
 * manages connected products, and handles form submission.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {Function} props.onClose - Callback function invoked when the dialog is closed.
 * @param {Function} props.onSubmit - Callback function invoked when the form is submitted with valid data.
 * @param {object} [props.initialData] - Initial data to populate the form, used for editing.
 * @param {string|number} [props.initialData.id] - The product ID (optional for create, required for edit).
 * @param {string} [props.initialData.name=''] - The product name.
 * @param {string} [props.initialData.description=''] - The product description.
 * @param {number} [props.initialData.price=0] - The product price.
 * @param {object|null} [props.initialData.category=null] - The product category object.
 * @param {object|null} [props.initialData.brand=null] - The product brand object.
 * @param {object|null} [props.initialData.supplier=null] - The product supplier object.
 * @param {boolean} [props.initialData.standalone=false] - Indicates if the product is standalone.
 * @param {Array<object>} [props.initialData.connectedProducts=[]] - List of connected products.
 * @param {'create'|'edit'} [props.mode='create'] - The mode of the form ('create' or 'edit').
 * @returns {React.ReactElement} The ProductForm component.
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
    standalone: false,
    connectedProducts: [],
  },
  mode = 'create',
}) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    supplier: initialData?.supplier || '',
    standalone: initialData?.standalone || false,
    connectedProducts: initialData?.connectedProducts || [],
  });

  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [creatingCategory, setCreatingCategory] = useState(false);
  const [creatingBrand, setCreatingBrand] = useState(false);
  const [creatingSupplier, setCreatingSupplier] = useState(false);

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierStreet, setNewSupplierStreet] = useState('');
  const [newSupplierStreetNo, setNewSupplierStreetNo] = useState('');
  const [newSupplierCity, setNewSupplierCity] = useState('');
  const [newSupplierZip, setNewSupplierZip] = useState('');
  const [newSupplierCountry, setNewSupplierCountry] = useState('Deutschland');

  useEffect(() => {
    if (open) {
      setFormData({
        id: initialData?.id || '',
        name: initialData?.name || '',
        description: initialData?.description || '',
        price: initialData?.price || 0,
        category: initialData?.category || '',
        brand: initialData?.brand || '',
        supplier: initialData?.supplier || '',
        standalone: initialData?.standalone || false,
        connectedProducts: initialData?.connectedProducts || [],
      });
      fetchOptions();
    }
  }, [open, initialData]);

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

  const handleInputChange = e => {
    const { name, value } = e.target;
    const parsedValue = name === 'price' ? parseFloat(value) || 0 : value;

    setFormData({
      ...formData,
      [name]: parsedValue,
    });
  };

  const handleSelectChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateCategory = async () => {
    try {
      if (!newCategoryName.trim()) return;

      const categoryData = { name: newCategoryName.trim() };
      const newCategory = await ProductCategoryService.createProductCategory(categoryData);

      setCategories(prev => [...prev, newCategory]);
      setFormData({
        ...formData,
        category: newCategory,
      });

      setNewCategoryName('');
      setCreatingCategory(false);
    } catch (err) {
      console.error('Error creating category:', err);
    }
  };

  const handleCreateBrand = async () => {
    try {
      if (!newBrandName.trim()) return;

      const brandData = { name: newBrandName.trim() };
      const newBrand = await BrandService.createBrand(brandData);

      setBrands(prev => [...prev, newBrand]);
      setFormData({
        ...formData,
        brand: newBrand,
      });

      setNewBrandName('');
      setCreatingBrand(false);
    } catch (err) {
      console.error('Error creating brand:', err);
    }
  };

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

      setSuppliers(prev => [...prev, newSupplier]);
      setFormData({
        ...formData,
        supplier: newSupplier,
      });

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

  const handleConnectedProductSelect = product => {
    if (!product) return;

    if (!formData.connectedProducts.some(p => p.id === product.id)) {
      setFormData(prev => ({
        ...prev,
        connectedProducts: [...prev.connectedProducts, product],
        standalone: false,
      }));
    }
  };

  const handleRemoveConnectedProduct = productId => {
    setFormData(prev => ({
      ...prev,
      connectedProducts: prev.connectedProducts.filter(p => p.id !== productId),
      standalone:
        prev.connectedProducts.filter(p => p.id !== productId).length === 0
          ? prev.standalone
          : false,
    }));
  };

  const handleStandaloneToggle = e => {
    const isStandalone = e.target.checked;
    setFormData(prev => ({
      ...prev,
      standalone: isStandalone,
    }));
  };

  const isFormValid = () => {
    const nameValid = formData?.name?.trim() !== '';
    const priceValid = formData?.price >= 0;
    const categoryValid = Boolean(formData?.category);
    const brandValid = Boolean(formData?.brand);
    const supplierValid = Boolean(formData?.supplier);

    return nameValid && priceValid && categoryValid && brandValid && supplierValid;
  };

  const handleSubmit = () => {
    if (!isFormValid()) return;

    let submitData = {
      ...formData,
      productCategory: formData.category,
      defaultSupplier: formData.supplier,
    };

    if (submitData.id === '') {
      submitData.id = null;
    }

    if (
      mode === 'create' ||
      (mode === 'edit' && initialData.price !== parseFloat(formData.price))
    ) {
      submitData.priceHistories = [
        {
          timestamp: new Date(),
          price: parseFloat(formData.price) || 0,
          purchasePrice: (parseFloat(formData.price) || 0) * 0.7,
          supplier: formData.supplier,
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
                  label="ID / EAN Barcode (optional)"
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

              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Select
                    name="category"
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

              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Select
                    name="brand"
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

              <Grid container spacing={1}>
                <Grid item xs={10}>
                  <Select
                    name="supplier"
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

              <Divider sx={{ my: 2 }}>
                <Chip label="Verbundene Produkte" />
              </Divider>

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.standalone}
                    onChange={handleStandaloneToggle}
                    color="primary"
                  />
                }
                label="Standalone Produkt (Lagerbestand wird bei Verkauf nicht verändert)"
              />

              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Wählen Sie Produkte aus, die automatisch mit diesem Produkt verkauft werden
                    sollen:
                  </Typography>
                  <Select
                    name="connectedProduct"
                    onChange={e => handleConnectedProductSelect(e.target.value)}
                    options={formatProductOptions()}
                    placeholder="Produkt auswählen"
                    disabled={loadingOptions}
                    value=""
                  />
                </Grid>
              </Grid>

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
   * Controls the visibility of the dialog.
   */
  open: PropTypes.bool.isRequired,
  /**
   * Callback function invoked when the dialog is closed.
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Callback function invoked when the form is submitted with valid data.
   * Receives the prepared form data object as an argument.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Initial data to populate the form, typically used when editing an existing product.
   * If not provided, the form initializes with default empty/zero values.
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
   * Specifies the mode of the form, influencing behavior like title text and submission logic.
   * Defaults to 'create'.
   */
  mode: PropTypes.oneOf(['create', 'edit']),
};

export default ProductForm;
