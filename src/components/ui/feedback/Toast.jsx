import { Snackbar, Alert as MuiAlert, useTheme, Paper, Box, alpha } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Toast component for displaying temporary notifications.
 * Uses MUI Snackbar and MUI Alert with styling consistent with the Vendura design system.
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
  const theme = useTheme();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    if (onClose) {
      onClose(event, reason);
    }
  };

  // Get severity-based color from theme
  const getSeverityColor = () => {
    switch (severity) {
      case 'success':
        return theme.palette.success;
      case 'error':
        return theme.palette.error;
      case 'warning':
        return theme.palette.warning;
      case 'info':
      default:
        return theme.palette.info;
    }
  };

  const color = getSeverityColor();

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={anchorOrigin}
      sx={{
        // Position is controlled by the ToastProvider
        left: { xs: '16px', sm: '24px' },
        right: 'auto',
        ...sx,
      }}
      TransitionProps={{
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
        ...(props.TransitionProps || {}),
      }}
      {...props}
    >
      <Paper
        elevation={3}
        sx={{
          overflow: 'hidden',
          borderRadius: theme.shape.borderRadius * 1.5,
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[4],
          transition: 'all 0.2s ease-in-out',
          border: `1px solid ${alpha(color.main, 0.12)}`,
          transform: 'translateY(0)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: theme.shadows[6],
          },
        }}
      >
        <MuiAlert
          severity={severity}
          variant="standard"
          action={action}
          onClose={handleClose}
          sx={{
            width: '100%',
            border: 'none',
            borderLeft: `4px solid ${color.main}`,
            borderRadius: 0,
            padding: theme.spacing(1.5, 2),
            backgroundColor: 'transparent',
            '& .MuiAlert-icon': {
              color: color.main,
              opacity: 0.9,
              marginRight: theme.spacing(1.5),
            },
            '& .MuiAlert-message': {
              padding: theme.spacing(1, 0),
              color: theme.palette.text.primary,
            },
            '& .MuiAlert-action': {
              marginRight: 0,
              padding: 0,
              alignSelf: 'center',
            },
          }}
        >
          {title && <Box sx={{ fontWeight: 600, mb: 0.5, fontSize: '0.875rem' }}>{title}</Box>}
          <Box sx={{ fontSize: '0.8125rem' }}>{message}</Box>
        </MuiAlert>
      </Paper>
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
