import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';

/**
 * Base Form component that provides a consistent structure for forms
 * with built-in submission handling.
 */
const Form = ({
  children,
  onSubmit,
  noValidate = true,
  autoComplete = 'off',
  spacing = 2,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  // Handle form submission
  const handleSubmit = useCallback(
    event => {
      event.preventDefault();
      if (onSubmit) {
        onSubmit(event);
      }
    },
    [onSubmit]
  );

  return (
    <Box
      component="form"
      noValidate={noValidate}
      autoComplete={autoComplete}
      onSubmit={handleSubmit}
      sx={{
        width: '100%',
        '& > *:not(:last-child)': {
          marginBottom: theme.spacing(spacing),
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
};

Form.propTypes = {
  /** The content of the form */
  children: PropTypes.node,
  /** Callback fired when the form is submitted */
  onSubmit: PropTypes.func,
  /** If true, the browser's default validation will be disabled */
  noValidate: PropTypes.bool,
  /** The autocomplete attribute for the form */
  autoComplete: PropTypes.string,
  /** The spacing between form elements in theme spacing units */
  spacing: PropTypes.number,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Form;
