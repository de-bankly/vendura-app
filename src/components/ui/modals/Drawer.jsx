import CloseIcon from '@mui/icons-material/Close';
import { Drawer as MuiDrawer, Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { IconButton } from '../buttons';

/**
 * Enhanced Drawer component that extends MUI Drawer with consistent styling
 * and additional functionality based on the Vendura theme.
 * @param {object} props - The component props.
 * @param {boolean} props.open - If true, the drawer is open.
 * @param {Function} [props.onClose] - Callback fired when the drawer is closed.
 * @param {React.ReactNode} [props.children] - The content of the drawer.
 * @param {'left' | 'top' | 'right' | 'bottom'} [props.anchor='right'] - The anchor of the drawer.
 * @param {'permanent' | 'persistent' | 'temporary'} [props.variant='temporary'] - The variant to use.
 * @param {number | string} [props.width=320] - The width of the drawer.
 * @param {boolean} [props.showCloseButton=true] - If true, the close button will be displayed.
 * @param {object} [props.closeButtonPosition={ top: 1, right: 1 }] - The position of the close button (top/right numbers are theme spacing multipliers).
 * @param {boolean} [props.disableBackdropClick=false] - If true, clicking the backdrop will not close the drawer.
 * @param {boolean} [props.disableEscapeKeyDown=false] - If true, pressing the escape key will not close the drawer.
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles (applied to Paper).
 * @returns {React.ReactElement} The rendered Drawer component.
 */
const Drawer = ({
  open,
  onClose,
  children,
  anchor = 'right',
  variant = 'temporary',
  width = 320,
  showCloseButton = true,
  closeButtonPosition: closeButtonPositionProp = { top: 1, right: 1 },
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' && disableBackdropClick && variant === 'temporary') {
      return;
    }
    if (onClose) {
      onClose(event, reason);
    }
  };

  const isHorizontal = anchor === 'left' || anchor === 'right';
  const paperSx = {
    width: isHorizontal ? width : '100%',
    height: !isHorizontal ? width : '100%',
    boxSizing: 'border-box',
    ...sx,
  };

  const resolvedCloseButtonPosition = {
    top: theme.spacing(closeButtonPositionProp.top),
    right: theme.spacing(closeButtonPositionProp.right),
  };

  return (
    <MuiDrawer
      anchor={anchor}
      open={open}
      onClose={handleClose}
      variant={variant}
      disableEscapeKeyDown={disableEscapeKeyDown}
      PaperProps={{
        sx: paperSx,
      }}
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
              top: resolvedCloseButtonPosition.top,
              right: resolvedCloseButtonPosition.right,
              color: 'text.secondary',
              '&:hover': {
                color: 'text.primary',
              },
              zIndex: theme => theme.zIndex.drawer + 1,
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        <Box
          sx={{
            p: showCloseButton && variant === 'temporary' ? theme.spacing(3, 5, 3, 3) : 0,
          }}
        >
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
  }),
  /** If true, clicking the backdrop will not close the drawer */
  disableBackdropClick: PropTypes.bool,
  /** If true, pressing the escape key will not close the drawer */
  disableEscapeKeyDown: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles (applied to Paper) */
  sx: PropTypes.object,
};

export default Drawer;
