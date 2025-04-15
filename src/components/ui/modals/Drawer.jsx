import CloseIcon from '@mui/icons-material/Close';
import { Drawer as MuiDrawer, Box, useTheme } from '@mui/material'; // Import useTheme, removed Mui IconButton
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton as LocalIconButton } from '../ui/buttons'; // Import local IconButton

/**
 * Enhanced Drawer component that extends MUI Drawer with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Drawer = ({
  open,
  onClose,
  children,
  anchor = 'right',
  variant = 'temporary',
  width = 320,
  showCloseButton = true,
  // Use theme spacing for default position
  closeButtonPosition: closeButtonPositionProp = { top: 1, right: 1 }, // Use theme spacing unit multiplier
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  sx = {}, // Keep sx, intended for the Paper element
  ...props
}) => {
  const theme = useTheme();

  // Handle onClose and check reason
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' && disableBackdropClick && variant === 'temporary') {
      return; // Do nothing if backdrop click is disabled for temporary variant
    }
    if (onClose) {
      onClose(event, reason);
    }
  };

  // Determine width/height based on anchor for Paper styles
  const isHorizontal = anchor === 'left' || anchor === 'right';
  const paperSx = {
    width: isHorizontal ? width : '100%',
    height: !isHorizontal ? width : '100%',
    boxSizing: 'border-box',
    ...sx, // Apply user-provided sx to the paper
  };

  // Resolve position props using theme spacing
  const resolvedCloseButtonPosition = {
    top: theme.spacing(closeButtonPositionProp.top),
    right: theme.spacing(closeButtonPositionProp.right),
    // Add left/bottom if needed, resolved similarly
  };

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={handleClose} // Use enhanced handler
      variant={variant}
      disableEscapeKeyDown={disableEscapeKeyDown}
      // Apply sx meant for paper to PaperProps
      PaperProps={{
        sx: paperSx,
      }}
      {...props}
    >
      {/* Inner Box for relative positioning of close button */}
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          overflow: 'auto', // Ensure content scrolls if needed
        }}
      >
        {showCloseButton && variant === 'temporary' && (
          <LocalIconButton // Use LocalIconButton
            aria-label="close"
            onClick={onClose} // Simple onClose is fine here for the button itself
            sx={{
              position: 'absolute',
              top: resolvedCloseButtonPosition.top,
              right: resolvedCloseButtonPosition.right,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
              zIndex: theme => theme.zIndex.drawer + 1, // Ensure button is above content
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </LocalIconButton>
        )}
        {/* Add some padding to content area if close button is shown, to prevent overlap */}
        <Box sx={{ p: showCloseButton && variant === 'temporary' ? theme.spacing(3, 5, 3, 3) : 0 }}>
          {children}
        </Box>
      </Box>
    </MuiDrawer>
  );
};

Drawer.propTypes = {
  /** If true, the drawer is open */
  open: PropTypes.bool.isRequired,
  /** Callback fired when the drawer is closed */
  onClose: PropTypes.func,
  /** The content of the drawer */
  children: PropTypes.node,
  /** The anchor of the drawer */
  anchor: PropTypes.oneOf(['left', 'top', 'right', 'bottom']),
  /** The variant to use */
  variant: PropTypes.oneOf(['permanent', 'persistent', 'temporary']),
  /** The width of the drawer */
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** If true, the close button will be displayed */
  showCloseButton: PropTypes.bool,
  /** The position of the close button (top/right numbers are theme spacing multipliers) */
  closeButtonPosition: PropTypes.shape({
    top: PropTypes.number,
    right: PropTypes.number,
    // bottom: PropTypes.number,
    // left: PropTypes.number,
  }),
  /** If true, clicking the backdrop will not close the drawer */
  disableBackdropClick: PropTypes.bool,
  /** If true, pressing the escape key will not close the drawer */
  disableEscapeKeyDown: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles (applied to Paper) */
  sx: PropTypes.object,
};

export default Drawer;
