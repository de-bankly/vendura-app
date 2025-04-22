import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
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
  Info as InfoIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import GiftCardService from '../../services/GiftCardService';
import Select from '../ui/inputs/Select';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';

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

    // Animation variants
    const tableRowVariants = {
      hidden: { opacity: 0 },
      visible: i => ({
        opacity: 1,
        transition: {
          delay: i * 0.05,
        },
      }),
    };

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

    const formatDate = dateString => {
      if (!dateString) return 'Kein Ablaufdatum';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };

    const renderVoucherTable = () => {
      const theme = useTheme();

      return (
        <Box sx={{ width: '100%', mb: 2 }}>
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.grey[700], 0.5)
                  : alpha(theme.palette.grey[300], 0.8)
              }`,
            }}
          >
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', p: 2, alignItems: 'center' }}
            >
              <Typography variant="h6" component="div">
                Alle Gutscheine
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<RefreshIcon />}
                  onClick={fetchVouchers}
                  disabled={loading}
                  size="small"
                >
                  Aktualisieren
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={openCreateDialog}
                  size="small"
                >
                  Neuer Gutschein
                </Button>
              </Box>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
              <Table stickyHeader aria-label="Gutschein-Tabelle">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.9)
                            : alpha(theme.palette.grey[100], 0.9),
                      }}
                    >
                      Gutscheincode
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.9)
                            : alpha(theme.palette.grey[100], 0.9),
                      }}
                    >
                      Typ
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.9)
                            : alpha(theme.palette.grey[100], 0.9),
                      }}
                    >
                      Wert/Rabatt
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.9)
                            : alpha(theme.palette.grey[100], 0.9),
                      }}
                    >
                      Status
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.9)
                            : alpha(theme.palette.grey[100], 0.9),
                      }}
                    >
                      Ablaufdatum
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: 'bold',
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.background.paper, 0.9)
                            : alpha(theme.palette.grey[100], 0.9),
                      }}
                    >
                      Aktionen
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <CircularProgress size={40} />
                      </TableCell>
                    </TableRow>
                  ) : vouchers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          Keine Gutscheine gefunden
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    vouchers.map((voucher, index) => (
                      <motion.tr
                        key={voucher.id}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={tableRowVariants}
                        component={TableRow}
                        sx={{
                          '&:nth-of-type(odd)': {
                            backgroundColor:
                              theme.palette.mode === 'dark'
                                ? alpha(theme.palette.action.hover, 0.05)
                                : alpha(theme.palette.action.hover, 0.05),
                          },
                          '&:hover': {
                            backgroundColor:
                              theme.palette.mode === 'dark'
                                ? alpha(theme.palette.action.hover, 0.1)
                                : alpha(theme.palette.action.hover, 0.1),
                          },
                          transition: 'background-color 0.2s',
                        }}
                      >
                        <TableCell>
                          <Typography variant="body2" fontWeight="medium">
                            {voucher.code}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={
                              voucher.type === 'GIFT_CARD' ? (
                                <CardGiftcardIcon fontSize="small" />
                              ) : (
                                <LocalOfferIcon fontSize="small" />
                              )
                            }
                            label={
                              voucher.type === 'GIFT_CARD' ? 'Geschenkkarte' : 'Rabattgutschein'
                            }
                            color={voucher.type === 'GIFT_CARD' ? 'primary' : 'secondary'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {voucher.type === 'GIFT_CARD' ? (
                            <Typography>
                              <Box component="span" fontWeight="medium">
                                {voucher.initialBalance?.toFixed(2)}€
                              </Box>{' '}
                              {voucher.remainingBalance !== undefined && (
                                <Box component="span" color="text.secondary" fontSize="0.85rem">
                                  (Verbleibend: {voucher.remainingBalance?.toFixed(2)}€)
                                </Box>
                              )}
                            </Typography>
                          ) : (
                            <Typography>
                              <Box component="span" fontWeight="medium">
                                {voucher.discountPercentage}%
                              </Box>{' '}
                              {voucher.remainingUsages !== undefined && (
                                <Box component="span" color="text.secondary" fontSize="0.85rem">
                                  (Verbleibend: {voucher.remainingUsages}x)
                                </Box>
                              )}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          {/* Status Chip */}
                          {voucher.type === 'GIFT_CARD' ? (
                            <Chip
                              label={voucher.remainingBalance > 0 ? 'Aktiv' : 'Aufgebraucht'}
                              color={voucher.remainingBalance > 0 ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Chip
                              label={voucher.remainingUsages > 0 ? 'Aktiv' : 'Aufgebraucht'}
                              color={voucher.remainingUsages > 0 ? 'success' : 'default'}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {voucher.expirationDate ? (
                            <Typography variant="body2">
                              {formatDate(voucher.expirationDate)}
                            </Typography>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              Kein Ablaufdatum
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Bearbeiten">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => openEditDialog(voucher)}
                                sx={{
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                  },
                                }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Löschen">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => openDeleteDialog(voucher)}
                                sx={{
                                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                                  '&:hover': {
                                    backgroundColor: alpha(theme.palette.error.main, 0.2),
                                  },
                                }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalElements}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </Paper>
        </Box>
      );
    };

    return (
      <Box>
        {renderVoucherTable()}

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
