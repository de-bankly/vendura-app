import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Box, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '../../components/ui/buttons';

import Dialog from './Dialog';

/**
 * DialogSystem component that provides a standardized way to display different types of dialogs
 * (information, warning, error, confirmation) with consistent styling and behavior.
 */
const DialogSystem = ({
  open,
  onClose,
  type = 'info',
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmButtonProps = {},
  cancelButtonProps = {},
  ...dialogProps
}) => {
  const theme = useTheme();

  // Define type-specific properties
  const typeConfig = {
    info: {
      icon: <InfoOutlinedIcon fontSize="large" color="info" />,
      color: theme.palette.info.main,
      confirmColor: 'info',
    },
    warning: {
      icon: <WarningAmberOutlinedIcon fontSize="large" color="warning" />,
      color: theme.palette.warning.main,
      confirmColor: 'warning',
    },
    error: {
      icon: <ErrorOutlineOutlinedIcon fontSize="large" color="error" />,
      color: theme.palette.error.main,
      confirmColor: 'error',
    },
    confirm: {
      icon: <HelpOutlineOutlinedIcon fontSize="large" color="primary" />,
      color: theme.palette.primary.main,
      confirmColor: 'primary',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  // Handle confirmation
  const handleConfirm = event => {
    if (onConfirm) {
      onConfirm(event);
    }
    if (onClose) {
      onClose(event);
    }
  };

  // Handle cancellation
  const handleCancel = event => {
    if (onCancel) {
      onCancel(event);
    }
    if (onClose) {
      onClose(event);
    }
  };

  // Dialog content with icon and message
  const dialogContent = (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: theme.spacing(1) }}>
      <Box sx={{ mr: theme.spacing(2), mt: theme.spacing(0.5) }}>{config.icon}</Box>
      <Typography variant="body1">{message}</Typography>
    </Box>
  );

  // Dialog actions based on type
  const dialogActions = (
    <>
      {(type === 'confirm' || type === 'warning' || type === 'error') && (
        <Button onClick={handleCancel} color="inherit" variant="outlined" {...cancelButtonProps}>
          {cancelLabel}
        </Button>
      )}
      <Button
        onClick={handleConfirm}
        color={config.confirmColor}
        variant="contained"
        autoFocus
        {...confirmButtonProps}
      >
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      content={dialogContent}
      actions={dialogActions}
      maxWidth="xs"
      {...dialogProps}
    />
  );
};

DialogSystem.propTypes = {
  /** If true, the dialog is open */
  open: PropTypes.bool.isRequired,
  /** Callback fired when the dialog is closed */
  onClose: PropTypes.func,
  /** The type of dialog to display */
  type: PropTypes.oneOf(['info', 'warning', 'error', 'confirm']),
  /** The title of the dialog */
  title: PropTypes.string.isRequired,
  /** The message to display in the dialog */
  message: PropTypes.node.isRequired,
  /** The label for the confirm button */
  confirmLabel: PropTypes.string,
  /** The label for the cancel button */
  cancelLabel: PropTypes.string,
  /** Callback fired when the confirm button is clicked */
  onConfirm: PropTypes.func,
  /** Callback fired when the cancel button is clicked */
  onCancel: PropTypes.func,
  /** Additional props for the confirm button */
  confirmButtonProps: PropTypes.object,
  /** Additional props for the cancel button */
  cancelButtonProps: PropTypes.object,
};

export default DialogSystem;
