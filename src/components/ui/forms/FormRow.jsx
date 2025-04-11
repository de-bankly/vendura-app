import React from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';

/**
 * FormRow component that allows placing form fields in a horizontal row
 * with responsive behavior.
 */
const FormRow = ({ children, spacing = 2, sx = {}, ...props }) => {
  // Count the number of children to calculate the width
  const childCount = React.Children.count(children);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: spacing,
        width: '100%',
        ...sx,
      }}
      {...props}
    >
      {React.Children.map(children, child => (
        <Box
          sx={{
            flex: {
              xs: '1 1 100%',
              md: `1 1 calc(${100 / childCount}% - ${(spacing * (childCount - 1)) / childCount}px)`,
            },
          }}
        >
          {child}
        </Box>
      ))}
    </Box>
  );
};

FormRow.propTypes = {
  /** The form fields */
  children: PropTypes.node,
  /** The spacing between form fields in theme spacing units */
  spacing: PropTypes.number,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default FormRow;
