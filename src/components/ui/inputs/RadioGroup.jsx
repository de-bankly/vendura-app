import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  alpha,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced RadioGroup component with a modern, minimalist design optimized for POS and inventory
 * management systems. Features clean lines, subtle transitions, and consistent styling
 * across the application.
 */
const RadioGroup = ({
  label,
  value,
  onChange,
  options = [],
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  row = false,
  color = 'primary',
  size = 'medium',
  name = '',
  id = '',
  sx = {},
  ...props
}) => {
  // Generate a unique ID if not provided
  const radioGroupId = id || name || `radio-group-${Math.random().toString(36).substring(2, 9)}`;

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
        width: '100%',
        ...sx,
      }}
    >
      {label && (
        <FormLabel
          id={`${radioGroupId}-label`}
          sx={{
            fontWeight: 500,
            fontSize: size === 'small' ? '0.875rem' : '1rem',
            color: 'text.primary',
            '&.Mui-focused': {
              color: theme => (error ? theme.palette.error.main : theme.palette.primary.main),
            },
            '&.Mui-disabled': {
              opacity: 0.6,
            },
            marginBottom: '8px',
          }}
        >
          {label}
        </FormLabel>
      )}

      <MuiRadioGroup
        aria-labelledby={`${radioGroupId}-label`}
        name={name}
        value={value}
        onChange={onChange}
        row={row}
        sx={{
          ...(sizeStyles[size] || {}),
        }}
        {...props}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <Radio
                color={color}
                size={size}
                disabled={option.disabled || disabled}
                sx={{
                  padding: size === 'small' ? '4px' : '8px',
                  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: theme =>
                      !(option.disabled || disabled) && alpha(theme.palette.action.hover, 0.08),
                  },
                  '&.Mui-focused': {
                    boxShadow: theme => `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                }}
              />
            }
            label={
              <span
                style={{
                  fontWeight: 400,
                  opacity: option.disabled || disabled ? 0.6 : 1,
                  transition: 'opacity 0.2s ease-in-out',
                }}
              >
                {option.label}
              </span>
            }
            disabled={option.disabled || disabled}
            sx={{
              marginLeft: 0,
              marginRight: row ? '16px' : 0,
              marginBottom: row ? 0 : '8px',
            }}
          />
        ))}
      </MuiRadioGroup>

      {helperText && (
        <FormHelperText
          sx={{
            marginLeft: '2px',
            fontSize: '0.75rem',
            marginTop: '4px',
          }}
        >
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

RadioGroup.propTypes = {
  /** The label content */
  label: PropTypes.node,
  /** The value of the selected radio button */
  value: PropTypes.any,
  /** Callback fired when a radio button is selected */
  onChange: PropTypes.func,
  /** Array of options for the radio buttons */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  /** If true, the radio group will indicate an error */
  error: PropTypes.bool,
  /** The helper text content */
  helperText: PropTypes.node,
  /** If true, the label is displayed as required */
  required: PropTypes.bool,
  /** If true, the radio group is disabled */
  disabled: PropTypes.bool,
  /** If true, the radio buttons will be arranged horizontally */
  row: PropTypes.bool,
  /** The color of the radio buttons */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
    'default',
  ]),
  /** The size of the radio buttons */
  size: PropTypes.oneOf(['small', 'medium']),
  /** Name attribute of the radio button elements */
  name: PropTypes.string,
  /** The id of the radio group */
  id: PropTypes.string,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default RadioGroup;
