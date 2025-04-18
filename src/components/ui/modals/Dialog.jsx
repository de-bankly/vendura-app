import React from 'react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

/**
 * Enhanced Dialog component that extends MUI Dialog with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Dialog = ({
  open,
  onClose,
  title,
  content,
  contentText,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  showCloseButton = true,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
  scroll = 'paper',
  titleProps = {},
  contentProps = {},
  actionsProps = {},
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
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      disableEscapeKeyDown={disableEscapeKeyDown}
      onBackdropClick={handleBackdropClick}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: 2,
          ...sx,
        },
      }}
      {...props}
    >
      {title && (
        <DialogTitle
          id="dialog-title"
          sx={{
            pr: showCloseButton ? 6 : 3,
            py: 2,
            ...titleProps.sx,
          }}
          {...titleProps}
        >
          <Typography variant="h6" component="h2">
            {title}
          </Typography>
          {showCloseButton && (
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'text.secondary',
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
      )}

      <DialogContent
        sx={{
          py: 2,
          ...contentProps.sx,
        }}
        {...contentProps}
      >
        {contentText && (
          <DialogContentText id="dialog-description" sx={{ mb: 2 }}>
            {contentText}
          </DialogContentText>
        )}
        {content}
      </DialogContent>

      {actions && (
        <DialogActions
          sx={{
            px: 3,
            py: 2,
            ...actionsProps.sx,
          }}
          {...actionsProps}
        >
          {actions}
        </DialogActions>
      )}
    </MuiDialog>
  );
};

Dialog.propTypes = {
  /** If true, the dialog is open */
  open: PropTypes.bool.isRequired,
  /** Callback fired when the dialog is closed */
  onClose: PropTypes.func,
  /** The title of the dialog */
  title: PropTypes.node,
  /** The content of the dialog */
  content: PropTypes.node,
  /** The text content of the dialog */
  contentText: PropTypes.node,
  /** The actions of the dialog */
  actions: PropTypes.node,
  /** The maximum width of the dialog */
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  /** If true, the dialog will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** If true, the close button will be displayed */
  showCloseButton: PropTypes.bool,
  /** If true, clicking the backdrop will not close the dialog */
  disableBackdropClick: PropTypes.bool,
  /** If true, pressing the escape key will not close the dialog */
  disableEscapeKeyDown: PropTypes.bool,
  /** The scroll behavior of the dialog */
  scroll: PropTypes.oneOf(['paper', 'body']),
  /** Additional props for the DialogTitle component */
  titleProps: PropTypes.object,
  /** Additional props for the DialogContent component */
  contentProps: PropTypes.object,
  /** Additional props for the DialogActions component */
  actionsProps: PropTypes.object,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Dialog;
