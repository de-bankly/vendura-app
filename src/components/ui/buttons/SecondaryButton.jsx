import React from 'react';
import Button from './Button';
import PropTypes from 'prop-types';

/**
 * Secondary button component with predefined styling for secondary actions.
 * Uses the secondary color from the theme with contained variant by default.
 */
const SecondaryButton = ({ children, ...props }) => {
  return (
    <Button variant="contained" color="secondary" {...props}>
      {children}
    </Button>
  );
};

SecondaryButton.propTypes = {
  /** The content of the button */
  children: PropTypes.node,
};

export default SecondaryButton;
