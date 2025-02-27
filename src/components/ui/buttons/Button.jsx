import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Button component that extends MUI Button with additional functionality
 * like loading state and consistent styling based on the Vendura theme.
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
  ...props
}) => {
  // Determine what to render inside the button based on loading state
  const buttonContent = loading ? (
    <>
      <CircularProgress size={24} color="inherit" style={{ marginRight: children ? 8 : 0 }} />
      {children}
    </>
  ) : (
    children
  );

  return (
    <MuiButton
      variant={variant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={!loading ? startIcon : null}
      endIcon={!loading ? endIcon : null}
      onClick={onClick}
      type={type}
      {...props}
    >
      {buttonContent}
    </MuiButton>
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
};

export default Button;
