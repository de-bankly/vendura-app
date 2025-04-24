import { DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '../buttons';

import Dialog from './Dialog';

/**
 * DeleteConfirmationDialog - A reusable dialog for confirming deletion
 */
const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Löschen bestätigen',
  content = 'Sind Sie sicher, dass Sie dieses Element löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
  itemName = '',
  confirmButtonText = 'Löschen',
  cancelButtonText = 'Abbrechen',
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          {itemName ? `${content.replace('dieses Element', `"${itemName}"`)}` : content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelButtonText}</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteConfirmationDialog.propTypes = {
  /**
   * Dialog open state
   */
  open: PropTypes.bool.isRequired,
  /**
   * Callback when dialog is closed
   */
  onClose: PropTypes.func.isRequired,
  /**
   * Callback when deletion is confirmed
   */
  onConfirm: PropTypes.func.isRequired,
  /**
   * Dialog title
   */
  title: PropTypes.string,
  /**
   * Dialog content text
   */
  content: PropTypes.string,
  /**
   * Name of the item being deleted (will be inserted into content)
   */
  itemName: PropTypes.string,
  /**
   * Text for the confirm button
   */
  confirmButtonText: PropTypes.string,
  /**
   * Text for the cancel button
   */
  cancelButtonText: PropTypes.string,
};

export default DeleteConfirmationDialog;
