import { IconButton as MuiIconButton, CircularProgress, styled, alpha } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledIconButton = styled(MuiIconButton, {
  shouldForwardProp: prop => prop !== 'loading' && prop !== 'variant',
})(({ theme, size, variant, color, loading }) => {
  const baseStyles = {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
  };

  const sizeMap = {
    small: {
      padding:
        variant === 'contained' || variant === 'outlined'
          ? theme.spacing(0.75)
          : theme.spacing(0.5),
      fontSize: '1.25rem',
    },
    medium: {
      padding:
        variant === 'contained' || variant === 'outlined' ? theme.spacing(1) : theme.spacing(0.75),
      fontSize: '1.5rem',
    },
    large: {
      padding:
        variant === 'contained' || variant === 'outlined' ? theme.spacing(1.5) : theme.spacing(1),
      fontSize: '1.75rem',
    },
  };

  let variantStyles = {};
  const paletteColor = theme.palette[color];

  switch (variant) {
    case 'contained':
      variantStyles = {
        backgroundColor: paletteColor?.main || 'inherit',
        color: paletteColor?.contrastText || 'inherit',
        '&:hover': {
          backgroundColor: paletteColor?.dark || 'inherit',
          transform: 'translateY(-2px)',
        },
        boxShadow: theme.shadows[2],
      };
      break;
    case 'outlined':
      variantStyles = {
        border: `1.5px solid ${paletteColor?.main || theme.palette.divider}`,
        color: paletteColor?.main,
        '&:hover': {
          backgroundColor: alpha(paletteColor?.main || theme.palette.action.active, 0.08),
          transform: 'translateY(-2px)',
        },
      };
      break;
    default:
      variantStyles = {
        color: paletteColor?.main,
        '&:hover': {
          backgroundColor: alpha(paletteColor?.main || theme.palette.action.active, 0.08),
        },
      };
      break;
  }

  return {
    ...baseStyles,
    ...sizeMap[size],
    ...variantStyles,
    ...(loading && {
      pointerEvents: 'none',
    }),
  };
});

/**
 * @description An enhanced IconButton component based on MUI's IconButton,
 * supporting different variants ('standard', 'contained', 'outlined'),
 * sizes, colors, and a loading state.
 * It uses the `styled` API for customization.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The icon element to display.
 * @param {boolean} [props.loading=false] - If true, displays a loading spinner instead of the icon.
 * @param {'small'|'medium'|'large'} [props.size='medium'] - The size of the button.
 * @param {'standard'|'contained'|'outlined'} [props.variant='standard'] - The variant to use.
 * @param {'primary'|'secondary'|'success'|'error'|'info'|'warning'|'default'|'inherit'} [props.color='default'] - The color of the button, mapped to theme palette.
 * @param {boolean} [props.disabled=false] - If true, the button will be disabled.
 * @param {function} [props.onClick] - Callback fired when the button is clicked.
 * @param {'start'|'end'|false} [props.edge=false] - If set, adjusts padding for use at the start or end of an element.
 * @param {object} [props.sx] - Allows defining system overrides as well as additional CSS styles.
 * @param {React.Ref} ref - Forwarded ref to the underlying MUI IconButton element.
 * @returns {React.ReactElement} The rendered IconButton component.
 */
const IconButton = React.forwardRef(
  (
    {
      children,
      loading = false,
      size = 'medium',
      variant = 'standard',
      color = 'default',
      ...props
    },
    ref
  ) => {
    // Determine the color prop passed to the underlying MuiIconButton.
    // For 'standard' variant, pass the theme color directly.
    // For 'contained' and 'outlined', pass 'inherit' so the styled component controls the color.
    const muiColor = variant === 'standard' ? color : 'inherit';

    // Pass the original color prop to StyledIconButton for styling logic via data attribute or direct prop
    // Here we pass it directly as `color` is used within the styled function.
    // Note: `shouldForwardProp` prevents `variant` and `loading` from reaching the DOM element.
    // We also pass the original `color` prop to the styled component for its logic.
    return (
      <StyledIconButton
        ref={ref}
        size={size}
        color={muiColor}
        disabled={props.disabled || loading}
        variant={variant}
        loading={loading}
        data-color-prop={color}
        {...props}
        // Pass the original color prop directly to the styled function context
        // Note: This requires `color` not to be filtered by `shouldForwardProp` if needed by the base MuiIconButton,
        // but since we handle color logic internally, it's okay to filter it if it causes issues.
        // Let's rely on the `color` prop being available in the styled function's scope.
      >
        {loading ? (
          <CircularProgress
            size={size === 'small' ? 16 : size === 'large' ? 28 : 22}
            color="inherit"
            thickness={4}
          />
        ) : (
          children
        )}
      </StyledIconButton>
    );
  }
);

IconButton.displayName = 'IconButton';

IconButton.propTypes = {
  /**
   * @description The icon element or other content to render inside the button.
   */
  children: PropTypes.node.isRequired,
  /**
   * @description The color of the component. It supports theme palette colors.
   */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
    'default',
    'inherit',
  ]),
  /**
   * @description The size of the component. `small` is equivalent to the dense button styling.
   */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /**
   * @description If `true`, the component is disabled.
   */
  disabled: PropTypes.bool,
  /**
   * @description If `true`, a loading indicator is shown.
   */
  loading: PropTypes.bool,
  /**
   * @description Callback fired when the button is clicked.
   * @param {React.MouseEvent<HTMLButtonElement>} event The event source of the callback.
   */
  onClick: PropTypes.func,
  /**
   * @description If given, uses a negative margin to counteract the padding on one side (this is often helpful for aligning the left or right side of the icon with content above or below, respectively).
   */
  edge: PropTypes.oneOf(['start', 'end', false]),
  /**
   * @description The variant to use.
   */
  variant: PropTypes.oneOf(['standard', 'contained', 'outlined']),
  /**
   * @description The system prop that allows defining system overrides as well as additional CSS styles. See the `sx` page for more details.
   */
  sx: PropTypes.object,
};

export default IconButton;
