import React from 'react';
import { IconButton as MuiIconButton, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Icon button component for icon-only actions.
 * Extends MUI IconButton with additional functionality like loading state.
 */
const IconButton = ({
  children,
  color = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  edge = false,
  ...props
}) => {
  return (
    <MuiIconButton
      color={color}
      size={size}
      disabled={disabled || loading}
      onClick={onClick}
      edge={edge}
      {...props}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : children}
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
};

export default IconButton;
