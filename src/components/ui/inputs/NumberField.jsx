import React, { useCallback } from 'react';
import TextField from './TextField';
import PropTypes from 'prop-types';

/**
 * NumberField component for numeric input.
 * Extends the TextField component with number-specific functionality.
 */
const NumberField = ({
  min,
  max,
  allowNegative = false,
  allowDecimal = false,
  onChange,
  value,
  ...props
}) => {
  // Handle change to enforce numeric constraints
  const handleChange = useCallback(
    event => {
      let originalValue = event.target.value;
      let newValue = originalValue;

      // Allow empty value or just a negative sign if allowed
      if (newValue === '' || (allowNegative && newValue === '-')) {
        if (onChange) onChange(event);
        return;
      }

      // Prevent multiple decimal points or leading zeros (unless decimal)
      if (
        (newValue.includes('.') && newValue.indexOf('.') !== newValue.lastIndexOf('.')) ||
        (newValue.startsWith('0') && newValue.length > 1 && !newValue.startsWith('0.')) ||
        (newValue.startsWith('-0') && newValue.length > 2 && !newValue.startsWith('-0.'))
      ) {
        // Don't update if format is invalid intermediate state like "00" or ".."
        // Let the user correct it
        return;
      }

      // Validate the numeric pattern
      const pattern = allowDecimal ? /^-?\d*\.?\d*$/ : /^-?\d*$/;
      if (!pattern.test(newValue)) {
        return; // Prevent invalid characters
      }

      // Handle negative numbers
      if (!allowNegative && newValue.startsWith('-')) {
        return; // Prevent negative sign if not allowed
      }

      // Check min/max only if it's a potentially complete number
      // Avoid coercing intermediate inputs like "-" or "1."
      const isPotentiallyComplete = !newValue.endsWith('.') && newValue !== '-';

      if (isPotentiallyComplete) {
        const numValue = parseFloat(newValue);
        if (!isNaN(numValue)) {
          // Ensure it's a valid float/int
          if (min !== undefined && numValue < min) {
            newValue = min.toString();
          }
          if (max !== undefined && numValue > max) {
            newValue = max.toString();
          }
        }
      }

      // Only call onChange if the value actually needs changing or was initially valid
      if (newValue !== originalValue || pattern.test(originalValue)) {
        // Create a new event only if value differs, to avoid infinite loops if parent uses value directly
        if (newValue !== originalValue) {
          const newEvent = {
            ...event,
            target: {
              ...event.target,
              value: newValue,
            },
          };
          if (onChange) onChange(newEvent);
        } else {
          // Pass original event if value is valid and unchanged
          if (onChange) onChange(event);
        }
      }
    },
    [onChange, min, max, allowNegative, allowDecimal]
  );

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
