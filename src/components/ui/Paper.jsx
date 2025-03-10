import React from 'react';
import { Paper as MuiPaper, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Paper component that extends MUI Paper with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Paper = ({
  children,
  elevation = 1,
  variant = 'elevation',
  square = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <MuiPaper
      elevation={elevation}
      variant={variant}
      square={square}
      sx={{
        borderRadius: square ? 0 : 2,
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiPaper>
  );
};

Paper.propTypes = {
  /** The content of the paper */
  children: PropTypes.node,
  /** Shadow depth, corresponds to dp in the spec */
  elevation: PropTypes.number,
  /** The variant to use */
  variant: PropTypes.oneOf(['elevation', 'outlined']),
  /** If true, rounded corners are disabled */
  square: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Paper;
