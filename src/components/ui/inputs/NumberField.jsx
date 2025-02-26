import React from 'react';
import TextField from './TextField';
import PropTypes from 'prop-types';

/**
 * NumberField component for numeric input.
 * Extends the TextField component with number-specific functionality.
 */
const NumberField = ({
  min,
  max,
  step = 1,
  allowNegative = false,
  allowDecimal = false,
  onChange,
  value,
  ...props
}) => {
  // Handle change to enforce numeric constraints
  const handleChange = event => {
    let newValue = event.target.value;

    // Allow empty value
    if (newValue === '') {
      onChange(event);
      return;
    }

    // Validate that the input is a valid number
    const isValidNumber = allowDecimal ? /^-?\d*\.?\d*$/.test(newValue) : /^-?\d*$/.test(newValue);

    if (!isValidNumber) {
      return;
    }

    // Handle negative numbers
    if (!allowNegative && newValue.startsWith('-')) {
      return;
    }

    // Convert to number for min/max validation
    const numValue = parseFloat(newValue);

    // Check min/max constraints
    if (min !== undefined && numValue < min) {
      newValue = min.toString();
    }

    if (max !== undefined && numValue > max) {
      newValue = max.toString();
    }

    // Create a new event with the validated value
    const newEvent = {
      ...event,
      target: {
        ...event.target,
        value: newValue,
      },
    };

    onChange(newEvent);
  };

  return (
    <TextField
      type="text"
      inputMode={allowDecimal ? 'decimal' : 'numeric'}
      value={value}
      onChange={handleChange}
      {...props}
    />
  );
};

NumberField.propTypes = {
  /** Minimum allowed value */
  min: PropTypes.number,
  /** Maximum allowed value */
  max: PropTypes.number,
  /** Step increment value */
  step: PropTypes.number,
  /** Whether to allow negative numbers */
  allowNegative: PropTypes.bool,
  /** Whether to allow decimal numbers */
  allowDecimal: PropTypes.bool,
  /** Callback fired when the value is changed */
  onChange: PropTypes.func.isRequired,
  /** The value of the input element */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default NumberField;
