import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
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
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { SupplierService, ProductService } from '../../services';

/**
 * SupplierOrderForm component for creating or editing supplier orders
 */
const SupplierOrderForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const [formData, setFormData] = useState({
    supplier: null,
    purchaseOrderNumber: '',
    expectedDeliveryDate: null,
    notes: '',
    positions: [],
    orderStatus: '',
    isAutomaticOrder: false,
  });

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch suppliers
        const suppliersResponse = await SupplierService.getSuppliers();
        setSuppliers(suppliersResponse.content || []);

        // Fetch products
        const productsResponse = await ProductService.getProducts();
        setProducts(productsResponse.content || []);

        // If editing, populate form with initial data
        if (initialData) {
          setFormData({
            supplier: initialData.supplier || null,
            purchaseOrderNumber: initialData.purchaseOrderNumber || '',
            expectedDeliveryDate: initialData.expectedDeliveryDate
              ? new Date(initialData.expectedDeliveryDate)
              : null,
            notes: initialData.notes || '',
            positions: initialData.positions || [],
            orderStatus: initialData.orderStatus === 'PLACED' ? '' : initialData.orderStatus || '',
            isAutomaticOrder: initialData.isAutomaticOrder || false,
          });
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading form data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [initialData]);

  const handleChange = field => event => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });

    // Clear field error when user updates the field
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleSupplierChange = event => {
    const supplierId = event.target.value;
    const selectedSupplier = suppliers.find(s => s.id === supplierId);

    setFormData(prevData => ({
      ...prevData,
      supplier: selectedSupplier,
    }));

    if (errors.supplier) {
      setErrors({
        ...errors,
        supplier: null,
      });
    }
  };

  const handleDateChange = date => {
    setFormData({
      ...formData,
      expectedDeliveryDate: date,
    });

    if (errors.expectedDeliveryDate) {
      setErrors({
        ...errors,
        expectedDeliveryDate: null,
      });
    }
  };

  const handleStatusChange = event => {
    setFormData({
      ...formData,
      orderStatus: event.target.value,
    });
  };

  const addProductPosition = () => {
    setFormData({
      ...formData,
      positions: [
        ...formData.positions,
        {
          product: null,
          amount: 1,
        },
      ],
    });
  };

  const removeProductPosition = index => {
    const updatedPositions = [...formData.positions];
    updatedPositions.splice(index, 1);

    setFormData({
      ...formData,
      positions: updatedPositions,
    });
  };

  const handleProductChange = (index, event) => {
    const productId = event.target.value;
    const selectedProduct = products.find(p => p.id === productId);

    const updatedPositions = [...formData.positions];
    updatedPositions[index] = {
      ...updatedPositions[index],
      product: selectedProduct,
    };

    setFormData({
      ...formData,
      positions: updatedPositions,
    });
  };

  const handleAmountChange = (index, event) => {
    const amount = parseInt(event.target.value) || 1;

    const updatedPositions = [...formData.positions];
    updatedPositions[index] = {
      ...updatedPositions[index],
      amount: Math.max(1, amount),
    };

    setFormData({
      ...formData,
      positions: updatedPositions,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.supplier) {
      newErrors.supplier = 'Please select a supplier';
    }

    if (formData.positions.length === 0) {
      newErrors.positions = 'Please add at least one product';
    } else {
      const hasInvalidPositions = formData.positions.some(pos => !pos.product);
      if (hasInvalidPositions) {
        newErrors.positions = 'Please select a product for all positions';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (validateForm()) {
      // Convert empty orderStatus to "PLACED" before submitting
      const dataToSubmit = {
        ...formData,
        orderStatus: formData.orderStatus === '' ? 'PLACED' : formData.orderStatus,
      };

      onSubmit(dataToSubmit);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Supplier Order' : 'Create New Supplier Order'}
      </Typography>

      <Grid container spacing={3}>
        {/* Supplier Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.supplier}>
            <InputLabel id="supplier-label">Supplier *</InputLabel>
            <Select
              labelId="supplier-label"
              value={formData.supplier ? formData.supplier.id : ''}
              onChange={handleSupplierChange}
              label="Supplier *"
              disabled={isEditing}
            >
              {suppliers.map(supplier => (
                <MenuItem key={supplier.id} value={supplier.id}>
                  {supplier.legalName}
                </MenuItem>
              ))}
            </Select>
            {errors.supplier && (
              <Typography variant="caption" color="error">
                {errors.supplier}
              </Typography>
            )}
          </FormControl>
        </Grid>

        {/* Purchase Order Number */}
        <Grid item xs={12} md={6}>
          <TextField
            label="Purchase Order Number"
            value={formData.purchaseOrderNumber}
            onChange={handleChange('purchaseOrderNumber')}
            fullWidth
            placeholder="Auto-generated if empty"
          />
        </Grid>

        {/* Expected Delivery Date */}
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Expected Delivery Date"
              value={formData.expectedDeliveryDate}
              onChange={handleDateChange}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </LocalizationProvider>
        </Grid>

        {/* Order Status */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Order Status</InputLabel>
            <Select
              labelId="status-label"
              value={formData.orderStatus}
              onChange={handleStatusChange}
              label="Order Status"
            >
              <MenuItem value="">Select a status</MenuItem>
              <MenuItem value="PLACED">Placed</MenuItem>
              <MenuItem value="SHIPPED">Shipped</MenuItem>
              <MenuItem value="DELIVERED">Delivered</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Notes */}
        <Grid item xs={12}>
          <TextField
            label="Notes"
            value={formData.notes}
            onChange={handleChange('notes')}
            fullWidth
            multiline
            rows={3}
            placeholder="Additional notes about this order"
          />
        </Grid>

        {/* Products Selection */}
        <Grid item xs={12}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}
          >
            <Typography variant="h6">Order Items</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={addProductPosition}
              size="small"
            >
              Add Product
            </Button>
          </Box>

          {errors.positions && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {errors.positions}
            </Typography>
          )}

          {formData.positions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
              No products added yet. Click "Add Product" to add items to this order.
            </Typography>
          ) : (
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.positions.map((position, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <FormControl fullWidth size="small">
                          <Select
                            value={position.product ? position.product.id : ''}
                            onChange={e => handleProductChange(index, e)}
                            displayEmpty
                          >
                            <MenuItem value="" disabled>
                              Select a product
                            </MenuItem>
                            {products.map(product => (
                              <MenuItem key={product.id} value={product.id}>
                                {product.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center">
                        <TextField
                          type="number"
                          value={position.amount}
                          onChange={e => handleAmountChange(index, e)}
                          size="small"
                          InputProps={{ inputProps: { min: 1 } }}
                          sx={{ width: '80px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton color="error" onClick={() => removeProductPosition(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={formData.positions.length === 0}
            >
              {isEditing ? 'Update Order' : 'Create Order'}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

SupplierOrderForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
};

SupplierOrderForm.defaultProps = {
  initialData: null,
  isEditing: false,
};

export default SupplierOrderForm;
