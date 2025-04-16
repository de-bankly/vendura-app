import { Card as MuiCard, useTheme, styled } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

// Define styled component
const StyledMuiCard = styled(MuiCard, {
  shouldForwardProp: prop => prop !== 'hoverEffect' && prop !== 'borderRadiusMultiplier',
})(({ theme, elevation, variant, borderRadiusMultiplier = 1, hoverEffect }) => ({
  // Base styles
  borderRadius: theme.shape.borderRadius * 1.5 * borderRadiusMultiplier, // Use theme shape and multiplier with 1.5 base
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  border: variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
  // Use elevation prop directly for shadow, MUI handles mapping number to shadow
  boxShadow: variant === 'outlined' ? 'none' : theme.shadows[elevation],

  // Apply hover effect if prop is true
  ...(hoverEffect && {
    '&:hover': {
      transform: 'translateY(-4px)',
      // Use a slightly higher elevation shadow on hover
      boxShadow: theme.shadows[Math.min(elevation + 3, 24)], // Example: increase shadow by 3 levels, max 24
    },
  }),
}));

/**
 * Enhanced Card component using styled-components API.
 */
const Card = React.forwardRef(
  (
    {
      children,
      elevation = 0,
      variant = 'elevation', // Keep variant prop
      borderRadius = 1, // Keep prop, will be multiplier now
      hoverEffect = false,
      sx = {}, // Keep sx prop for instance-specific overrides
      ...props
    },
    ref
  ) => {
    return (
      <StyledMuiCard
        ref={ref}
        elevation={elevation} // Pass elevation to styled component
        variant={variant} // Pass variant to styled component
        hoverEffect={hoverEffect}
        borderRadiusMultiplier={borderRadius} // Pass multiplier
        sx={sx} // Apply sx prop for overrides
        {...props}
      >
        {children}
      </StyledMuiCard>
    );
  }
);

Card.displayName = 'Card';

// Update PropTypes description for borderRadius
Card.propTypes = {
  /** The content of the card */
  children: PropTypes.node,
  /** Shadow depth, corresponds to dp in the spec. Default is 0 for flat design. */
  elevation: PropTypes.number,
  /** The variant to use */
  variant: PropTypes.oneOf(['elevation', 'outlined']),
  /** Multiplier for theme.shape.borderRadius (e.g., 1 for default, 2 for double) */
  borderRadius: PropTypes.number,
  /** Whether to apply a hover effect */
  hoverEffect: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Card;
