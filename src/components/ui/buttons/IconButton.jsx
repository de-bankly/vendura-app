import React from 'react';
import { IconButton as MuiIconButton, CircularProgress, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Icon button component for icon-only actions.
 * Extends MUI IconButton with additional functionality like loading state.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 */
const IconButton = ({
  children,
  color = 'default',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  edge = false,
  variant = 'standard',
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  // Size-specific styles
  const sizeMap = {
    small: {
      padding: variant === 'contained' || variant === 'outlined' ? 6 : 4,
      fontSize: '1.25rem',
    },
    medium: {
      padding: variant === 'contained' || variant === 'outlined' ? 8 : 6,
      fontSize: '1.5rem',
    },
    large: {
      padding: variant === 'contained' || variant === 'outlined' ? 12 : 8,
      fontSize: '1.75rem',
    },
  };

  // Variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'contained':
        return {
          backgroundColor: theme.palette[color]?.main || 'inherit',
          color: theme.palette[color]?.contrastText || 'inherit',
          '&:hover': {
            backgroundColor: theme.palette[color]?.dark || 'inherit',
            transform: 'translateY(-2px)',
          },
          boxShadow: theme.shadows[2],
        };
      case 'outlined':
        return {
          border: `1.5px solid ${theme.palette[color]?.main || theme.palette.divider}`,
          '&:hover': {
            backgroundColor: `${theme.palette[color]?.main}10`,
            transform: 'translateY(-2px)',
          },
        };
      default:
        return {};
    }
  };

  return (
    <MuiIconButton
      color={variant === 'standard' ? color : 'inherit'}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      edge={edge}
      sx={{
        borderRadius: '8px',
        transition: 'all 0.2s ease-in-out',
        ...sizeMap[size],
        ...getVariantStyles(),
        ...sx,
      }}
      {...props}
    >
      {loading ? (
        <CircularProgress
          size={size === 'small' ? 16 : size === 'large' ? 28 : 22}
          color="inherit"
          thickness={4}
        />
      ) : (
        children
      )}
    </MuiIconButton>
  );
};

IconButton.propTypes = {
  /** The icon element */
  children: PropTypes.node.isRequired,
  /** The color of the button */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
    'default',
    'inherit',
  ]),
  /** The size of the button */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** If true, the button will be disabled */
  disabled: PropTypes.bool,
  /** If true, the button will show a loading spinner */
  loading: PropTypes.bool,
  /** Callback fired when the button is clicked */
  onClick: PropTypes.func,
  /** If set to true, the button will be positioned for an edge case */
  edge: PropTypes.oneOf(['start', 'end', false]),
  /** The variant of the button */
  variant: PropTypes.oneOf(['standard', 'contained', 'outlined']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default IconButton;
