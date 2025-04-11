import React from 'react';
import { Drawer as MuiDrawer, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

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
  closeButtonPosition = { top: 8, right: 8 },
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  sx = {},
  ...props
}) => {
  // Handle backdrop click
  const handleBackdropClick = event => {
    if (!disableBackdropClick && onClose && variant === 'temporary') {
      onClose(event, 'backdropClick');
    }
  };

  // Determine width based on anchor
  const isHorizontal = anchor === 'left' || anchor === 'right';
  const drawerSx = {
    width: isHorizontal ? width : '100%',
    height: !isHorizontal ? width : '100%',
    '& .MuiDrawer-paper': {
      width: isHorizontal ? width : '100%',
      height: !isHorizontal ? width : '100%',
      boxSizing: 'border-box',
      ...sx,
    },
  };

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      variant={variant}
      disableEscapeKeyDown={disableEscapeKeyDown}
      onBackdropClick={handleBackdropClick}
      sx={drawerSx}
      {...props}
    >
      <Box
        sx={{
          position: 'relative',
          height: '100%',
          overflow: 'auto',
        }}
      >
        {showCloseButton && variant === 'temporary' && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              ...closeButtonPosition,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
        {children}
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
  /** The position of the close button */
  closeButtonPosition: PropTypes.object,
  /** If true, clicking the backdrop will not close the drawer */
  disableBackdropClick: PropTypes.bool,
  /** If true, pressing the escape key will not close the drawer */
  disableEscapeKeyDown: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Drawer;
