import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CardGiftcard as CardGiftcardIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import GiftCardService from '../../services/GiftCardService';

/**
 * VoucherManagement component for administrators to manage gift cards
 */
const VoucherManagement = () => {
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

  // Form state
  const [formData, setFormData] = useState({
    type: 'GIFT_CARD',
    initialBalance: '',
    discountPercentage: '',
    maximumUsages: '',
    expirationDate: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [voucherToDelete, setVoucherToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load vouchers on component mount and when page/rowsPerPage changes
  useEffect(() => {
    fetchVouchers();
  }, [page, rowsPerPage]);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await GiftCardService.getGiftCards({ page, size: rowsPerPage });
      setVouchers(response.content);
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
    });
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setDialogOpen(true);
  };

  const openEditDialog = voucher => {
    setEditMode(true);
    setCurrentVoucher(voucher);
    setFormData({
      type: voucher.type,
      initialBalance: voucher.initialBalance || '',
      discountPercentage: voucher.discountPercentage || '',
      maximumUsages: voucher.maximumUsages || '',
      expirationDate: voucher.expirationDate ? dayjs(voucher.expirationDate) : null,
    });
    setFormErrors({});
    setSubmitError(null);
    setSubmitSuccess(false);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

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

    if (formData.type === 'GIFT_CARD') {
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
  };

  const handleDeleteVoucher = async () => {
    if (!voucherToDelete) return;

    setDeleteLoading(true);
    try {
      await GiftCardService.deleteGiftCard(voucherToDelete.id);
      fetchVouchers();
      closeDeleteDialog();
    } catch (error) {
      console.error('Error deleting voucher:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'Kein Ablaufdatum';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1" fontWeight="bold">
          Gutschein-Verwaltung
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchVouchers}
            sx={{ mr: 1 }}
            disabled={loading}
          >
            Aktualisieren
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={openCreateDialog}
          >
            Neuer Gutschein
          </Button>
        </Box>
      </Box>

      <Paper variant="outlined" sx={{ mb: 4 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Typ</TableCell>
                <TableCell>Ausgabedatum</TableCell>
                <TableCell>Ablaufdatum</TableCell>
                <TableCell>Wert/Rabatt</TableCell>
                <TableCell>Nutzungen</TableCell>
                <TableCell>Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Gutscheine werden geladen...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : vouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">Keine Gutscheine gefunden</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                vouchers.map(voucher => (
                  <TableRow key={voucher.id}>
                    <TableCell>{voucher.id}</TableCell>
                    <TableCell>
                      {voucher.type === 'GIFT_CARD' ? (
                        <Chip
                          icon={<CardGiftcardIcon />}
                          label="Geschenkkarte"
                          color="primary"
                          variant="outlined"
                          size="small"
                        />
                      ) : (
                        <Chip
                          icon={<LocalOfferIcon />}
                          label="Rabattkarte"
                          color="warning"
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </TableCell>
                    <TableCell>{formatDate(voucher.issueDate)}</TableCell>
                    <TableCell>{formatDate(voucher.expirationDate)}</TableCell>
                    <TableCell>
                      {voucher.type === 'GIFT_CARD'
                        ? `${voucher.initialBalance.toFixed(2)} €`
                        : `${voucher.discountPercentage}%`}
                    </TableCell>
                    <TableCell>
                      {voucher.type === 'DISCOUNT_CARD'
                        ? `${voucher.remainingUsages || 0}/${voucher.maximumUsages}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Bearbeiten">
                        <IconButton size="small" onClick={() => openEditDialog(voucher)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Löschen">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => openDeleteDialog(voucher)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Paper>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Gutschein bearbeiten' : 'Neuen Gutschein erstellen'}</DialogTitle>
        <DialogContent dividers>
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

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={editMode}>
                <InputLabel id="voucher-type-label">Gutschein-Typ</InputLabel>
                <Select
                  labelId="voucher-type-label"
                  label="Gutschein-Typ"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  disabled={editMode} // Type can't be changed after creation
                >
                  <MenuItem value="GIFT_CARD">Geschenkkarte (Guthaben)</MenuItem>
                  <MenuItem value="DISCOUNT_CARD">Rabattkarte (Prozentual)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.type === 'GIFT_CARD' && (
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
                  disabled={editMode} // Initial balance can't be changed after creation
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
            disabled={submitLoading || submitSuccess}
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
};

export default VoucherManagement;
