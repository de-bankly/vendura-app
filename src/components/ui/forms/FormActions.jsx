import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * FormActions component that provides consistent layout for form action buttons.
 */
const FormActions = ({
  children,
  direction = 'row',
  spacing = 2,
  justifyContent = 'flex-end',
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction,
        gap: spacing,
        justifyContent,
        mt: 3,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

FormActions.propTypes = {
  /** The action buttons */
  children: PropTypes.node,
  /** The direction of the buttons */
  direction: PropTypes.oneOf(['row', 'column']),
  /** The spacing between buttons in theme spacing units */
  spacing: PropTypes.number,
  /** The justification of the buttons */
  justifyContent: PropTypes.oneOf([
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default FormActions;
