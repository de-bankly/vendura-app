import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * StatusBadge component for displaying status indicators.
 * Provides a consistent way to show status information.
 */
const StatusBadge = ({
  label,
  status = 'default',
  size = 'medium',
  variant = 'contained',
  sx = {},
  ...props
}) => {
  // Define status colors
  const statusColors = {
    success: {
      main: '#4caf50',
      light: '#e8f5e9',
      text: '#1b5e20',
    },
    warning: {
      main: '#ff9800',
      light: '#fff3e0',
      text: '#e65100',
    },
    error: {
      main: '#f44336',
      light: '#ffebee',
      text: '#b71c1c',
    },
    info: {
      main: '#2196f3',
      light: '#e3f2fd',
      text: '#0d47a1',
    },
    default: {
      main: '#9e9e9e',
      light: '#f5f5f5',
      text: '#212121',
    },
    primary: {
      main: '#0043C1',
      light: '#e3f2fd',
      text: '#0043C1',
    },
    secondary: {
      main: '#018abc',
      light: '#e0f7fa',
      text: '#018abc',
    },
  };

  // Define size styles
  const sizeStyles = {
    small: {
      px: 1,
      py: 0.25,
      fontSize: '0.75rem',
      borderRadius: 1,
    },
    medium: {
      px: 1.5,
      py: 0.5,
      fontSize: '0.875rem',
      borderRadius: 1.5,
    },
    large: {
      px: 2,
      py: 0.75,
      fontSize: '1rem',
      borderRadius: 2,
    },
  };

  // Get the color for the current status
  const color = statusColors[status] || statusColors.default;

  // Determine styles based on variant
  const variantStyles =
    variant === 'contained'
      ? {
          backgroundColor: color.main,
          color: '#ffffff',
        }
      : {
          backgroundColor: color.light,
          color: color.text,
          border: `1px solid ${color.main}`,
        };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sizeStyles[size],
        ...variantStyles,
        ...sx,
      }}
      {...props}
    >
      <Typography
        variant="body2"
        component="span"
        sx={{
          fontWeight: 600,
          lineHeight: 1,
          textTransform: 'capitalize',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

StatusBadge.propTypes = {
  /** The label to display */
  label: PropTypes.node.isRequired,
  /** The status to display */
  status: PropTypes.oneOf([
    'success',
    'warning',
    'error',
    'info',
    'default',
    'primary',
    'secondary',
  ]),
  /** The size of the badge */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** The variant of the badge */
  variant: PropTypes.oneOf(['contained', 'outlined']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default StatusBadge;
