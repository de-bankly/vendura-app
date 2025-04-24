import {
  FormControl,
  InputLabel,
  Select as MuiSelect,
  MenuItem,
  FormHelperText,
  alpha,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledFormControl = styled(
  FormControl,
  {}
)(({ theme, size, ownerState }) => {
  const styles = {
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
        fontSize: theme.typography.pxToRem(14),
      }),
    },
    '& .MuiOutlinedInput-input.MuiSelect-select': {
      fontWeight: 400,
      ...(size === 'small'
        ? {
            padding: `${theme.spacing(1)} ${theme.spacing(4)} ${theme.spacing(1)} ${theme.spacing(1.5)}`,
            fontSize: theme.typography.pxToRem(14),
          }
        : {
            padding: `${theme.spacing(1.5)} ${theme.spacing(4)} ${theme.spacing(1.5)} ${theme.spacing(1.75)}`,
            fontSize: theme.typography.pxToRem(16),
          }),
    },
    '& .MuiMenuItem-root': {
      ...(size === 'small'
        ? {
            fontSize: theme.typography.pxToRem(14),
            minHeight: '32px',
          }
        : {
            minHeight: '40px',
          }),
      transition: 'background-color 0.15s ease-in-out',
    },
    '& .MuiFormHelperText-root': {
      marginLeft: theme.spacing(0.25),
      fontSize: theme.typography.pxToRem(12),
    },
  };
  return styles;
});

/**
 * Enhanced Select component with a modern, minimalist design optimized for POS and inventory
 * management systems. Features clean lines, subtle transitions, and consistent styling
 * across the application.
 * @param {object} props - The component props.
 * @param {React.ReactNode} [props.label] - The label content.
 * @param {*} [props.value=''] - The input value. It can be a single value or an array for multiple selection.
 * @param {function} [props.onChange] - Callback fired when the value is changed.
 * @param {Array<object>} [props.options=[]] - Array of options for the select. Each object should have `value` and `label`.
 * @param {boolean} [props.error=false] - If `true`, the component is displayed in an error state.
 * @param {React.ReactNode} [props.helperText=''] - The helper text content.
 * @param {boolean} [props.required=false] - If `true`, the label is displayed as required and the input element is required.
 * @param {boolean} [props.disabled=false] - If `true`, the component is disabled.
 * @param {boolean} [props.fullWidth=true] - If `true`, the component will take up the full width of its container.
 * @param {'standard' | 'outlined' | 'filled'} [props.variant='outlined'] - The variant to use.
 * @param {'small' | 'medium'} [props.size='medium'] - The size of the component.
 * @param {string} [props.placeholder=''] - The short hint displayed in the input before the user enters a value.
 * @param {boolean} [props.multiple=false] - If `true`, `value` must be an array and the menu will support multiple selections.
 * @param {string} [props.name=''] - Name attribute of the `select` element.
 * @param {string} [props.id=''] - The id of the `select` element.
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles.
 * @param {React.Ref} ref - The ref forwarded to the root element.
 * @returns {React.ReactElement} The rendered Select component.
 */
const Select = React.forwardRef(
  (
    {
      label,
      value = '',
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
    },
    ref
  ) => {
    const selectId =
      id ||
      name ||
      `select-${label?.replace(/\s+/g, '-').toLowerCase() || Math.random().toString(36).substring(2, 9)}`;

    const handleChange = event => {
      if (onChange) {
        onChange(event);
      }
    };

    return (
      <StyledFormControl
        ref={ref}
        variant={variant}
        fullWidth={fullWidth}
        error={error}
        required={required}
        disabled={disabled}
        size={size}
        ownerState={{ disabled, error, required, size }}
        sx={sx}
      >
        {label && <InputLabel id={`${selectId}-label`}>{label}</InputLabel>}

        <MuiSelect
          labelId={`${selectId}-label`}
          id={selectId}
          value={value}
          onChange={handleChange}
          label={label}
          name={name}
          multiple={multiple}
          displayEmpty={!!placeholder}
          MenuProps={{
            PaperProps: {
              sx: {
                borderRadius: theme => theme.shape.borderRadius,
                boxShadow: theme => theme.shadows[4],
                marginTop: theme => theme.spacing(0.5),
                maxHeight: '300px',
              },
            },
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          {...props}
        >
          {placeholder && (
            <MenuItem value="" disabled>
              {placeholder}
            </MenuItem>
          )}

          {options.map(option => (
            <MenuItem
              key={
                option.key ||
                `option-${typeof option.value === 'object' ? Math.random() : option.value}`
              }
              value={option.value}
            >
              {option.label}
            </MenuItem>
          ))}
        </MuiSelect>

        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </StyledFormControl>
    );
  }
);

Select.displayName = 'Select';

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
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
