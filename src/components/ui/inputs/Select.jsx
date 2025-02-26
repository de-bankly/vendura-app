import React from 'react';
import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Select component that extends MUI Select with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Select = ({
  label,
  value,
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
        },
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
        {...props}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}

        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
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
