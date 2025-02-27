import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

/**
 * Primary button component with predefined styling for primary actions.
 * Uses the primary color from the theme with contained variant by default.
 */
const PrimaryButton = ({ children, ...props }) => {
  return (
    <Button variant="contained" color="primary" {...props}>
      {children}
    </Button>
  );
};

PrimaryButton.propTypes = {
  /** The content of the button */
  children: PropTypes.node,
};

export default PrimaryButton;
