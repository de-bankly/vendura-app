import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import GiftCardService from '../../services/GiftCardService';
import Select from '../ui/inputs/Select';
import VoucherTable from './VoucherTable';

/**
 * VoucherManagement component for administrators to manage gift cards
 */
const VoucherManagement = forwardRef(
  ({ initialOpenDialog, initialDialogConfig, onCloseDialog }, ref) => {
    // State for voucher list and pagination
    const [vouchers, setVouchers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);

    // State for voucher creation/editing dialog
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentVoucher, setCurrentVoucher] = useState(null);
    const [loadingVoucherDetails, setLoadingVoucherDetails] = useState(false);

    // Form state
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
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // Delete dialog state
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [voucherToDelete, setVoucherToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

    // Handle initialOpenDialog from parent
    useEffect(() => {
      if (initialOpenDialog) {
        setDialogOpen(true);
        setEditMode(initialDialogConfig?.editMode || false);

        if (initialDialogConfig?.type) {
          setFormData(prev => ({
            ...prev,
            type: initialDialogConfig.type,
            initialBalance: '',
            discountPercentage: '',
            maximumUsages: '',
            expirationDate: null,
            remainingBalance: null,
            remainingUsages: null,
          }));
        }
      }
    }, [initialOpenDialog, initialDialogConfig]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      openCreateDialog: (type = 'GIFT_CARD') => {
        setEditMode(false);
        setCurrentVoucher(null);
        setFormData({
          type,
          initialBalance: '',
          discountPercentage: '',
          maximumUsages: '',
          expirationDate: null,
          remainingBalance: null,
          remainingUsages: null,
        });
        setFormErrors({});
        setSubmitError(null);
        setSubmitSuccess(false);
        setDialogOpen(true);
      },
      refreshVouchers: fetchVouchers,
    }));

    // Load vouchers on component mount and when page/rowsPerPage changes
    useEffect(() => {
      fetchVouchers();
    }, [page, rowsPerPage]);

    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await GiftCardService.getGiftCards({ page, size: rowsPerPage });

        // Erweiterte Voucher-Informationen mit Transaktionsdaten laden
        const vouchersWithDetails = await Promise.all(
          response.content.map(async voucher => {
            try {
              const transactionalInfo = await GiftCardService.getTransactionalInformation(
                voucher.id
              );
              return {
                ...voucher,
                remainingBalance: transactionalInfo.remainingBalance,
                remainingUsages: transactionalInfo.remainingUsages,
              };
            } catch (error) {
              console.error(`Error fetching details for voucher ${voucher.id}:`, error);
              return voucher;
            }
          })
        );

        setVouchers(vouchersWithDetails);
        setTotalElements(response.totalElements);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
      } finally {
        setLoading(false);
      }
    };

    const handlePageChange = (event, newPage) => {
      setPage(newPage);
    };

    const handleRowsPerPageChange = event => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const openCreateDialog = () => {
      setEditMode(false);
      setCurrentVoucher(null);
      setFormData({
        type: 'GIFT_CARD',
        initialBalance: '',
        discountPercentage: '',
        maximumUsages: '',
        expirationDate: null,
        remainingBalance: null,
        remainingUsages: null,
      });
      setFormErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      setDialogOpen(true);
    };

    const openEditDialog = async voucher => {
      setEditMode(true);
      setCurrentVoucher(voucher);
      setLoadingVoucherDetails(true);

      try {
        // Lade aktuelle Transaktionsinformationen für den Gutschein
        const transactionalInfo = await GiftCardService.getTransactionalInformation(voucher.id);

        setFormData({
          type: voucher.type,
          initialBalance: voucher.initialBalance || '',
          discountPercentage: voucher.discountPercentage || '',
          maximumUsages: voucher.maximumUsages || '',
          expirationDate: voucher.expirationDate ? dayjs(voucher.expirationDate) : null,
          remainingBalance: transactionalInfo.remainingBalance,
          remainingUsages: transactionalInfo.remainingUsages,
        });
      } catch (error) {
        console.error('Error fetching voucher details:', error);
        setFormData({
          type: voucher.type,
          initialBalance: voucher.initialBalance || '',
          discountPercentage: voucher.discountPercentage || '',
          maximumUsages: voucher.maximumUsages || '',
          expirationDate: voucher.expirationDate ? dayjs(voucher.expirationDate) : null,
          remainingBalance: voucher.remainingBalance,
          remainingUsages: voucher.remainingUsages,
        });
      } finally {
        setLoadingVoucherDetails(false);
      }

      setFormErrors({});
      setSubmitError(null);
      setSubmitSuccess(false);
      setDialogOpen(true);
    };

    const handleCloseDialog = () => {
      setDialogOpen(false);
      if (onCloseDialog) {
        onCloseDialog();
      }
    };

    const handleInputChange = e => {
      const { name, value } = e.target;

      setFormData(prev => {
        const newState = {
          ...prev,
          [name]: value,
        };
        return newState;
      });

      // Clear error for this field if exists
      if (formErrors[name]) {
        setFormErrors(prev => ({
          ...prev,
          [name]: null,
        }));
      }
    };

    const handleDateChange = date => {
      setFormData(prev => ({
        ...prev,
        expirationDate: date,
      }));

      // Clear error for this field if exists
      if (formErrors.expirationDate) {
        setFormErrors(prev => ({
          ...prev,
          expirationDate: null,
        }));
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
          errors.maximumUsages =
            'Bitte geben Sie eine gültige Anzahl an maximalen Verwendungen ein';
        }
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) return;

      setSubmitLoading(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      try {
        if (editMode) {
          // Update an existing voucher
          const payload = {
            type: formData.type,
            expirationDate: formData.expirationDate ? formData.expirationDate.toISOString() : null,
          };

          if (formData.type === 'DISCOUNT_CARD') {
            payload.discountPercentage = parseInt(formData.discountPercentage, 10);
            payload.maximumUsages = parseInt(formData.maximumUsages, 10);
          } else if (formData.type === 'GIFT_CARD' && currentVoucher.type === 'DISCOUNT_CARD') {
            // When changing from DISCOUNT_CARD to GIFT_CARD, explicitly set maximumUsages to 0
            payload.maximumUsages = 0;
            payload.discountPercentage = 0;
          } else {
            // Always include these fields to prevent null values
            payload.maximumUsages = currentVoucher.maximumUsages || 0;
            payload.discountPercentage = currentVoucher.discountPercentage || 0;
          }

          await GiftCardService.updateGiftCard(currentVoucher.id, payload);
        } else {
          // Create a new voucher
          const payload = {
            type: formData.type,
            expirationDate: formData.expirationDate ? formData.expirationDate.toISOString() : null,
          };

          if (formData.type === 'GIFT_CARD') {
            payload.initialBalance = parseFloat(formData.initialBalance);
          } else if (formData.type === 'DISCOUNT_CARD') {
            payload.discountPercentage = parseInt(formData.discountPercentage, 10);
            payload.maximumUsages = parseInt(formData.maximumUsages, 10);
          }

          await GiftCardService.createGiftCard(payload);
        }

        setSubmitSuccess(true);
        fetchVouchers();

        // Close dialog after a short delay to show success message
        setTimeout(() => {
          handleCloseDialog();
        }, 1500);
      } catch (error) {
        setSubmitError(
          error.response?.data?.message ||
            error.message ||
            'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.'
        );
      } finally {
        setSubmitLoading(false);
      }
    };

    const openDeleteDialog = voucher => {
      setVoucherToDelete(voucher);
      setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
      setDeleteDialogOpen(false);
      setVoucherToDelete(null);
      setDeleteError(null);
    };

    const handleDeleteVoucher = async () => {
      if (!voucherToDelete) return;

      setDeleteLoading(true);
      setDeleteError(null);
      try {
        await GiftCardService.deleteGiftCard(voucherToDelete.id);
        fetchVouchers();
        closeDeleteDialog();
      } catch (error) {
        console.error('Error deleting voucher:', error);
        setDeleteError(
          error.response?.data?.message ||
            error.message ||
            'Es ist ein Fehler beim Löschen des Gutscheins aufgetreten. Bitte versuchen Sie es später erneut.'
        );
      } finally {
        setDeleteLoading(false);
      }
    };

    return (
      <Box>
        {/* Render the new VoucherTable component */}
        <VoucherTable
          vouchers={vouchers}
          loading={loading}
          totalElements={totalElements}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
          onRefresh={fetchVouchers}
        />

        {/* Create/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editMode ? 'Gutschein bearbeiten' : 'Neuen Gutschein erstellen'}
          </DialogTitle>
          <DialogContent dividers>
            {loadingVoucherDetails && (
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
              formData.remainingBalance !== undefined && (
                <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
                  Aktuelles Guthaben: {formData.remainingBalance?.toFixed(2) || '0.00'} €
                </Alert>
              )}
            {editMode &&
              formData.type === 'DISCOUNT_CARD' &&
              formData.remainingUsages !== undefined && (
                <Alert severity="info" icon={<InfoIcon />} sx={{ mb: 2 }}>
                  Verbleibende Nutzungen: {formData.remainingUsages || 0} von{' '}
                  {formData.maximumUsages}
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
            <Button onClick={handleCloseDialog} disabled={submitLoading}>
              Abbrechen
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              disabled={submitLoading || submitSuccess || loadingVoucherDetails}
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

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
          <DialogTitle>Gutschein löschen</DialogTitle>
          <DialogContent>
            {deleteError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {deleteError}
              </Alert>
            )}
            <Typography>
              Sind Sie sicher, dass Sie diesen Gutschein löschen möchten?
              {voucherToDelete?.type === 'GIFT_CARD' && voucherToDelete?.remainingBalance > 0 && (
                <Box component="span" sx={{ display: 'block', mt: 1, color: 'error.main' }}>
                  Achtung: Dieser Gutschein hat noch ein Restguthaben von{' '}
                  {voucherToDelete.remainingBalance.toFixed(2)} €.
                </Box>
              )}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDeleteDialog} disabled={deleteLoading}>
              Abbrechen
            </Button>
            <Button
              onClick={handleDeleteVoucher}
              color="error"
              variant="contained"
              disabled={deleteLoading}
            >
              {deleteLoading ? <CircularProgress size={24} /> : 'Löschen'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
);

export default VoucherManagement;
