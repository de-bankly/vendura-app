import { Box, FormHelperText, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * FormField component that provides consistent layout and error handling
 * for form inputs.
 */
const FormField = ({
  children,
  label,
  required = false,
  error = false,
  helperText = '',
  fullWidth = true,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  // Clone the child element to pass down props
  const childElement = React.Children.only(children);

  const enhancedChild = React.cloneElement(childElement, {
    required,
    error,
    helperText: '', // We'll handle the helper text ourselves
    fullWidth,
    ...childElement.props,
    // Don't override any props explicitly set on the child
  });

  return (
    <Box
      sx={{
        width: fullWidth ? '100%' : 'auto',
        ...sx,
      }}
      {...props}
    >
      {label && (
        <Typography
          component="label"
          variant="body2"
          color={error ? 'error' : 'text.secondary'}
          sx={{
            display: 'block',
            mb: theme.spacing(0.5),
            fontWeight: 500,
          }}
        >
          {label}
          {required && (
            <Typography component="span" color="error" sx={{ ml: theme.spacing(0.5) }}>
              *
            </Typography>
          )}
        </Typography>
      )}

      {enhancedChild}

      {helperText && (
        <FormHelperText error={error} sx={{ mt: theme.spacing(0.5) }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

FormField.propTypes = {
  /** The input component */
  children: PropTypes.node.isRequired,
  /** The label for the field */
  label: PropTypes.node,
  /** If true, the field is marked as required */
  required: PropTypes.bool,
  /** If true, the field will indicate an error */
  error: PropTypes.bool,
  /** The helper text content */
  helperText: PropTypes.node,
  /** If true, the field will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default FormField;
