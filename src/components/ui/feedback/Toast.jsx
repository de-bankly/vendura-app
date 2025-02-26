import React from 'react';
import { Snackbar, Alert as MuiAlert } from '@mui/material';
import PropTypes from 'prop-types';
import Alert from './Alert';

/**
 * Toast component for displaying temporary notifications.
 * Uses MUI Snackbar with our custom Alert component.
 */
const Toast = ({
  open,
  onClose,
  message,
  severity = 'info',
  title,
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'left' },
  action,
  variant = 'filled',
  sx = {},
  ...props
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if (onClose) {
      onClose(event, reason);
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      {...props}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant={variant}
        title={title}
        action={action}
        sx={{
          width: '100%',
          ...sx,
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

Toast.propTypes = {
  /** If true, the toast is shown */
  open: PropTypes.bool.isRequired,
  /** Callback fired when the toast is closed */
  onClose: PropTypes.func,
  /** The message to display */
  message: PropTypes.node,
  /** The severity of the toast */
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  /** The title of the toast */
  title: PropTypes.node,
  /** The number of milliseconds to wait before automatically closing */
  autoHideDuration: PropTypes.number,
  /** The anchor origin of the toast */
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'center', 'right']),
  }),
  /** The action to display (e.g., a button) */
  action: PropTypes.node,
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'filled', 'outlined']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Toast;
