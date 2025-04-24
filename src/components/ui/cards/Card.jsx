import { Card as MuiCard, styled } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledMuiCard = styled(MuiCard, {
  shouldForwardProp: prop => prop !== 'hoverEffect' && prop !== 'borderRadiusMultiplier',
})(({ theme, elevation, variant, borderRadiusMultiplier = 1, hoverEffect }) => ({
  borderRadius: theme.shape.borderRadius * 1.5 * borderRadiusMultiplier,
  overflow: 'hidden',
  transition: 'all 0.2s ease-in-out',
  border: variant === 'outlined' ? `1px solid ${theme.palette.divider}` : 'none',
  boxShadow: variant === 'outlined' ? 'none' : theme.shadows[elevation],
  ...(hoverEffect && {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[Math.min(elevation + 3, 24)],
    },
  }),
}));

/**
 * Enhanced Card component using MUI's styled API.
 * It wraps the MUI Card component, providing additional styling options
 * like hover effects and customizable border radius based on a multiplier.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content of the card.
 * @param {number} [props.elevation=0] - Shadow depth, corresponds to dp in the spec.
 * @param {'elevation' | 'outlined'} [props.variant='elevation'] - The variant to use.
 * @param {number} [props.borderRadius=1] - Multiplier for theme.shape.borderRadius.
 * @param {boolean} [props.hoverEffect=false] - Whether to apply a hover effect.
 * @param {object} [props.sx={}] - The system prop for instance-specific overrides.
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref to the underlying MUI Card element.
 * @returns {React.ReactElement} The rendered Card component.
 */
const Card = React.forwardRef(
  (
    {
      children,
      elevation = 0,
      variant = 'elevation',
      borderRadius = 1,
      hoverEffect = false,
      sx = {},
      ...props
    },
    ref
  ) => {
    return (
      <StyledMuiCard
        ref={ref}
        elevation={elevation}
        variant={variant}
        hoverEffect={hoverEffect}
        borderRadiusMultiplier={borderRadius}
        sx={sx}
        {...props}
      >
        {children}
      </StyledMuiCard>
    );
  }
);

Card.displayName = 'Card';

Card.propTypes = {
  /**
   * The content of the card.
   */
  children: PropTypes.node,
  /**
   * Shadow depth, corresponds to dp in the spec. Default is 0 for flat design.
   */
  elevation: PropTypes.number,
  /**
   * The variant to use.
   */
  variant: PropTypes.oneOf(['elevation', 'outlined']),
  /**
   * Multiplier for theme.shape.borderRadius (e.g., 1 for default, 2 for double).
   */
  borderRadius: PropTypes.number,
  /**
   * Whether to apply a hover effect (translateY and increased shadow).
   */
  hoverEffect: PropTypes.bool,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   * See the MUI documentation for more details.
   */
  sx: PropTypes.object,
};

export default Card;
