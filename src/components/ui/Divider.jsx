import React from 'react';
import { Divider as MuiDivider } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Divider component that extends MUI Divider with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Divider = ({
  orientation = 'horizontal',
  variant = 'fullWidth',
  light = false,
  textAlign,
  children,
  sx = {},
  ...props
}) => {
  return (
    <MuiDivider
      orientation={orientation}
      variant={variant}
      light={light}
      textAlign={textAlign}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiDivider>
  );
};

Divider.propTypes = {
  /** The content of the divider */
  children: PropTypes.node,
  /** The orientation of the divider */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** The variant to use */
  variant: PropTypes.oneOf(['fullWidth', 'inset', 'middle']),
  /** If true, the divider will have a lighter color */
  light: PropTypes.bool,
  /** The text alignment */
  textAlign: PropTypes.oneOf(['center', 'left', 'right']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Divider;
