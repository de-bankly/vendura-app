import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Typography,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  FormHelperText,
  Grid,
  Tooltip,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Form } from '../ui/forms';
import { Select } from '../ui/inputs';
import { ProductCategoryService, BrandService, SupplierService } from '../../services';

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
  },
  mode = 'create',
}) => {
  // Form data
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    price: initialData?.price || 0,
    category: initialData?.category || '',
    brand: initialData?.brand || '',
    supplier: initialData?.supplier || '',
  });

  // Options for dropdowns
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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

  // Load data when form opens
  useEffect(() => {
    if (open) {
      fetchOptions();
    }
  }, [open]);

  // Reset form when initialData changes
  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      category: initialData?.category || '',
      brand: initialData?.brand || '',
      supplier: initialData?.supplier || '',
    });
  }, [initialData]);

  // Fetch dropdown options
  const fetchOptions = async () => {
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

  // Form validation
  const isFormValid = () => {
    const nameValid = formData?.name?.trim() !== '';
    const priceValid = formData?.price >= 0;
    const categoryValid = Boolean(formData?.category);
    const brandValid = Boolean(formData?.brand);
    const supplierValid = Boolean(formData?.supplier);

    return nameValid && priceValid && categoryValid && brandValid && supplierValid;
  };

  // Handle form submission
  const handleSubmit = () => {
    onSubmit(formData);
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
  }),
  /**
   * Form mode - 'create' or 'edit'
   */
  mode: PropTypes.oneOf(['create', 'edit']),
};

export default ProductForm;
