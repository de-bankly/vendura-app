import React from 'react';
import { Box as MuiBox } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Box component that extends MUI Box with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Box = ({ children, sx = {}, ...props }) => {
  return (
    <MuiBox
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiBox>
  );
};

Box.propTypes = {
  /** The content of the box */
  children: PropTypes.node,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Box;
