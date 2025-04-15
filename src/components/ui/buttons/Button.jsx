import React from 'react';
import { Button as MuiButton, CircularProgress, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';

/**
 * Enhanced Button component that extends MUI Button with additional functionality
 * like loading state and consistent styling based on the Vendura theme.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 */
const Button = ({
  children,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon = null,
  endIcon = null,
  onClick,
  type = 'button',
  rounded = false,
  elevation = true,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  // Determine what to render inside the button based on loading state
  const buttonContent = loading ? (
    <>
      <CircularProgress
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
        color="inherit"
        thickness={4}
        style={{ marginRight: children ? 8 : 0 }}
      />
      {children}
    </>
  ) : (
    children
  );

  // Size-specific styles
  const sizeStyles = {
    small: {
      padding: '6px 16px',
      fontSize: '0.8125rem',
    },
    medium: {
      padding: '8px 20px',
      fontSize: '0.875rem',
    },
    large: {
      padding: '10px 22px',
      fontSize: '0.9375rem',
    },
  };

  const StyledButton = styled(MuiButton, {
    shouldForwardProp: prop => prop !== 'loading' && prop !== 'rounded' && prop !== 'elevation',
  })(({ theme, size, variant, rounded, elevation, loading }) => {
    // Base styles from component - remove styles now handled by theme
    const baseStyles = {
      textTransform: 'none',
      transition: 'all 0.2s ease-in-out',
      borderRadius: theme.shape.borderRadius,
      // ... rest of baseStyles
    };
    // ... rest of styled component logic
  });

  return (
    <StyledButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      onClick={onClick}
      type={type}
      sx={{
        borderRadius: rounded ? '50px' : '8px',
        textTransform: 'none',
        boxShadow: variant === 'contained' && elevation ? theme.shadows[2] : 'none',
        '&:hover': {
          boxShadow: variant === 'contained' && elevation ? theme.shadows[4] : 'none',
          transform: elevation ? 'translateY(-2px)' : 'none',
        },
        ...sizeStyles[size],
        ...sx,
      }}
      {...props}
    >
      {buttonContent}
    </StyledButton>
  );
};

Button.propTypes = {
  /** The content of the button */
  children: PropTypes.node,
  /** The variant to use */
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  /** The color of the button */
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
  /** The size of the button */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** If true, the button will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** If true, the button will be disabled */
  disabled: PropTypes.bool,
  /** If true, the button will show a loading spinner */
  loading: PropTypes.bool,
  /** Element placed before the children */
  startIcon: PropTypes.node,
  /** Element placed after the children */
  endIcon: PropTypes.node,
  /** Callback fired when the button is clicked */
  onClick: PropTypes.func,
  /** The type of button */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /** If true, the button will have rounded corners (pill shape) */
  rounded: PropTypes.bool,
  /** If true, the button will have elevation (shadow) */
  elevation: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Button;
