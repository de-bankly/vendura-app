import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

/**
 * Secondary button component with predefined styling for secondary actions.
 * Uses the secondary color from the theme with contained variant by default.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 */
const SecondaryButton = ({ children, elevation = true, sx = {}, ...props }) => {
  return (
    <Button
      variant="contained"
      color="secondary"
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

SecondaryButton.propTypes = {
  /** The content of the button */
  children: PropTypes.node,
  /** If true, the button will have elevation (shadow) */
  elevation: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default SecondaryButton;
