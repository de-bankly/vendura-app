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

/**
 * A reusable dialog component for confirming delete actions.
 * Displays a title, message, optional item description, and handles loading/error states.
 * Provides confirm and cancel actions.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.open - Controls the visibility of the dialog.
 * @param {Function} props.onClose - Callback function invoked when the dialog requests to be closed.
 * @param {Function} props.onConfirm - Callback function invoked when the confirm button is clicked.
 * @param {string} [props.title='Löschen bestätigen'] - The title of the dialog. Defaults to 'Löschen bestätigen'.
 * @param {string} [props.message='Sind Sie sicher, dass Sie dieses Element löschen möchten?'] - The main message content of the dialog. Defaults to 'Sind Sie sicher, dass Sie dieses Element löschen möchten?'.
 * @param {boolean} props.loading - If true, shows a loading indicator and disables buttons.
 * @param {string | null | undefined} props.error - An error message to display within the dialog.
 * @param {string | React.ReactNode} [props.itemDescription] - Optional additional details about the item being deleted.
 * @returns {React.ReactElement} The rendered dialog component.
 */
const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  loading,
  error,
  itemDescription,
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
