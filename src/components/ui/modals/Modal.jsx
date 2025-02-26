import React from 'react';
import { Modal as MuiModal, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

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
  closeButtonPosition = { top: 8, right: 8 },
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  sx = {},
  ...props
}) => {
  // Handle backdrop click
  const handleBackdropClick = event => {
    // Check if the click was on the backdrop
    if (event.target === event.currentTarget) {
      if (!disableBackdropClick && onClose) {
        onClose(event, 'backdropClick');
      }
    }
  };

  // Define max width values
  const maxWidthValues = {
    xs: '444px',
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  };

  // Determine the actual max width value
  const modalMaxWidth = maxWidthValues[maxWidth] || maxWidth;

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      disableEscapeKeyDown={disableEscapeKeyDown}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      {...props}
    >
      <Box
        onClick={handleBackdropClick}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            p: 3,
            maxWidth: modalMaxWidth,
            width: fullWidth ? '100%' : 'auto',
            maxHeight: '90vh',
            overflow: 'auto',
            ...sx,
          }}
        >
          {showCloseButton && (
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
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
          {children}
        </Box>
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
