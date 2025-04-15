import React from 'react';
import { Modal as MuiModal, Box, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { IconButton } from '../ui/buttons';

/**
 * Enhanced Modal component that extends MUI Modal with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Modal = ({
  open,
  onClose,
  children,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  closeButtonPosition = { top: theme => theme.spacing(1), right: theme => theme.spacing(1) },
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  // Handle onClose and check reason
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick' && disableBackdropClick) {
      return; // Do nothing if backdrop click is disabled
    }
    if (onClose) {
      onClose(event, reason);
    }
  };

  // Define max width values using theme breakpoints
  const maxWidthValues = theme.breakpoints.values;
  const modalMaxWidth = maxWidthValues[maxWidth] || maxWidth;

  // Resolve position props if they are functions
  const resolvedCloseButtonPosition = {
    top:
      typeof closeButtonPosition.top === 'function'
        ? closeButtonPosition.top(theme)
        : closeButtonPosition.top,
    right:
      typeof closeButtonPosition.right === 'function'
        ? closeButtonPosition.right(theme)
        : closeButtonPosition.right,
  };

  return (
    <MuiModal
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...props}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: theme.shadows[24],
          borderRadius: theme.shape.borderRadius * 2,
          p: theme.spacing(3),
          maxWidth: modalMaxWidth,
          width: fullWidth ? `calc(100% - ${theme.spacing(4)})` : 'auto',
          maxHeight: '90vh',
          overflow: 'auto',
          outline: 'none',
          ...sx,
        }}
      >
        {showCloseButton && (
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
            }}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
        {children}
      </Box>
    </MuiModal>
  );
};

Modal.propTypes = {
  /** If true, the modal is open */
  open: PropTypes.bool.isRequired,
  /** Callback fired when the modal is closed */
  onClose: PropTypes.func,
  /** The content of the modal */
  children: PropTypes.node,
  /** The maximum width of the modal */
  maxWidth: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.string,
  ]),
  /** If true, the modal will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** If true, the close button will be displayed */
  showCloseButton: PropTypes.bool,
  /** The position of the close button */
  closeButtonPosition: PropTypes.object,
  /** If true, clicking the backdrop will not close the modal */
  disableBackdropClick: PropTypes.bool,
  /** If true, pressing the escape key will not close the modal */
  disableEscapeKeyDown: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Modal;
