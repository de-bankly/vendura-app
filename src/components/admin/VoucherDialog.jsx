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

/**
 * @typedef {object} VoucherData
 * @property {'GIFT_CARD' | 'DISCOUNT_CARD'} type - The type of the voucher.
 * @property {string | number} initialBalance - The initial balance for GIFT_CARD type (only used in create mode).
 * @property {string | number} discountPercentage - The discount percentage for DISCOUNT_CARD type.
 * @property {string | number} maximumUsages - The maximum number of usages for DISCOUNT_CARD type.
 * @property {dayjs.Dayjs | null} expirationDate - The optional expiration date of the voucher.
 * @property {number | null} [remainingBalance] - The remaining balance (for GIFT_CARD, display only).
 * @property {number | null} [remainingUsages] - The remaining usages (for DISCOUNT_CARD, display only).
 */

/**
 * @typedef {object} VoucherDialogProps
 * @property {boolean} open - If true, the dialog is open.
 * @property {() => void} onClose - Function to call when the dialog should close.
 * @property {boolean} editMode - If true, the dialog is in edit mode; otherwise, it's in create mode.
 * @property {Partial<VoucherData> | null} initialData - Initial data for the form, used in edit mode or to pre-fill type.
 * @property {(data: VoucherData) => void} onSubmit - Function to call when the form is submitted with valid data.
 * @property {boolean} loading - Indicates if the submission process is loading.
 * @property {string | null} error - An error message to display if submission fails.
 * @property {boolean} success - Indicates if the submission was successful.
 * @property {boolean} loadingDetails - Indicates if initial voucher details are being loaded (in edit mode).
 */

/**
 * A dialog component for creating or editing vouchers (Gift Cards or Discount Cards).
 *
 * @param {VoucherDialogProps} props The component props.
 * @returns {JSX.Element} The rendered VoucherDialog component.
 */
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
  const [formData, setFormData] = useState(
    /** @type {VoucherData} */ ({
      type: 'GIFT_CARD',
      initialBalance: '',
      discountPercentage: '',
      maximumUsages: '',
      expirationDate: null,
      remainingBalance: null,
      remainingUsages: null,
    })
  );
  const [formErrors, setFormErrors] = useState({});

  /**
   * Effect to initialize or reset the form state when the dialog opens
   * or when relevant props like `editMode` or `initialData` change.
   */
  useEffect(() => {
    if (open) {
      if (editMode && initialData) {
        setFormData({
          type: initialData.type || 'GIFT_CARD',
          initialBalance: initialData.initialBalance || '',
          discountPercentage: initialData.discountPercentage || '',
          maximumUsages: initialData.maximumUsages || '',
          expirationDate: initialData.expirationDate ? dayjs(initialData.expirationDate) : null,
          remainingBalance: initialData.remainingBalance,
          remainingUsages: initialData.remainingUsages,
        });
      } else {
        setFormData({
          type: initialData?.type || 'GIFT_CARD',
          initialBalance: '',
          discountPercentage: '',
          maximumUsages: '',
          expirationDate: null,
          remainingBalance: null,
          remainingUsages: null,
        });
      }
      setFormErrors({});
    }
  }, [open, editMode, initialData]);

  /**
   * Handles changes in text fields and select inputs.
   * Updates the corresponding state field and clears its validation error.
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | import('@mui/material').SelectChangeEvent<string>} e - The input change event.
   */
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  /**
   * Handles changes in the DatePicker component.
   * Updates the expirationDate state field and clears its validation error.
   * @param {dayjs.Dayjs | null} date - The selected date.
   */
  const handleDateChange = date => {
    setFormData(prev => ({ ...prev, expirationDate: date }));
    if (formErrors.expirationDate) {
      setFormErrors(prev => ({ ...prev, expirationDate: null }));
    }
  };

  /**
   * Validates the current form data based on the selected voucher type.
   * Sets validation errors in the `formErrors` state.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};
    if (!formData.type) {
      errors.type = 'Bitte wählen Sie einen Gutschein-Typ aus';
    }
    if (formData.type === 'GIFT_CARD' && !editMode) {
      if (!formData.initialBalance || Number(formData.initialBalance) <= 0) {
        errors.initialBalance = 'Bitte geben Sie einen gültigen Anfangsbetrag ein';
      }
    } else if (formData.type === 'DISCOUNT_CARD') {
      if (
        !formData.discountPercentage ||
        Number(formData.discountPercentage) <= 0 ||
        Number(formData.discountPercentage) > 100
      ) {
        errors.discountPercentage = 'Der Rabatt muss zwischen 1 und 100% liegen';
      }
      if (!formData.maximumUsages || Number(formData.maximumUsages) <= 0) {
        errors.maximumUsages = 'Bitte geben Sie eine gültige Anzahl an maximalen Verwendungen ein';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles the form submission process.
   * Validates the form and calls the `onSubmit` prop if validation passes.
   */
  const handleInternalSubmit = () => {
    if (validateForm()) {
      const dataToSubmit = {
        ...formData,
        expirationDate: formData.expirationDate ? formData.expirationDate.toISOString() : null,
      };
      onSubmit(dataToSubmit);
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
        {editMode &&
          formData.type === 'GIFT_CARD' &&
          formData.remainingBalance !== null &&
          formData.remainingBalance !== undefined && (
            <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
              Aktuelles Guthaben: {formData.remainingBalance?.toFixed(2) || '0.00'} €
            </Alert>
          )}
        {editMode &&
          formData.type === 'DISCOUNT_CARD' &&
          formData.remainingUsages !== null &&
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
              disabled={editMode || loadingDetails}
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
                inputProps={{ min: 0.01, step: '0.01' }}
                disabled={loadingDetails}
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
                  disabled={loadingDetails}
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
                  disabled={loadingDetails}
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
                  disabled: loadingDetails,
                },
              }}
              minDate={dayjs()}
              disabled={loadingDetails}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitLoading || loadingDetails}>
          Abbrechen
        </Button>
        <Button
          onClick={handleInternalSubmit}
          variant="contained"
          color="primary"
          disabled={submitLoading || submitSuccess || loadingDetails}
        >
          {submitLoading ? (
            <CircularProgress size={24} color="inherit" />
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
