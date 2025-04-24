import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Info as InfoIcon } from '@mui/icons-material';
import dayjs from 'dayjs';
import Select from '../ui/inputs/Select';

const VoucherDialog = ({
  open,
  onClose,
  editMode,
  initialData,
  onSubmit,
  loading: submitLoading,
  error: submitError,
  success: submitSuccess,
  loadingDetails,
}) => {
  const [formData, setFormData] = useState({
    type: 'GIFT_CARD',
    initialBalance: '',
    discountPercentage: '',
    maximumUsages: '',
    expirationDate: null,
    remainingBalance: null,
    remainingUsages: null,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (editMode && initialData) {
        setFormData({
          type: initialData.type,
          initialBalance: initialData.initialBalance || '',
          discountPercentage: initialData.discountPercentage || '',
          maximumUsages: initialData.maximumUsages || '',
          expirationDate: initialData.expirationDate ? dayjs(initialData.expirationDate) : null,
          remainingBalance: initialData.remainingBalance,
          remainingUsages: initialData.remainingUsages,
        });
      } else {
        // Reset form for create mode or when dialog reopens without data
        setFormData({
          type: initialData?.type || 'GIFT_CARD', // Pre-fill type if provided
          initialBalance: '',
          discountPercentage: '',
          maximumUsages: '',
          expirationDate: null,
          remainingBalance: null,
          remainingUsages: null,
        });
      }
      setFormErrors({}); // Reset errors on open
    }
  }, [open, editMode, initialData]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleDateChange = date => {
    setFormData(prev => ({ ...prev, expirationDate: date }));
    if (formErrors.expirationDate) {
      setFormErrors(prev => ({ ...prev, expirationDate: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.type) {
      errors.type = 'Bitte wählen Sie einen Gutschein-Typ aus';
    }
    if (formData.type === 'GIFT_CARD' && !editMode) {
      if (!formData.initialBalance || formData.initialBalance <= 0) {
        errors.initialBalance = 'Bitte geben Sie einen gültigen Anfangsbetrag ein';
      }
    } else if (formData.type === 'DISCOUNT_CARD') {
      if (
        !formData.discountPercentage ||
        formData.discountPercentage <= 0 ||
        formData.discountPercentage > 100
      ) {
        errors.discountPercentage = 'Der Rabatt muss zwischen 1 und 100% liegen';
      }
      if (!formData.maximumUsages || formData.maximumUsages <= 0) {
        errors.maximumUsages = 'Bitte geben Sie eine gültige Anzahl an maximalen Verwendungen ein';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInternalSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editMode ? 'Gutschein bearbeiten' : 'Neuen Gutschein erstellen'}</DialogTitle>
      <DialogContent dividers>
        {loadingDetails && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress size={30} />
          </Box>
        )}
        {submitSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {editMode
              ? 'Gutschein wurde erfolgreich aktualisiert'
              : 'Gutschein wurde erfolgreich erstellt'}
          </Alert>
        )}
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        {editMode && formData.type === 'GIFT_CARD' && formData.remainingBalance !== undefined && (
          <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
            Aktuelles Guthaben: {formData.remainingBalance?.toFixed(2) || '0.00'} €
          </Alert>
        )}
        {editMode &&
          formData.type === 'DISCOUNT_CARD' &&
          formData.remainingUsages !== undefined && (
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              Verbleibende Nutzungen: {formData.remainingUsages || 0} von {formData.maximumUsages}
            </Alert>
          )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Select
              label="Gutschein-Typ"
              name="type"
              id="voucher-type-select"
              value={formData.type}
              onChange={handleInputChange}
              disabled={editMode}
              error={!!formErrors.type}
              helperText={formErrors.type}
              placeholder="Wählen Sie einen Gutschein-Typ"
              options={[
                { value: 'GIFT_CARD', label: 'Geschenkkarte (Guthaben)' },
                { value: 'DISCOUNT_CARD', label: 'Rabattkarte (Prozentual)' },
              ]}
            />
          </Grid>

          {formData.type === 'GIFT_CARD' && !editMode && (
            <Grid item xs={12}>
              <TextField
                label="Anfangsguthaben (€)"
                name="initialBalance"
                type="number"
                fullWidth
                value={formData.initialBalance}
                onChange={handleInputChange}
                error={!!formErrors.initialBalance}
                helperText={formErrors.initialBalance}
                inputProps={{ min: 0, step: '0.01' }}
              />
            </Grid>
          )}

          {formData.type === 'DISCOUNT_CARD' && (
            <>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Rabatt (%)"
                  name="discountPercentage"
                  type="number"
                  fullWidth
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                  error={!!formErrors.discountPercentage}
                  helperText={formErrors.discountPercentage}
                  inputProps={{ min: 1, max: 100 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Maximale Verwendungen"
                  name="maximumUsages"
                  type="number"
                  fullWidth
                  value={formData.maximumUsages}
                  onChange={handleInputChange}
                  error={!!formErrors.maximumUsages}
                  helperText={formErrors.maximumUsages}
                  inputProps={{ min: 1 }}
                />
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <DatePicker
              label="Ablaufdatum (optional)"
              value={formData.expirationDate}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!formErrors.expirationDate,
                  helperText: formErrors.expirationDate,
                },
              }}
              minDate={dayjs(new Date())}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitLoading}>
          Abbrechen
        </Button>
        <Button
          onClick={handleInternalSubmit}
          variant="contained"
          color="primary"
          disabled={submitLoading || submitSuccess || loadingDetails}
        >
          {submitLoading ? (
            <CircularProgress size={24} />
          ) : editMode ? (
            'Aktualisieren'
          ) : (
            'Erstellen'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VoucherDialog;
