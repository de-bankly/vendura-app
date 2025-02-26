import React from 'react';
import { Alert as MuiAlert, AlertTitle, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

/**
 * Enhanced Alert component that extends MUI Alert with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Alert = ({
  severity = 'info',
  variant = 'filled',
  title,
  children,
  action,
  onClose,
  icon,
  closeText = 'Close',
  sx = {},
  ...props
}) => {
  return (
    <MuiAlert
      severity={severity}
      variant={variant}
      icon={icon}
      action={
        action ||
        (onClose ? (
          <IconButton aria-label={closeText} color="inherit" size="small" onClick={onClose}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        ) : null)
      }
      sx={{
        borderRadius: 2,
        ...sx,
      }}
      {...props}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </MuiAlert>
  );
};

Alert.propTypes = {
  /** The severity of the alert */
  severity: PropTypes.oneOf(['error', 'warning', 'info', 'success']),
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'filled', 'outlined']),
  /** The title of the alert */
  title: PropTypes.node,
  /** The content of the alert */
  children: PropTypes.node,
  /** The action to display (e.g., a button) */
  action: PropTypes.node,
  /** Callback fired when the alert is closed */
  onClose: PropTypes.func,
  /** Override the icon displayed before the message */
  icon: PropTypes.node,
  /** Text for the close button aria-label */
  closeText: PropTypes.string,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Alert;
