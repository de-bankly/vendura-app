import React from 'react';
import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced RadioGroup component that extends MUI RadioGroup with consistent styling
 * and additional functionality based on the Vendura theme.
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

  return (
    <FormControl error={error} required={required} disabled={disabled} sx={sx}>
      {label && <FormLabel id={`${radioGroupId}-label`}>{label}</FormLabel>}

      <MuiRadioGroup
        aria-labelledby={`${radioGroupId}-label`}
        name={name}
        value={value}
        onChange={onChange}
        row={row}
        {...props}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio color={color} size={size} disabled={option.disabled || disabled} />}
            label={option.label}
            disabled={option.disabled || disabled}
          />
        ))}
      </MuiRadioGroup>

      {helperText && <FormHelperText>{helperText}</FormHelperText>}
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
