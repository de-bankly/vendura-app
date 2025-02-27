import React from 'react';
import { Popover as MuiPopover, Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Popover component that extends MUI Popover with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Popover = ({
  open,
  anchorEl,
  onClose,
  children,
  anchorOrigin = { vertical: 'bottom', horizontal: 'center' },
  transformOrigin = { vertical: 'top', horizontal: 'center' },
  elevation = 3,
  marginThreshold = 16,
  disableBackdropClick = false,
  sx = {},
  ...props
}) => {
  // Handle backdrop click
  const handleBackdropClick = event => {
    if (!disableBackdropClick && onClose) {
      onClose(event, 'backdropClick');
    }
  };

  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      elevation={elevation}
      marginThreshold={marginThreshold}
      onBackdropClick={handleBackdropClick}
      sx={{
        '& .MuiPopover-paper': {
          borderRadius: 1,
          ...sx,
        },
      }}
      {...props}
    >
      <Box sx={{ p: 2 }}>{children}</Box>
    </MuiPopover>
  );
};

Popover.propTypes = {
  /** If true, the popover is visible */
  open: PropTypes.bool.isRequired,
  /** The DOM element used to set the position of the popover */
  anchorEl: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  /** Callback fired when the popover is closed */
  onClose: PropTypes.func,
  /** The content of the popover */
  children: PropTypes.node,
  /** The position of the popover relative to the anchor element */
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'center', 'bottom']).isRequired,
    horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
  }),
  /** The position of the popover relative to the anchor element */
  transformOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'center', 'bottom']).isRequired,
    horizontal: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
  }),
  /** The elevation of the popover */
  elevation: PropTypes.number,
  /** The margin threshold, when the popover will flip its position */
  marginThreshold: PropTypes.number,
  /** If true, clicking the backdrop will not close the popover */
  disableBackdropClick: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Popover;
