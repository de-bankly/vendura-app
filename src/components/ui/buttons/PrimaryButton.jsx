import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

/**
 * Primary button component with predefined styling for primary actions.
 * Uses the primary color from the theme with contained variant by default.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 */
const PrimaryButton = ({ children, elevation = true, sx = {}, ...props }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      elevation={elevation}
      sx={{
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

PrimaryButton.propTypes = {
  /** The content of the button */
  children: PropTypes.node,
  /** If true, the button will have elevation (shadow) */
  elevation: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default PrimaryButton;
