import React from 'react';
import { Card as MuiCard } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Card component that extends MUI Card with consistent styling
 * based on the Vendura theme.
 */
const Card = ({ children, elevation = 1, variant = 'elevation', sx = {}, ...props }) => {
  return (
    <MuiCard
      elevation={elevation}
      variant={variant}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiCard>
  );
};

Card.propTypes = {
  /** The content of the card */
  children: PropTypes.node,
  /** Shadow depth, corresponds to dp in the spec */
  elevation: PropTypes.number,
  /** The variant to use */
  variant: PropTypes.oneOf(['elevation', 'outlined']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Card;
