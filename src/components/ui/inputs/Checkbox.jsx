import {
  FormControl,
  FormControlLabel,
  Checkbox as MuiCheckbox,
  FormHelperText,
  alpha,
  styled,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledFormControl = styled(FormControl, {
  shouldForwardProp: prop => prop !== 'labelPlacement',
})(({ theme, labelPlacement }) => ({
  marginLeft: labelPlacement === 'start' ? 0 : theme.spacing(-1.5),
  marginRight: labelPlacement === 'end' ? 0 : theme.spacing(-1.5),
}));

const StyledFormControlLabel = styled(FormControlLabel)({
  marginLeft: 0,
  marginRight: 0,
  '& .MuiFormControlLabel-label': {
    fontWeight: 400,
    transition: 'opacity 0.2s ease-in-out',
  },
});

const StyledMuiCheckbox = styled(
  MuiCheckbox,
  {}
)(({ theme, size, error }) => ({
  padding: size === 'small' ? theme.spacing(0.5) : theme.spacing(1),
  borderRadius: theme.shape.borderRadius * 0.5,
  transition: 'background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover:not(.Mui-disabled)': {
    backgroundColor: alpha(theme.palette.action.hover, 0.08),
  },
  '&.Mui-focused': {
    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
  },
  '& .MuiSvgIcon-root': {
    fontSize: size === 'small' ? theme.typography.pxToRem(16) : theme.typography.pxToRem(20),
  },
}));

const StyledFormHelperText = styled(FormHelperText, {
  shouldForwardProp: prop => prop !== 'labelPlacement',
})(({ theme, labelPlacement }) => ({
  marginLeft: labelPlacement === 'end' ? theme.spacing(3.75) : theme.spacing(0.25),
  fontSize: theme.typography.pxToRem(12),
}));

/**
 * Enhanced Checkbox component using styled components.
 * @param {object} props - The component props.
 * @param {React.ReactNode} [props.label] - The label content.
 * @param {boolean} [props.checked] - If true, the checkbox is checked.
 * @param {function} [props.onChange] - Callback fired when the state is changed.
 * @param {boolean} [props.error=false] - If true, the checkbox will indicate an error.
 * @param {React.ReactNode} [props.helperText=''] - The helper text content.
 * @param {boolean} [props.required=false] - If true, the checkbox is marked as required.
 * @param {boolean} [props.disabled=false] - If true, the checkbox is disabled.
 * @param {'primary'|'secondary'|'success'|'error'|'info'|'warning'|'default'} [props.color='primary'] - The color of the checkbox.
 * @param {'small'|'medium'} [props.size='medium'] - The size of the checkbox.
 * @param {boolean} [props.indeterminate=false] - If true, the checkbox appears indeterminate.
 * @param {string} [props.name=''] - Name attribute of the checkbox element.
 * @param {string} [props.id=''] - The id of the checkbox element.
 * @param {'end'|'start'|'top'|'bottom'} [props.labelPlacement='end'] - The placement of the label.
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles.
 * @param {React.Ref<any>} ref - Forwarded ref.
 * @returns {JSX.Element} The rendered Checkbox component.
 */
const Checkbox = React.forwardRef(
  (
    {
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
      labelPlacement = 'end',
      ...props
    },
    ref
  ) => {
    const checkboxId = id || name || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <StyledFormControl
        ref={ref}
        error={error}
        required={required}
        disabled={disabled}
        labelPlacement={labelPlacement}
        sx={sx}
      >
        <StyledFormControlLabel
          control={
            <StyledMuiCheckbox
              size={size}
              error={error}
              checked={checked}
              onChange={onChange}
              color={color}
              indeterminate={indeterminate}
              name={name}
              id={checkboxId}
              disabled={disabled}
              {...props}
            />
          }
          label={label}
          labelPlacement={labelPlacement}
          disabled={disabled}
        />
        {helperText && (
          <StyledFormHelperText labelPlacement={labelPlacement} error={error}>
            {helperText}
          </StyledFormHelperText>
        )}
      </StyledFormControl>
    );
  }
);

Checkbox.displayName = 'Checkbox';

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
  /** The placement of the label */
  labelPlacement: PropTypes.oneOf(['end', 'start', 'top', 'bottom']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Checkbox;
