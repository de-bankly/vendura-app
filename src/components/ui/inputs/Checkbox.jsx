import React from 'react';
import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  FormHelperText,
  FormControl,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Checkbox component that extends MUI Checkbox with consistent styling
 * and additional functionality based on the Vendura theme.
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
  ...props
}) => {
  // Generate a unique ID if not provided
  const checkboxId = id || name || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <FormControl error={error} required={required} disabled={disabled}>
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
              '&.Mui-checked': {
                color: error ? 'error.main' : undefined,
              },
              ...sx,
            }}
            {...props}
          />
        }
        label={label}
      />
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
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
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Checkbox;
