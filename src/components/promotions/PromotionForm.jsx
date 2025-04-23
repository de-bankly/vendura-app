import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Divider,
  FormControlLabel,
  Switch,
  useTheme,
  alpha,
  CircularProgress,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import deLocale from 'date-fns/locale/de';
import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Select } from '../ui/inputs';
import {
  Close as CloseIcon,
  LocalOffer as LocalOfferIcon,
  Money as MoneyIcon,
  CalendarMonth as CalendarIcon,
} from '@mui/icons-material';

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
  const theme = useTheme();
  const [formData, setFormData] = useState({
    productId: '',
    begin: new Date(),
    end: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Default: 1 month from now
    discount: '',
    active: true,
  });

  const [loading, setLoading] = useState(false);
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
        active: promotion.active !== undefined ? promotion.active : true,
      });
    } else {
      // Reset form when dialog is opened
      setFormData({
        productId: '',
        begin: new Date(),
        end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        discount: '',
        active: true,
      });
    }
    setErrors({});
  }, [promotion, isEditMode, open]);

  const handleChange = e => {
    const { name, value, checked } = e.target;
    const newValue = name === 'active' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
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

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        setLoading(true);
        // Format data for submission
        const submissionData = {
          ...formData,
          discount: parseFloat(formData.discount),
        };

        // Pass ID separately for routing when in edit mode
        if (isEditMode && promotion) {
          await onSubmit(submissionData, promotion.id);
        } else {
          await onSubmit(submissionData);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setLoading(false);
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
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          pb: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LocalOfferIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" component="span">
            {isEditMode ? 'Aktion bearbeiten' : 'Neue Aktion erstellen'}
          </Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Mit einer Aktion können Sie Rabatte für bestimmte Produkte anbieten. Bitte füllen Sie
            die folgenden Felder aus.
          </Typography>

          {/* Product Selection */}
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <LocalOfferIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
            Produktinformationen
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

          {/* Date Range */}
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
            Aktionszeitraum
          </Typography>
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
                    size: 'medium',
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
                    size: 'medium',
                  },
                }}
              />
            </Box>
          </LocalizationProvider>

          {/* Discount Amount */}
          <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
            <MoneyIcon sx={{ mr: 1, fontSize: 18, color: theme.palette.primary.main }} />
            Rabattinformationen
          </Typography>
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
              startAdornment: <InputAdornment position="start">€</InputAdornment>,
            }}
            sx={{ mb: 3 }}
          />

          {/* Active Status */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              bgcolor: alpha(theme.palette.background.default, 0.5),
              borderRadius: 1,
            }}
          >
            <Typography variant="body1">Aktion aktiv</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={handleChange}
                  name="active"
                  color="primary"
                />
              }
              label={formData.active ? 'Aktiv' : 'Inaktiv'}
              labelPlacement="start"
            />
          </Box>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} variant="outlined">
          Abbrechen
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} color="inherit" />}
        >
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
