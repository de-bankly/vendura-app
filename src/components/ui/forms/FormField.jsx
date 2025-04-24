import { Box, FormHelperText, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * FormField component that provides consistent layout and error handling
 * for form inputs.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The input component. Must be a single React element.
 * @param {React.ReactNode} [props.label] - The label for the field.
 * @param {boolean} [props.required=false] - If true, the field is marked as required.
 * @param {boolean} [props.error=false] - If true, the field will indicate an error state.
 * @param {React.ReactNode} [props.helperText=''] - The helper text content displayed below the input.
 * @param {boolean} [props.fullWidth=true] - If true, the field will take up the full width of its container.
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles for the root Box element.
 * @returns {React.ReactElement} The rendered FormField component.
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

  const childElement = React.Children.only(children);

  const enhancedChild = React.cloneElement(childElement, {
    required,
    error,
    helperText: '', // Pass empty helperText to child, FormField handles it
    fullWidth,
    ...childElement.props, // Preserve original props of the child
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
  /** The input component (must be a single React element) */
  children: PropTypes.node.isRequired,
  /** The label for the field */
  label: PropTypes.node,
  /** If true, the field is marked as required */
  required: PropTypes.bool,
  /** If true, the field will indicate an error state */
  error: PropTypes.bool,
  /** The helper text content displayed below the input */
  helperText: PropTypes.node,
  /** If true, the field will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles for the root Box element */
  sx: PropTypes.object,
};

export default FormField;
