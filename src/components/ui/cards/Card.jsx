import React from 'react';
import { Card as MuiCard, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Card component that extends MUI Card with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Card = ({
  children,
  elevation = 0,
  variant = 'elevation',
  sx = {},
  borderRadius = 2,
  hoverEffect = false,
  ...props
}) => {
  const theme = useTheme();

  return (
    <MuiCard
      elevation={elevation}
      variant={variant}
      sx={{
        borderRadius: borderRadius,
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        border: variant === 'outlined' ? `1px solid ${theme.palette.grey[200]}` : 'none',
        boxShadow: elevation === 0 ? 'none' : theme.shadows[elevation],
        ...(hoverEffect && {
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[elevation + 2],
          },
        }),
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
  /** Shadow depth, corresponds to dp in the spec. Default is 0 for flat design. */
  elevation: PropTypes.number,
  /** The variant to use */
  variant: PropTypes.oneOf(['elevation', 'outlined']),
  /** Border radius of the card */
  borderRadius: PropTypes.number,
  /** Whether to apply a hover effect */
  hoverEffect: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Card;
