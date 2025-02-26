import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

/**
 * Text button component with predefined styling for subtle actions.
 * Uses the text variant by default with primary color.
 */
const TextButton = ({ children, color = 'primary', ...props }) => {
  return (
    <Button variant="text" color={color} {...props}>
      {children}
    </Button>
  );
};

TextButton.propTypes = {
  /** The content of the button */
  children: PropTypes.node,
  /** The color of the button */
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'info', 'warning']),
};

export default TextButton;
