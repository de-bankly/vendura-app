import React from 'react';
import { Typography as MuiTypography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Typography component that extends MUI Typography with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Typography = ({ children, variant = 'body1', component, color, sx = {}, ...props }) => {
  const theme = useTheme();

  return (
    <MuiTypography
      variant={variant}
      component={component}
      color={color}
      sx={{
        fontFamily: theme.typography.fontFamily,
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTypography>
  );
};

Typography.propTypes = {
  /** The content of the typography */
  children: PropTypes.node,
  /** The variant to use */
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'subtitle1',
    'subtitle2',
    'body1',
    'body2',
    'caption',
    'button',
    'overline',
  ]),
  /** The component used for the root node */
  component: PropTypes.elementType,
  /** The color of the component */
  color: PropTypes.string,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Typography;
