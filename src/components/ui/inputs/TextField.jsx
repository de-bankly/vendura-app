import { TextField as MuiTextField, InputAdornment, alpha, styled } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledMuiTextField = styled(MuiTextField)(({ theme, size, ownerState }) => {
  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
      transition: 'all 0.2s ease-in-out',
      backgroundColor: ownerState?.disabled
        ? alpha(theme.palette.action.disabled, 0.05)
        : alpha(theme.palette.background.paper, 0.8),
      '&:hover:not(.Mui-disabled)': {
        backgroundColor: alpha(theme.palette.background.paper, 1),
      },
      '&.Mui-focused': {
        backgroundColor: theme.palette.background.paper,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      transition: 'all 0.2s ease-in-out',
      ...(size === 'small' && {
        fontSize: '0.875rem',
      }),
    },
    '& .MuiInputBase-input': {
      fontWeight: 400,
      ...(size === 'small'
        ? {
            padding: theme.spacing(1, 1.5),
            fontSize: theme.typography.pxToRem(14),
          }
        : {
            padding: theme.spacing(1.5, 1.75),
            fontSize: theme.typography.pxToRem(16),
          }),
    },
    '& .MuiFormHelperText-root': {
      marginLeft: theme.spacing(0.25),
      fontSize: theme.typography.pxToRem(12),
    },
  };

  return { ...baseStyles };
});

/**
 * Enhanced TextField component using styled API.
 * @param {object} props - The component props.
 * @param {React.Ref} ref - The ref forwarded to the underlying MuiTextField component.
 * @returns {React.ReactElement} The rendered TextField component.
 */
const TextField = React.forwardRef(
  (
    {
      label,
      value,
      onChange,
      error = false,
      helperText = '',
      required = false,
      disabled = false,
      fullWidth = true,
      variant = 'outlined',
      size = 'medium',
      startAdornment = null,
      endAdornment = null,
      type = 'text',
      placeholder = '',
      multiline = false,
      rows = 1,
      maxRows = undefined,
      name = '',
      id = '',
      autoFocus = false,
      autoComplete = '',
      sx = {},
      ...props
    },
    ref
  ) => {
    const inputProps = {};

    if (startAdornment) {
      inputProps.startAdornment = (
        <InputAdornment position="start">{startAdornment}</InputAdornment>
      );
    }

    if (endAdornment) {
      inputProps.endAdornment = <InputAdornment position="end">{endAdornment}</InputAdornment>;
    }

    return (
      <StyledMuiTextField
        ref={ref}
        label={label}
        value={value}
        onChange={onChange}
        error={error}
        helperText={helperText}
        required={required}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={variant}
        size={size}
        type={type}
        placeholder={placeholder}
        multiline={multiline}
        rows={rows}
        maxRows={maxRows}
        name={name}
        id={id || name}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        InputProps={Object.keys(inputProps).length > 0 ? inputProps : undefined}
        ownerState={{ size, disabled, error }}
        sx={sx}
        {...props}
      />
    );
  }
);

TextField.displayName = 'TextField';

TextField.propTypes = {
  /** The label content */
  label: PropTypes.node,
  /** The value of the input element */
  value: PropTypes.any,
  /** Callback fired when the value is changed */
  onChange: PropTypes.func,
  /** If true, the input will indicate an error */
  error: PropTypes.bool,
  /** The helper text content */
  helperText: PropTypes.node,
  /** If true, the label is displayed as required */
  required: PropTypes.bool,
  /** If true, the input element is disabled */
  disabled: PropTypes.bool,
  /** If true, the input will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
  /** The size of the component */
  size: PropTypes.oneOf(['small', 'medium']),
  /** The element to be displayed at the start of the input */
  startAdornment: PropTypes.node,
  /** The element to be displayed at the end of the input */
  endAdornment: PropTypes.node,
  /** Type of the input element */
  type: PropTypes.string,
  /** The short hint displayed in the input before the user enters a value */
  placeholder: PropTypes.string,
  /** If true, a textarea element will be rendered */
  multiline: PropTypes.bool,
  /** Number of rows to display when multiline option is set to true */
  rows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Maximum number of rows to display when multiline option is set to true */
  maxRows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Name attribute of the input element */
  name: PropTypes.string,
  /** The id of the input element. Defaults to the `name` prop. */
  id: PropTypes.string,
  /** If true, the input element is focused during the first mount */
  autoFocus: PropTypes.bool,
  /** The autocomplete attribute of the input element */
  autoComplete: PropTypes.string,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default TextField;
