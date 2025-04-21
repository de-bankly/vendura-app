import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import deLocale from 'date-fns/locale/de';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Select } from '../ui/inputs';

/**
 * PromotionForm component for creating and editing promotions
 */
const PromotionForm = ({
  open,
  onClose,
  onSubmit,
  promotion = null,
  products = [],
  isEditMode = false,
}) => {
  const [formData, setFormData] = useState({
    productId: '',
    begin: new Date(),
    end: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default: 1 month from now
    discount: '',
  });

  const [errors, setErrors] = useState({});

  // Initialize form with promotion data if in edit mode
  useEffect(() => {
    if (promotion && isEditMode) {
      setFormData({
        productId: promotion.productId || '',
        begin: promotion.begin ? new Date(promotion.begin) : new Date(),
        end: promotion.end
          ? new Date(promotion.end)
          : new Date(new Date().setMonth(new Date().getMonth() + 1)),
        discount: promotion.discount !== undefined ? promotion.discount.toString() : '',
      });
    } else {
      // Reset form when dialog is opened
      setFormData({
        productId: '',
        begin: new Date(),
        end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        discount: '',
      });
    }
    setErrors({});
  }, [promotion, isEditMode, open]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = (name, date) => {
    setFormData(prev => ({
      ...prev,
      [name]: date,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productId) {
      newErrors.productId = 'Bitte wählen Sie ein Produkt aus';
    }

    if (!formData.begin) {
      newErrors.begin = 'Bitte wählen Sie ein Startdatum';
    }

    if (!formData.end) {
      newErrors.end = 'Bitte wählen Sie ein Enddatum';
    } else if (
      formData.begin &&
      formData.end &&
      new Date(formData.end) <= new Date(formData.begin)
    ) {
      newErrors.end = 'Enddatum muss nach dem Startdatum liegen';
    }

    if (!formData.discount) {
      newErrors.discount = 'Bitte geben Sie einen Rabattbetrag ein';
    } else if (isNaN(parseFloat(formData.discount)) || parseFloat(formData.discount) < 0) {
      newErrors.discount = 'Rabatt muss eine positive Zahl sein';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Format data for submission
      const submissionData = {
        ...formData,
        discount: parseFloat(formData.discount),
      };

      // Pass ID separately for routing when in edit mode
      if (isEditMode && promotion) {
        onSubmit(submissionData, promotion.id);
      } else {
        onSubmit(submissionData);
      }
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>{isEditMode ? 'Aktion bearbeiten' : 'Neue Aktion erstellen'}</DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Mit einer Aktion können Sie Rabatte für bestimmte Produkte anbieten.
          </Typography>

          <Select
            label="Produkt"
            name="productId"
            value={formData.productId}
            onChange={handleChange}
            options={(products || []).map(product => ({
              value: product.id,
              label: `${product.name} - ${product.price.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`,
            }))}
            error={!!errors.productId}
            helperText={errors.productId}
            disabled={isEditMode}
            sx={{ mb: 3, mt: 1 }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={deLocale}>
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <DatePicker
                label="Startdatum"
                value={formData.begin}
                onChange={date => handleDateChange('begin', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.begin,
                    helperText: errors.begin,
                  },
                }}
              />

              <DatePicker
                label="Enddatum"
                value={formData.end}
                onChange={date => handleDateChange('end', date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!errors.end,
                    helperText: errors.end,
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          <TextField
            fullWidth
            label="Rabatt (€)"
            name="discount"
            type="number"
            value={formData.discount}
            onChange={handleChange}
            error={!!errors.discount}
            helperText={errors.discount || 'Geben Sie den Rabattbetrag in Euro ein'}
            InputProps={{
              inputProps: { min: 0, step: 0.01 },
              startAdornment: <Typography sx={{ mr: 1 }}>€</Typography>,
            }}
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button onClick={onClose}>Abbrechen</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          {isEditMode ? 'Aktualisieren' : 'Erstellen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

PromotionForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  // onSubmit receives submissionData as first param and optionally promotionId as second param
  onSubmit: PropTypes.func.isRequired,
  promotion: PropTypes.shape({
    id: PropTypes.string,
    productId: PropTypes.string,
    begin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    discount: PropTypes.number,
    active: PropTypes.bool,
  }),
  products: PropTypes.array,
  isEditMode: PropTypes.bool,
};

export default PromotionForm;
