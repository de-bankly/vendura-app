import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import PropTypes from 'prop-types';
import React from 'react';

import TextField from './TextField';

/**
 * DateField component for date input.
 * Uses MUI DatePicker with our custom TextField styling.
 */
const DateField = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  required = false,
  error = false,
  helperText = '',
  fullWidth = true,
  format = 'MM/dd/yyyy',
  views = ['year', 'month', 'day'],
  disableFuture = false,
  disablePast = false,
  sx = {},
  ...props
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        format={format}
        views={views}
        disableFuture={disableFuture}
        disablePast={disablePast}
        slotProps={{
          textField: {
            required,
            error,
            helperText,
            fullWidth,
            sx,
            ...props,
          },
        }}
        slots={{
          textField: TextField,
        }}
      />
    </LocalizationProvider>
  );
};

DateField.propTypes = {
  /** The label content */
  label: PropTypes.node,
  /** The value of the date picker */
  value: PropTypes.object,
  /** Callback fired when the value is changed */
  onChange: PropTypes.func,
  /** The minimum selectable date */
  minDate: PropTypes.object,
  /** The maximum selectable date */
  maxDate: PropTypes.object,
  /** If true, the input element is disabled */
  disabled: PropTypes.bool,
  /** If true, the label is displayed as required */
  required: PropTypes.bool,
  /** If true, the input will indicate an error */
  error: PropTypes.bool,
  /** The helper text content */
  helperText: PropTypes.node,
  /** If true, the input will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** The date format string */
  format: PropTypes.string,
  /** Array of views to show */
  views: PropTypes.arrayOf(PropTypes.oneOf(['year', 'month', 'day'])),
  /** If true, dates in the future will not be available */
  disableFuture: PropTypes.bool,
  /** If true, dates in the past will not be available */
  disablePast: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default DateField;
