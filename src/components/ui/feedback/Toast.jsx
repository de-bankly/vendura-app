import { Snackbar, Alert as MuiAlert, useTheme, Paper, Box, alpha } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Toast component for displaying temporary notifications.
 * Uses MUI Snackbar and MUI Alert with styling consistent with the Vendura design system.
 * @param {object} props - The component props.
 * @param {boolean} props.open - If true, the toast is shown.
 * @param {function} [props.onClose] - Callback fired when the toast is closed.
 * @param {React.ReactNode} [props.message] - The message to display.
 * @param {'error'|'warning'|'info'|'success'} [props.severity='info'] - The severity of the toast.
 * @param {React.ReactNode} [props.title] - The title of the toast.
 * @param {number} [props.autoHideDuration=6000] - The number of milliseconds to wait before automatically closing.
 * @param {object} [props.anchorOrigin={ vertical: 'bottom', horizontal: 'left' }] - The anchor origin of the toast.
 * @param {React.ReactNode} [props.action] - The action to display (e.g., a button).
 * @param {'standard'|'filled'|'outlined'} [props.variant='filled'] - The variant to use (Note: internal MuiAlert uses 'standard').
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles.
 * @param {object} [props.TransitionProps] - Props applied to the transition element.
 * @returns {React.ReactElement} The rendered Toast component.
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
        width: { xs: 'calc(100% - 32px)', sm: '320px' },
        maxWidth: '100%',
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
        elevation={6}
        sx={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: theme.shape.borderRadius * 1.5,
          backgroundColor: theme.palette.common.white,
          boxShadow: `0 6px 16px 0 ${alpha(
            theme.palette.common.black,
            0.12
          )}, 0 3px 6px -4px ${alpha(theme.palette.common.black, 0.12)}`,
          transition: 'all 0.2s ease-in-out',
          border: `2px solid ${color.main}`,
          transform: 'translateY(0)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 8px 24px 0 ${alpha(
              theme.palette.common.black,
              0.15
            )}, 0 3px 8px -4px ${alpha(theme.palette.common.black, 0.15)}`,
          },
        }}
      >
        <MuiAlert
          severity={severity}
          variant="standard"
          action={action}
          onClose={onClose ? handleClose : undefined}
          sx={{
            width: '100%',
            border: 'none',
            borderLeft: `4px solid ${color.main}`,
            borderRadius: 0,
            padding: theme.spacing(1.5, 2),
            backgroundColor: 'transparent',
            '& .MuiAlert-icon': {
              color: color.main,
              opacity: 1,
              marginRight: theme.spacing(1.5),
              fontSize: '1.25rem',
            },
            '& .MuiAlert-message': {
              padding: theme.spacing(1, 0),
              color: theme.palette.text.primary,
            },
            '& .MuiAlert-action': {
              marginRight: 0,
              padding: 0,
              alignSelf: 'center',
              color: theme.palette.text.secondary,
            },
          }}
        >
          {title && (
            <Box
              sx={{
                fontWeight: 700,
                mb: 0.5,
                fontSize: '0.9rem',
                color: color.main,
              }}
            >
              {title}
            </Box>
          )}
          <Box sx={{ fontSize: '0.8125rem', color: theme.palette.text.primary }}>{message}</Box>
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
  /** The variant to use (Note: internal MuiAlert uses 'standard') */
  variant: PropTypes.oneOf(['standard', 'filled', 'outlined']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
  /** Props applied to the transition element. */
  TransitionProps: PropTypes.object,
};

export default Toast;
