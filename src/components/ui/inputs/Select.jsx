import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  alpha,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Select component with a modern, minimalist design optimized for POS and inventory
 * management systems. Features clean lines, subtle transitions, and consistent styling
 * across the application.
 */
const Select = ({
  label,
  value = '',
  onChange,
  options = [],
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  fullWidth = true,
  variant = 'outlined',
  size = 'medium',
  placeholder = '',
  multiple = false,
  name = '',
  id = '',
  sx = {},
  ...props
}) => {
  // Generate a unique ID for the label if not provided
  const selectId =
    id ||
    name ||
    `select-${label?.replace(/\s+/g, '-').toLowerCase() || Math.random().toString(36).substring(2, 9)}`;

  // Size-specific styles
  const sizeStyles = {
    small: {
      '& .MuiInputBase-input': {
        padding: '8px 32px 8px 12px',
        fontSize: '0.875rem',
      },
      '& .MuiInputLabel-root': {
        fontSize: '0.875rem',
      },
      '& .MuiMenuItem-root': {
        fontSize: '0.875rem',
        minHeight: '32px',
      },
    },
    medium: {
      '& .MuiInputBase-input': {
        padding: '12px 32px 12px 14px',
        fontSize: '1rem',
      },
      '& .MuiMenuItem-root': {
        minHeight: '40px',
      },
    },
  };

  return (
    <FormControl
      variant={variant}
      fullWidth={fullWidth}
      error={error}
      required={required}
      disabled={disabled}
      size={size}
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
        '& .MuiSelect-select': {
          fontWeight: 400,
        },
        '& .MuiFormHelperText-root': {
          marginLeft: '2px',
          fontSize: '0.75rem',
        },
        ...(sizeStyles[size] || {}),
        ...sx,
      }}
    >
      {label && <InputLabel id={`${selectId}-label`}>{label}</InputLabel>}

      <MuiSelect
        labelId={`${selectId}-label`}
        id={selectId}
        value={value}
        onChange={onChange}
        label={label}
        name={name}
        multiple={multiple}
        displayEmpty={!!placeholder}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '8px',
              boxShadow: theme => `0 4px 20px ${alpha(theme.palette.common.black, 0.1)}`,
              marginTop: '4px',
              maxHeight: '300px',
            },
          },
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
          transformOrigin: {
            vertical: 'top',
            horizontal: 'left',
          },
        }}
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}

        {options.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{
              transition: 'background-color 0.15s ease-in-out',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

Select.propTypes = {
  /** The label content */
  label: PropTypes.node,
  /** The value of the select element */
  value: PropTypes.any,
  /** Callback fired when the value is changed */
  onChange: PropTypes.func,
  /** Array of options for the select */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired,
    })
  ),
  /** If true, the select will indicate an error */
  error: PropTypes.bool,
  /** The helper text content */
  helperText: PropTypes.node,
  /** If true, the label is displayed as required */
  required: PropTypes.bool,
  /** If true, the select element is disabled */
  disabled: PropTypes.bool,
  /** If true, the select will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
  /** The size of the component */
  size: PropTypes.oneOf(['small', 'medium']),
  /** The short hint displayed when no option is selected */
  placeholder: PropTypes.string,
  /** If true, multiple options can be selected */
  multiple: PropTypes.bool,
  /** Name attribute of the select element */
  name: PropTypes.string,
  /** The id of the select element */
  id: PropTypes.string,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Select;
