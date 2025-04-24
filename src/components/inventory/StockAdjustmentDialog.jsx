import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';

import { InventoryManagementService } from '../../services';
import { Select } from '../ui/inputs';

/**
 * @typedef {object} Product
 * @property {string} id - The unique identifier for the product.
 * @property {string} name - The name of the product.
 * @property {number | null} currentStock - The current stock level of the product. Can be null if unknown.
 */

/**
 * @typedef {object} StockAdjustmentDialogProps
 * @property {boolean} open - If `true`, the dialog is open.
 * @property {() => void} onClose - Callback fired when the component requests to be closed.
 * @property {Product} product - The product whose stock is being adjusted.
 * @property {() => void} [onSuccess] - Optional callback fired after a successful stock adjustment.
 */

/**
 * StockAdjustmentDialog allows users to manually adjust inventory stock levels for a specific product.
 * It provides options to add or remove stock, specify the quantity, and provide a reason for the adjustment.
 *
 * @param {StockAdjustmentDialogProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered StockAdjustmentDialog component.
 */
const StockAdjustmentDialog = ({ open, onClose, product, onSuccess }) => {
  const theme = useTheme();
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    setAdjustmentType('add');
    setQuantity(1);
    setReason('');
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async () => {
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const quantityChange = adjustmentType === 'add' ? quantity : -quantity;

      await InventoryManagementService.adjustStock(product.id, quantityChange, reason);

      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (err) {
      console.error('Stock adjustment failed:', err);
      setError('Failed to adjust stock. Please try again.');
      setIsSubmitting(false);
    }
  };

  const currentStock = product.currentStock !== null ? product.currentStock : 'Unknown';

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
          handleClose();
        }
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: theme.shadows[10],
        },
      }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          pt: 2,
          fontWeight: 600,
        }}
      >
        Bestand anpassen
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2 }}>
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            flexDirection: 'column',
            p: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
            borderRadius: 1,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {product.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Artikel-ID: {product.id}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: alpha(theme.palette.success.main, 0.1),
                px: 1.5,
                py: 0.5,
                borderRadius: 1,
              }}
            >
              <Typography variant="body2" fontWeight={600} color="success.main">
                Aktueller Bestand: {currentStock}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                  Anpassungstyp
                </Typography>
                <Select
                  value={adjustmentType}
                  onChange={e => setAdjustmentType(e.target.value)}
                  options={[
                    {
                      value: 'add',
                      label: 'Bestand hinzufügen',
                      icon: <AddIcon fontSize="small" color="success" />,
                    },
                    {
                      value: 'remove',
                      label: 'Bestand entfernen',
                      icon: <RemoveIcon fontSize="small" color="error" />,
                    },
                  ]}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                  Menge
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  InputProps={{ inputProps: { min: 1 } }}
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
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 500 }}>
                  Grund für die Anpassung
                </Typography>
                <TextField
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Geben Sie einen Grund für die Bestandsanpassung an"
                  multiline
                  rows={3}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5,
                    },
                  }}
                />
              </FormControl>
            </Grid>
          </Grid>

          {error && (
            <Box
              sx={{
                mt: 2,
                p: 1.5,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
              }}
            >
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          disabled={isSubmitting}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            px: 3,
          }}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={adjustmentType === 'add' ? 'success' : 'primary'}
          disabled={isSubmitting || quantity < 1}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            px: 3,
            minWidth: 180,
          }}
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isSubmitting ? 'Wird bearbeitet...' : 'Bestand anpassen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

StockAdjustmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    currentStock: PropTypes.number,
  }).isRequired,
  onSuccess: PropTypes.func,
};

export default StockAdjustmentDialog;
