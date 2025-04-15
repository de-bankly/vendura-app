import {
  FormControl,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  alpha,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

// --- Styled Components --- //

const StyledFormControl = styled(FormControl)({
  width: '100%',
});

const StyledFormLabel = styled(FormLabel, {
  shouldForwardProp: prop => prop !== 'ownerState',
})(({ theme, ownerState }) => ({
  fontWeight: 500,
  fontSize:
    ownerState?.size === 'small' ? theme.typography.pxToRem(14) : theme.typography.pxToRem(16),
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(1),
  '&.Mui-focused': {
    color: ownerState?.error ? theme.palette.error.main : theme.palette.primary.main,
  },
  '&.Mui-disabled': {
    // Let MUI handle disabled opacity for label
  },
}));

const StyledMuiRadioGroup = styled(MuiRadioGroup)(({ theme, size }) => ({
  // Apply size styles to radio icons within the group
  '& .MuiSvgIcon-root': {
    fontSize: size === 'small' ? theme.typography.pxToRem(16) : theme.typography.pxToRem(20),
  },
}));

const StyledFormControlLabel = styled(FormControlLabel, {
  shouldForwardProp: prop => prop !== 'row',
})(({ theme, row, disabled }) => ({
  marginLeft: 0,
  marginRight: row ? theme.spacing(2) : 0,
  marginBottom: row ? 0 : theme.spacing(1),
  // Style the label text
  '& .MuiFormControlLabel-label': {
    fontWeight: 400,
    transition: 'opacity 0.2s ease-in-out',
    opacity: disabled ? 0.6 : 1, // Apply disabled opacity here
    fontSize: 'inherit', // Inherit size from RadioGroup style
  },
}));

const StyledRadio = styled(Radio)(({ theme, size }) => ({
  padding: size === 'small' ? theme.spacing(0.5) : theme.spacing(1),
  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover:not(.Mui-disabled)': {
    backgroundColor: alpha(theme.palette.action.hover, 0.08),
  },
  '&.Mui-focused': {
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
}));

const StyledFormHelperText = styled(FormHelperText)(({ theme }) => ({
  marginLeft: theme.spacing(0.25),
  fontSize: theme.typography.pxToRem(12),
  marginTop: theme.spacing(0.5),
}));

/**
 * Enhanced RadioGroup component using styled components.
 */
const RadioGroup = React.forwardRef(
  (
    {
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
      sx = {}, // Keep sx for instance overrides on FormControl
      ...props
    },
    ref
  ) => {
    const radioGroupId = id || name || `radio-group-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <StyledFormControl
        ref={ref}
        error={error}
        required={required}
        disabled={disabled}
        ownerState={{ error, disabled, size }} // Pass state for FormLabel styling
        sx={sx}
      >
        {label && (
          <StyledFormLabel
            id={`${radioGroupId}-label`}
            ownerState={{ error, disabled, size }} // Pass state for styling
          >
            {label}
          </StyledFormLabel>
        )}

        <StyledMuiRadioGroup
          aria-labelledby={`${radioGroupId}-label`}
          name={name}
          value={value}
          onChange={onChange}
          row={row}
          size={size} // Pass size for icon styling
          {...props}
        >
          {options.map(option => (
            <StyledFormControlLabel
              key={option.value}
              value={option.value}
              row={row} // Pass row for margin styling
              disabled={option.disabled || disabled} // Pass disabled for label styling
              control={
                <StyledRadio color={color} size={size} disabled={option.disabled || disabled} />
              }
              label={option.label} // Label text styled by StyledFormControlLabel
            />
          ))}
        </StyledMuiRadioGroup>

        {helperText && <StyledFormHelperText error={error}>{helperText}</StyledFormHelperText>}
      </StyledFormControl>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';

// Keep PropTypes
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
