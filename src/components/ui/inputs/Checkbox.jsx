import React from 'react';
import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  FormHelperText,
  FormControl,
  alpha,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Checkbox component with a modern, minimalist design optimized for POS and inventory
 * management systems. Features clean lines, subtle transitions, and consistent styling
 * across the application.
 */
const Checkbox = ({
  label,
  checked,
  onChange,
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  color = 'primary',
  size = 'medium',
  indeterminate = false,
  name = '',
  id = '',
  sx = {},
  labelPlacement = 'end',
  ...props
}) => {
  // Generate a unique ID if not provided
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  // Size-specific styles
  const sizeStyles = {
    small: {
      '& .MuiSvgIcon-root': {
        fontSize: '1rem',
      },
      '& .MuiFormControlLabel-label': {
        fontSize: '0.875rem',
      },
    },
    medium: {
      '& .MuiSvgIcon-root': {
        fontSize: '1.25rem',
      },
    },
  };

  return (
    <FormControl
      error={error}
      required={required}
      disabled={disabled}
      sx={{
        marginLeft: labelPlacement === 'start' ? 0 : -1.5,
        marginRight: labelPlacement === 'end' ? 0 : -1.5,
      }}
    >
      <FormControlLabel
        control={
          <MuiCheckbox
            checked={checked}
            onChange={onChange}
            color={color}
            size={size}
            indeterminate={indeterminate}
            name={name}
            id={checkboxId}
            sx={{
              padding: size === 'small' ? '4px' : '8px',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: theme => !disabled && alpha(theme.palette.action.hover, 0.08),
              },
              '&.Mui-checked': {
                color: error ? 'error.main' : undefined,
              },
              '&.Mui-focused': {
                boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
              },
              ...(sizeStyles[size] || {}),
              ...sx,
            }}
            {...props}
          />
        }
        label={
          <span
            style={{
              fontWeight: 400,
              opacity: disabled ? 0.6 : 1,
              transition: 'opacity 0.2s ease-in-out',
            }}
          >
            {label}
          </span>
        }
        labelPlacement={labelPlacement}
        sx={{
          marginLeft: 0,
          marginRight: 0,
        }}
      />
      {helperText && (
        <FormHelperText
          sx={{
            marginLeft: labelPlacement === 'end' ? '30px' : '2px',
            fontSize: '0.75rem',
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

Checkbox.propTypes = {
  /** The label content */
  label: PropTypes.node,
  /** If true, the checkbox is checked */
  checked: PropTypes.bool,
  /** Callback fired when the state is changed */
  onChange: PropTypes.func,
  /** If true, the checkbox will indicate an error */
  error: PropTypes.bool,
  /** The helper text content */
  helperText: PropTypes.node,
  /** If true, the checkbox is marked as required */
  required: PropTypes.bool,
  /** If true, the checkbox is disabled */
  disabled: PropTypes.bool,
  /** The color of the checkbox */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
    'default',
  ]),
  /** The size of the checkbox */
  size: PropTypes.oneOf(['small', 'medium']),
  /** If true, the checkbox appears indeterminate */
  indeterminate: PropTypes.bool,
  /** Name attribute of the checkbox element */
  name: PropTypes.string,
  /** The id of the checkbox element */
  id: PropTypes.string,
  /** The placement of the label */
  labelPlacement: PropTypes.oneOf(['end', 'start', 'top', 'bottom']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Checkbox;
