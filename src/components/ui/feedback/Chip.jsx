import React from 'react';
import { Chip as MuiChip, useTheme, alpha } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Chip component that extends MUI Chip with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Chip = ({
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
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <MuiChip
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
      sx={{
        fontWeight: 500,
        borderRadius: '16px',
        transition: 'all 0.2s ease-in-out',
        ...(variant === 'filled' && {
          boxShadow: `0 2px 8px ${alpha(
            theme.palette[color]?.main || theme.palette.grey[300],
            0.2
          )}`,
          '&:hover': {
            boxShadow: `0 4px 12px ${alpha(
              theme.palette[color]?.main || theme.palette.grey[300],
              0.3
            )}`,
          },
        }),
        ...sx,
      }}
      {...props}
    />
  );
};

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
