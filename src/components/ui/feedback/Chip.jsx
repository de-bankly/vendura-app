import { Chip as MuiChip, alpha, styled } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledMuiChip = styled(MuiChip, {
  shouldForwardProp: prop => prop !== 'ownerState',
})(({ theme, ownerState = {} }) => {
  const { color = 'default', variant = 'filled' } = ownerState;

  const safeColorMain = theme.palette[color]?.main || theme.palette.grey[500];

  return {
    fontWeight: 500,
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',
    ...(variant === 'filled' && {
      boxShadow: `0 2px 8px ${alpha(safeColorMain, 0.2)}`,
      '&:hover': {
        boxShadow: `0 4px 12px ${alpha(safeColorMain, 0.3)}`,
      },
    }),
  };
});

/**
 * @typedef {object} ChipProps
 * @property {React.ReactNode} [label] - The content of the chip.
 * @property {'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'} [color='default'] - The color of the chip.
 * @property {'small' | 'medium'} [size='medium'] - The size of the chip.
 * @property {'filled' | 'outlined'} [variant='filled'] - The variant to use.
 * @property {React.ReactElement} [icon] - Icon element.
 * @property {React.ReactElement} [deleteIcon] - Delete icon element.
 * @property {function} [onDelete] - Callback function fired when the delete icon is clicked.
 * @property {boolean} [clickable] - If true, the chip will appear clickable.
 * @property {boolean} [disabled] - If true, the chip will be disabled.
 * @property {React.ReactElement} [avatar] - Avatar element.
 * @property {object} [sx] - The system prop that allows defining system overrides as well as additional CSS styles.
 * @property {React.ElementType} [component] - The component used for the root node. Either a string to use a HTML element or a component.
 * @property {string} [href] - The URL to link to when the chip is clicked. If defined, an `<a>` element will be used as the root node.
 * @property {function} [onClick] - Callback fired when the chip is clicked.
 */

/**
 * Enhanced Chip component using MUI's styled API.
 * It forwards refs and applies custom styles based on props.
 * @param {ChipProps & React.ComponentPropsWithoutRef<typeof MuiChip>} props - The props for the component.
 * @param {React.Ref<HTMLDivElement>} ref - The ref forwarded to the root element.
 * @returns {React.ReactElement} The rendered Chip component.
 */
const Chip = React.forwardRef(
  (
    {
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
    },
    ref
  ) => {
    const ownerState = { color, variant, disabled, clickable };

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
        sx={sx}
        ownerState={ownerState}
        {...props}
      />
    );
  }
);

Chip.displayName = 'Chip';

Chip.propTypes = {
  /**
   * The content of the chip.
   */
  label: PropTypes.node,
  /**
   * The color of the chip. It supports the theme palette colors.
   * @default 'default'
   */
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
  ]),
  /**
   * The size of the chip.
   * @default 'medium'
   */
  size: PropTypes.oneOf(['small', 'medium']),
  /**
   * The variant to use.
   * @default 'filled'
   */
  variant: PropTypes.oneOf(['filled', 'outlined']),
  /**
   * Icon element displayed before the label.
   */
  icon: PropTypes.element,
  /**
   * Override the default delete icon element. Shown only if `onDelete` is set.
   */
  deleteIcon: PropTypes.element,
  /**
   * Callback fired when the delete icon is clicked.
   * If set, the delete icon will be shown.
   */
  onDelete: PropTypes.func,
  /**
   * If `true`, the chip will appear clickable, and will change styles on hover.
   */
  clickable: PropTypes.bool,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * Avatar element displayed before the label.
   */
  avatar: PropTypes.element,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object,
};

export default Chip;
