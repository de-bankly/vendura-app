import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { InventoryManagementService } from '../../services';
import { Select } from '../ui/inputs';

/**
 * StockAdjustmentDialog allows users to manually adjust inventory stock levels
 */
const StockAdjustmentDialog = ({ open, onClose, product, onSuccess }) => {
  const [adjustmentType, setAdjustmentType] = useState('add');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Calculate the actual quantity change based on the adjustment type
      const quantityChange = adjustmentType === 'add' ? quantity : -quantity;

      await InventoryManagementService.adjustStock(product.id, quantityChange, reason);

      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess();
      }

      handleClose();
    } catch (err) {
      setError('Failed to adjust stock. Please try again.');
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setAdjustmentType('add');
    setQuantity(1);
    setReason('');
    setError(null);
    onClose();
  };

  const currentStock = product.currentStock !== null ? product.currentStock : 'Unknown';

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Adjust Inventory for {product.name}</DialogTitle>

      <DialogContent>
        <DialogContentText>Current stock: {currentStock}</DialogContentText>

        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom>
                  Adjustment Type
                </Typography>
                <Select
                  value={adjustmentType}
                  onChange={e => setAdjustmentType(e.target.value)}
                  options={[
                    { value: 'add', label: 'Add Stock' },
                    { value: 'remove', label: 'Remove Stock' },
                  ]}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom>
                  Quantity
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  InputProps={{ inputProps: { min: 1 } }}
                  fullWidth
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <Typography variant="subtitle2" gutterBottom>
                  Reason for Adjustment
                </Typography>
                <TextField
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Enter reason for adjustment"
                  multiline
                  rows={2}
                  fullWidth
                />
              </FormControl>
            </Grid>
          </Grid>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting || quantity < 1}
        >
          {isSubmitting ? 'Processing...' : 'Adjust Stock'}
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
