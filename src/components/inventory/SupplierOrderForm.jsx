import { Add as AddIcon, Delete as DeleteIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Divider,
  useTheme,
  alpha,
  Tooltip,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

import { SupplierService, ProductService } from '../../services';
import { Select } from '../ui/inputs';

/**
 * SupplierOrderForm component for creating or editing supplier orders.
 * Handles fetching necessary data (suppliers, products), form state management,
 * validation, and submission.
 *
 * @param {object} props - The component props.
 * @param {object} [props.initialData=null] - Initial data for editing an existing order.
 * @param {Function} props.onSubmit - Callback function executed when the form is submitted successfully.
 * @param {Function} props.onCancel - Callback function executed when the cancel button is clicked.
 * @param {boolean} [props.isEditing=false] - Flag indicating if the form is in edit mode.
 * @returns {React.ReactElement} The SupplierOrderForm component.
 */
const SupplierOrderForm = ({ initialData, onSubmit, onCancel, isEditing }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    supplier: null,
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

        const suppliersResponse = await SupplierService.getSuppliers();
        setSuppliers(suppliersResponse.content || []);

        const productsResponse = await ProductService.getProducts();
        setProducts(productsResponse.content || []);

        if (initialData) {
          setFormData({
            supplier: initialData.supplier || null,
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

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleSupplierChange = e => {
    const supplierId = e.target.value;
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

  const handleStatusChange = e => {
    setFormData({
      ...formData,
      orderStatus: e.target.value,
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

  const handleProductChange = (index, e) => {
    const productId = e.target.value;
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
      const dataToSubmit = {
        ...formData,
        orderStatus: formData.orderStatus === '' ? 'PLACED' : formData.orderStatus,
      };

      onSubmit(dataToSubmit);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Daten werden geladen...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" fontWeight={600}>
          {isEditing ? 'Bestellung bearbeiten' : 'Neue Lieferantenbestellung'}
        </Typography>
        <Tooltip title="Schließen">
          <IconButton
            onClick={onCancel}
            size="small"
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: theme.palette.error.main,
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.supplier}>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                Lieferant *
              </Typography>
              <Select
                value={formData.supplier ? formData.supplier.id : ''}
                onChange={handleSupplierChange}
                options={suppliers.map(supplier => ({
                  value: supplier.id,
                  label: supplier.legalName,
                }))}
                error={!!errors.supplier}
                helperText={errors.supplier}
                disabled={isEditing}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                Erwartetes Lieferdatum
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={formData.expectedDeliveryDate}
                  onChange={handleDateChange}
                  renderInput={params => (
                    <TextField
                      {...params}
                      fullWidth
                      error={!!errors.expectedDeliveryDate}
                      helperText={errors.expectedDeliveryDate}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                Anmerkungen
              </Typography>
              <TextField
                multiline
                rows={3}
                value={formData.notes}
                onChange={handleChange('notes')}
                placeholder="Zusätzliche Informationen zur Bestellung"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1.5,
                  },
                }}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="h6" fontWeight={600}>
                Bestellpositionen
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fügen Sie die Produkte hinzu, die Sie bestellen möchten
              </Typography>
            </Box>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            {formData.positions.length > 0 ? (
              <TableContainer
                component={Paper}
                variant="outlined"
                sx={{
                  mb: 3,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Table size="small">
                  <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Produkt</TableCell>
                      <TableCell width="20%" sx={{ fontWeight: 600 }}>
                        Menge
                      </TableCell>
                      <TableCell width="10%" align="center" sx={{ fontWeight: 600 }}>
                        Aktionen
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {formData.positions.map((position, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Select
                            value={position.product ? position.product.id : ''}
                            onChange={e => handleProductChange(index, e)}
                            options={products.map(product => ({
                              value: product.id,
                              label: product.name,
                            }))}
                            size="small"
                            fullWidth
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            type="number"
                            value={position.amount}
                            onChange={e => handleAmountChange(index, e)}
                            fullWidth
                            size="small"
                            InputProps={{ inputProps: { min: 1 } }}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                              },
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={() => removeProductPosition(index)}
                            color="error"
                            size="small"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: alpha(theme.palette.warning.light, 0.05),
                  borderRadius: 2,
                  border: `1px dashed ${alpha(theme.palette.warning.main, 0.2)}`,
                  mb: 3,
                }}
              >
                <Typography color="text.secondary">
                  Keine Produkte ausgewählt. Bitte fügen Sie mindestens ein Produkt hinzu.
                </Typography>
              </Box>
            )}

            {errors.positions && (
              <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                {errors.positions}
              </Typography>
            )}

            <Button
              startIcon={<AddIcon />}
              onClick={addProductPosition}
              sx={{
                mb: 3,
                borderRadius: 1.5,
                textTransform: 'none',
              }}
            >
              Produkt hinzufügen
            </Button>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button
                onClick={onCancel}
                variant="outlined"
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                Abbrechen
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  px: 3,
                }}
              >
                {isEditing ? 'Bestellung aktualisieren' : 'Bestellung erstellen'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

SupplierOrderForm.propTypes = {
  /** Initial data for editing an existing order */
  initialData: PropTypes.object,
  /** Callback function executed when the form is submitted successfully */
  onSubmit: PropTypes.func.isRequired,
  /** Callback function executed when the cancel button is clicked */
  onCancel: PropTypes.func.isRequired,
  /** Flag indicating if the form is in edit mode */
  isEditing: PropTypes.bool,
};

SupplierOrderForm.defaultProps = {
  initialData: null,
  isEditing: false,
};

export default SupplierOrderForm;
