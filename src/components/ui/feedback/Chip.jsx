import { Chip as MuiChip, alpha, styled } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

// Styled Chip Component
const StyledMuiChip = styled(MuiChip, {
  // Filter props if necessary
  shouldForwardProp: prop => prop !== 'ownerState',
})(({ theme, ownerState = {} }) => {
  // ownerState has color, variant, disabled, clickable etc.
  const { color = 'default', variant = 'filled' } = ownerState;

  // Use default colors that are guaranteed to exist in the theme
  const safeColorMain = theme.palette[color]?.main || theme.palette.grey[500];

  return {
    fontWeight: 500,
    borderRadius: theme.shape.borderRadius, // Use theme borderRadius instead of spacing
    transition: 'all 0.2s ease-in-out',
    // Apply shadow only for filled variant
    ...(variant === 'filled' && {
      // Use a subtle shadow, adjust alpha and elevation level as needed
      boxShadow: `0 2px 8px ${alpha(safeColorMain, 0.2)}`,
      '&:hover': {
        boxShadow: `0 4px 12px ${alpha(safeColorMain, 0.3)}`,
        // Optional: Add a slight transform on hover if desired for filled chips
        // transform: 'translateY(-1px)',
      },
    }),
    // Add specific styles for outlined if needed, e.g., border thickness
    // ...(variant === 'outlined' && {
    //   borderWidth: '1.5px',
    // }),
  };
});

/**
 * Enhanced Chip component using styled API.
 */
const Chip = React.forwardRef(
  (
    {
      // Destructure props used by styled component logic if needed, pass others
      label,
      color = 'default',
      size = 'medium',
      variant = 'filled',
      icon,
      deleteIcon,
      onDelete,
      clickable,
      disabled,
      avatar,
      sx = {}, // Keep sx for instance overrides
      ...props // Pass label, size, icon, onDelete, clickable, disabled, avatar, etc.
    },
    ref
  ) => {
    return (
      <StyledMuiChip
        ref={ref}
        label={label}
        color={color}
        size={size}
        variant={variant}
        icon={icon}
        deleteIcon={deleteIcon}
        onDelete={onDelete}
        clickable={clickable}
        disabled={disabled}
        avatar={avatar}
        sx={sx} // Apply instance sx overrides
        {...props}
      />
    );
  }
);

Chip.displayName = 'Chip';

Chip.propTypes = {
  /** The content of the chip */
  label: PropTypes.node,
  /** The color of the chip */
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
  ]),
  /** The size of the chip */
  size: PropTypes.oneOf(['small', 'medium']),
  /** The variant to use */
  variant: PropTypes.oneOf(['filled', 'outlined']),
  /** Icon element */
  icon: PropTypes.node,
  /** Delete icon element */
  deleteIcon: PropTypes.node,
  /** Callback function fired when the delete icon is clicked */
  onDelete: PropTypes.func,
  /** If true, the chip will appear clickable */
  clickable: PropTypes.bool,
  /** If true, the chip will be disabled */
  disabled: PropTypes.bool,
  /** Avatar element */
  avatar: PropTypes.node,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Chip;
