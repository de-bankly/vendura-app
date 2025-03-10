import React from 'react';
import { CardContent as MuiCardContent } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced CardContent component that extends MUI CardContent with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const CardContent = ({ children, sx = {}, ...props }) => {
  return (
    <MuiCardContent
      sx={{
        padding: 3,
        '&:last-child': {
          paddingBottom: 3,
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCardContent>
  );
};

CardContent.propTypes = {
  /** The content of the card content */
  children: PropTypes.node,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default CardContent;
