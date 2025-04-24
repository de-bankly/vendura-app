import React from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';

const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading,
  error,
  itemDescription, // Optional: More details about the item being deleted
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title || 'Löschen bestätigen'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          {message || 'Sind Sie sicher, dass Sie dieses Element löschen möchten?'}
        </Typography>
        {itemDescription && (
          <Box component="span" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
            {itemDescription}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Abbrechen
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Löschen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
