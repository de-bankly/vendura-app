import React from 'react';
import { TextField as MuiTextField, InputAdornment, alpha } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced TextField component that extends MUI TextField with a modern, minimalist design
 * optimized for POS and inventory management systems. Features clean lines, subtle transitions,
 * and consistent styling across the application.
 */
const TextField = ({
  label,
  value,
  onChange,
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  startAdornment = null,
  endAdornment = null,
  type = 'text',
  placeholder = '',
  multiline = false,
  rows = 1,
  maxRows = undefined,
  name = '',
  id = '',
  autoFocus = false,
  autoComplete = '',
  sx = {},
  ...props
}) => {
  // Prepare input props with adornments if provided
  const inputProps = {};

  if (startAdornment) {
    inputProps.startAdornment = <InputAdornment position="start">{startAdornment}</InputAdornment>;
  }

  if (endAdornment) {
    inputProps.endAdornment = <InputAdornment position="end">{endAdornment}</InputAdornment>;
  }

  // Size-specific styles
  const sizeStyles = {
    small: {
      '& .MuiInputBase-input': {
        padding: '8px 12px',
        fontSize: '0.875rem',
      },
      '& .MuiInputLabel-root': {
        fontSize: '0.875rem',
      },
    },
    medium: {
      '& .MuiInputBase-input': {
        padding: '12px 14px',
        fontSize: '1rem',
      },
    },
  };

  return (
    <MuiTextField
      label={label}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      fullWidth={fullWidth}
      variant={variant}
      size={size}
      type={type}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      maxRows={maxRows}
      name={name}
      id={id || name}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      InputProps={Object.keys(inputProps).length > 0 ? inputProps : undefined}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          transition: 'all 0.2s ease-in-out',
          backgroundColor: theme =>
            disabled
              ? alpha(theme.palette.action.disabled, 0.05)
              : alpha(theme.palette.background.paper, 0.8),
          '&:hover': {
            backgroundColor: theme => !disabled && alpha(theme.palette.background.paper, 1),
          },
          '&.Mui-focused': {
            backgroundColor: theme => theme.palette.background.paper,
            boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
          },
        },
        '& .MuiInputLabel-root': {
          fontWeight: 500,
          transition: 'all 0.2s ease-in-out',
        },
        '& .MuiInputBase-input': {
          fontWeight: 400,
        },
        '& .MuiFormHelperText-root': {
          marginLeft: '2px',
          fontSize: '0.75rem',
        },
        ...(sizeStyles[size] || {}),
        ...sx,
      }}
      {...props}
    />
  );
};

TextField.propTypes = {
  /** The label content */
  label: PropTypes.node,
  /** The value of the input element */
  value: PropTypes.any,
  /** Callback fired when the value is changed */
  onChange: PropTypes.func,
  /** If true, the input will indicate an error */
  error: PropTypes.bool,
  /** The helper text content */
  helperText: PropTypes.node,
  /** If true, the label is displayed as required */
  required: PropTypes.bool,
  /** If true, the input element is disabled */
  disabled: PropTypes.bool,
  /** If true, the input will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
  /** The size of the component */
  size: PropTypes.oneOf(['small', 'medium']),
  /** The element to be displayed at the start of the input */
  startAdornment: PropTypes.node,
  /** The element to be displayed at the end of the input */
  endAdornment: PropTypes.node,
  /** Type of the input element */
  type: PropTypes.string,
  /** The short hint displayed in the input before the user enters a value */
  placeholder: PropTypes.string,
  /** If true, a textarea element will be rendered */
  multiline: PropTypes.bool,
  /** Number of rows to display when multiline option is set to true */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Maximum number of rows to display when multiline option is set to true */
  maxRows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Name attribute of the input element */
  name: PropTypes.string,
  /** The id of the input element */
  id: PropTypes.string,
  /** If true, the input element is focused during the first mount */
  autoFocus: PropTypes.bool,
  /** The autocomplete attribute of the input element */
  autoComplete: PropTypes.string,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default TextField;
