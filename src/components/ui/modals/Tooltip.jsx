import React from 'react';
import { Tooltip as MuiTooltip } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Tooltip component that extends MUI Tooltip with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Tooltip = ({
  children,
  title,
  placement = 'bottom',
  arrow = true,
  enterDelay = 100,
  leaveDelay = 0,
  disableFocusListener = false,
  disableHoverListener = false,
  disableTouchListener = false,
  sx = {},
  ...props
}) => {
  // Don't render tooltip if title is empty
  if (!title) {
    return children;
  }

  return (
    <MuiTooltip
      title={title}
      placement={placement}
      arrow={arrow}
      enterDelay={enterDelay}
      leaveDelay={leaveDelay}
      disableFocusListener={disableFocusListener}
      disableHoverListener={disableHoverListener}
      disableTouchListener={disableTouchListener}
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: 'background.tooltip',
          color: 'text.tooltip',
          fontSize: '0.75rem',
          padding: '6px 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
        '& .MuiTooltip-arrow': {
          color: 'background.tooltip',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiTooltip>
  );
};

Tooltip.propTypes = {
  /** Tooltip title. Zero-length titles string, undefined, null are never displayed */
  title: PropTypes.node,
  /** The content of the tooltip */
  children: PropTypes.node.isRequired,
  /** Tooltip placement */
  placement: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  /** If true, adds an arrow to the tooltip */
  arrow: PropTypes.bool,
  /** The number of milliseconds to wait before showing the tooltip */
  enterDelay: PropTypes.number,
  /** The number of milliseconds to wait before hiding the tooltip */
  leaveDelay: PropTypes.number,
  /** Do not respond to focus events */
  disableFocusListener: PropTypes.bool,
  /** Do not respond to hover events */
  disableHoverListener: PropTypes.bool,
  /** Do not respond to touch events */
  disableTouchListener: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Tooltip;
