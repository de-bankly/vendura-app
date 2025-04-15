import {
  IconButton as MuiIconButton,
  CircularProgress,
  useTheme,
  styled,
  alpha,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

// Styled component definition
const StyledIconButton = styled(MuiIconButton, {
  shouldForwardProp: prop => prop !== 'loading' && prop !== 'variant',
})(({ theme, size, variant, color, loading }) => {
  // Base styles
  const baseStyles = {
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
  };

  // Size-specific styles
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

  // Variant-specific styles
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
    ...(loading && {}),
  };
});

/**
 * Enhanced IconButton component using styled-components API.
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
    const muiColor = variant === 'standard' ? color : 'inherit';

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
  /** The icon element */
  children: PropTypes.node.isRequired,
  /** The color of the button */
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
  /** The size of the button */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** If true, the button will be disabled */
  disabled: PropTypes.bool,
  /** If true, the button will show a loading spinner */
  loading: PropTypes.bool,
  /** Callback fired when the button is clicked */
  onClick: PropTypes.func,
  /** If set to true, the button will be positioned for an edge case */
  edge: PropTypes.oneOf(['start', 'end', false]),
  /** The variant of the button */
  variant: PropTypes.oneOf(['standard', 'contained', 'outlined']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default IconButton;
