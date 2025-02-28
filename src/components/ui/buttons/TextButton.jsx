import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

/**
 * Text button component with predefined styling for subtle actions.
 * Uses the text variant by default with primary color.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 */
const TextButton = ({ children, color = 'primary', sx = {}, ...props }) => {
  return (
    <Button
      variant="text"
      color={color}
      elevation={false}
      sx={{
        fontWeight: 500,
        padding: '6px 8px',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

TextButton.propTypes = {
  /** The content of the button */
  children: PropTypes.node,
  /** The color of the button */
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default TextButton;
