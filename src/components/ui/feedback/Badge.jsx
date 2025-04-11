import React from 'react';
import { Badge as MuiBadge } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Badge component that extends MUI Badge with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Badge = ({
  children,
  badgeContent,
  color = 'primary',
  variant = 'standard',
  overlap = 'rectangular',
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  invisible = false,
  max = 99,
  showZero = false,
  sx = {},
  ...props
}) => {
  return (
    <MuiBadge
      badgeContent={badgeContent}
      color={color}
      variant={variant}
      overlap={overlap}
      anchorOrigin={anchorOrigin}
      invisible={invisible}
      max={max}
      showZero={showZero}
      sx={{
        '& .MuiBadge-badge': {
          fontWeight: 600,
          fontSize: '0.75rem',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiBadge>
  );
};

Badge.propTypes = {
  /** The content to be badged */
  children: PropTypes.node,
  /** The content rendered within the badge */
  badgeContent: PropTypes.node,
  /** The color of the badge */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
    'default',
  ]),
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'dot']),
  /** Wrapped shape the badge should overlap */
  overlap: PropTypes.oneOf(['rectangular', 'circular']),
  /** The anchor of the badge */
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'right']),
  }),
  /** If true, the badge is invisible */
  invisible: PropTypes.bool,
  /** Max count to show */
  max: PropTypes.number,
  /** If true, the badge will be displayed even if badgeContent is 0 */
  showZero: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Badge;
