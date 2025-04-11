import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  FormControlLabel,
  FormGroup,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { Close as CloseIcon, Delete as DeleteIcon } from '@mui/icons-material';

import { BrandService, SupplierService } from '../../services';

/**
 * InventoryFilterDrawer provides advanced filtering options for inventory products
 */
const InventoryFilterDrawer = ({ open, onClose, filters, onFilterChange }) => {
  // Local state for filters (to prevent updating parent state on every change)
  const [localFilters, setLocalFilters] = useState(filters);
  const [brands, setBrands] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // Update local filters when parent filters change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Fetch brands and suppliers on component mount
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandsData, suppliersData] = await Promise.all([
          BrandService.getBrands({ page: 0, size: 100 }),
          SupplierService.getSuppliers({ page: 0, size: 100 }),
        ]);

        setBrands(brandsData.content || []);
        setSuppliers(suppliersData.content || []);
      } catch (err) {
        console.error('Error fetching filter options:', err);
      }
    };

    fetchOptions();
  }, []);

  // Event handlers for individual filter changes
  const handleCheckboxChange = event => {
    const { name, checked } = event.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: newValue,
    }));
  };

  const handleSupplierToggle = supplierId => {
    setLocalFilters(prev => {
      const currentSuppliers = [...prev.suppliers];
      const supplierIndex = currentSuppliers.indexOf(supplierId);

      if (supplierIndex === -1) {
        currentSuppliers.push(supplierId);
      } else {
        currentSuppliers.splice(supplierIndex, 1);
      }

      return {
        ...prev,
        suppliers: currentSuppliers,
      };
    });
  };

  const handleBrandToggle = brandId => {
    setLocalFilters(prev => {
      const currentBrands = [...prev.brands];
      const brandIndex = currentBrands.indexOf(brandId);

      if (brandIndex === -1) {
        currentBrands.push(brandId);
      } else {
        currentBrands.splice(brandIndex, 1);
      }

      return {
        ...prev,
        brands: currentBrands,
      };
    });
  };

  // Format price for display
  const formatPrice = value => {
    return `${value} €`;
  };

  // Apply filters
  const handleApplyFilters = () => {
    onFilterChange(localFilters);
    onClose();
  };

  // Reset filters
  const handleResetFilters = () => {
    const resetFilters = {
      inStock: false,
      lowStock: false,
      priceRange: [0, 1000],
      suppliers: [],
      brands: [],
    };

    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 } },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6">Filter</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button
            startIcon={<DeleteIcon />}
            color="inherit"
            size="small"
            onClick={handleResetFilters}
          >
            Zurücksetzen
          </Button>
          <IconButton onClick={onClose} size="small" aria-label="Schließen">
            <CloseIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Filter Body */}
      <Box sx={{ overflow: 'auto', flexGrow: 1, p: 2 }}>
        {/* Stock Status */}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Bestand
        </Typography>
        <FormGroup sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={localFilters.inStock}
                onChange={handleCheckboxChange}
                name="inStock"
              />
            }
            label="Auf Lager"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={localFilters.lowStock}
                onChange={handleCheckboxChange}
                name="lowStock"
              />
            }
            label="Niedriger Bestand"
          />
        </FormGroup>

        <Divider sx={{ my: 2 }} />

        {/* Price Range */}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Preisbereich
        </Typography>
        <Box sx={{ px: 1, mb: 3 }}>
          <Slider
            value={localFilters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={formatPrice}
            min={0}
            max={1000}
            marks={[
              { value: 0, label: '0 €' },
              { value: 1000, label: '1000 €' },
            ]}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Von: {formatPrice(localFilters.priceRange[0])}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Bis: {formatPrice(localFilters.priceRange[1])}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Suppliers */}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Lieferanten
        </Typography>
        <List
          dense
          sx={{
            mb: 2,
            maxHeight: 200,
            overflow: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          {suppliers.length === 0 ? (
            <ListItem>
              <ListItemText primary="Keine Lieferanten gefunden" />
            </ListItem>
          ) : (
            suppliers.map(supplier => (
              <ListItemButton
                key={supplier.id}
                dense
                onClick={() => handleSupplierToggle(supplier.id)}
                selected={localFilters.suppliers.includes(supplier.id)}
              >
                <Checkbox
                  edge="start"
                  checked={localFilters.suppliers.includes(supplier.id)}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                />
                <ListItemText primary={supplier.name} />
              </ListItemButton>
            ))
          )}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Brands */}
        <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
          Marken
        </Typography>
        <List
          dense
          sx={{
            mb: 2,
            maxHeight: 200,
            overflow: 'auto',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          {brands.length === 0 ? (
            <ListItem>
              <ListItemText primary="Keine Marken gefunden" />
            </ListItem>
          ) : (
            brands.map(brand => (
              <ListItemButton
                key={brand.id}
                dense
                onClick={() => handleBrandToggle(brand.id)}
                selected={localFilters.brands.includes(brand.id)}
              >
                <Checkbox
                  edge="start"
                  checked={localFilters.brands.includes(brand.id)}
                  tabIndex={-1}
                  disableRipple
                  size="small"
                />
                <ListItemText primary={brand.name} />
              </ListItemButton>
            ))
          )}
        </List>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 1,
        }}
      >
        <Button variant="outlined" onClick={onClose}>
          Abbrechen
        </Button>
        <Button variant="contained" onClick={handleApplyFilters} color="primary">
          Anwenden
        </Button>
      </Box>
    </Drawer>
  );
};

InventoryFilterDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    inStock: PropTypes.bool.isRequired,
    lowStock: PropTypes.bool.isRequired,
    priceRange: PropTypes.arrayOf(PropTypes.number).isRequired,
    suppliers: PropTypes.arrayOf(PropTypes.string).isRequired,
    brands: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default InventoryFilterDrawer;
