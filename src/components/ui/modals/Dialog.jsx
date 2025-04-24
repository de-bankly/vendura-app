import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Enhanced Dialog component that extends MUI Dialog with consistent styling
 * and additional functionality based on the Vendura theme.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.open - If true, the dialog is open.
 * @param {Function} [props.onClose] - Callback fired when the dialog is closed.
 * @param {React.ReactNode} [props.title] - The title of the dialog.
 * @param {React.ReactNode} [props.content] - The content of the dialog.
 * @param {React.ReactNode} [props.contentText] - The text content of the dialog.
 * @param {React.ReactNode} [props.actions] - The actions of the dialog.
 * @param {'xs' | 'sm' | 'md' | 'lg' | 'xl' | false} [props.maxWidth='sm'] - The maximum width of the dialog.
 * @param {boolean} [props.fullWidth=true] - If true, the dialog will take up the full width of its container.
 * @param {boolean} [props.showCloseButton=true] - If true, the close button will be displayed.
 * @param {boolean} [props.disableBackdropClick=false] - If true, clicking the backdrop will not close the dialog.
 * @param {boolean} [props.disableEscapeKeyDown=false] - If true, pressing the escape key will not close the dialog.
 * @param {'paper' | 'body'} [props.scroll='paper'] - The scroll behavior of the dialog.
 * @param {object} [props.titleProps={}] - Additional props for the DialogTitle component.
 * @param {object} [props.contentProps={}] - Additional props for the DialogContent component.
 * @param {object} [props.actionsProps={}] - Additional props for the DialogActions component.
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles.
 * @param {React.ReactNode} [props.children] - The children of the dialog. If provided, `title`, `content`, `contentText`, and `actions` props are ignored.
 * @returns {React.ReactElement} The rendered Dialog component.
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
  children,
  ...props
}) => {
  const theme = useTheme();

  const handleBackdropClick = event => {
    if (!disableBackdropClick && onClose) {
      onClose(event, 'backdropClick');
    }
  };

  const hasChildren = React.Children.count(children) > 0;

  return (
    <MuiDialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      disableEscapeKeyDown={disableEscapeKeyDown}
      onBackdropClick={handleBackdropClick}
      aria-labelledby={title ? 'dialog-title' : undefined}
      aria-describedby={contentText ? 'dialog-description' : undefined}
      sx={{
        '& .MuiDialog-paper': {
          borderRadius: theme.shape.borderRadius * 1.5,
          ...sx,
        },
      }}
      {...props}
    >
      {hasChildren ? (
        children
      ) : (
        <>
          {title && (
            <DialogTitle
              id="dialog-title"
              sx={{
                pr: theme.spacing(showCloseButton ? 6 : 3),
                py: theme.spacing(2),
                ...titleProps.sx,
              }}
              {...titleProps}
            >
              <Typography variant="h6" component="h2">
                {title}
              </Typography>
              {showCloseButton && onClose && (
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    position: 'absolute',
                    right: theme.spacing(1),
                    top: theme.spacing(1),
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
              py: theme.spacing(2),
              ...contentProps.sx,
            }}
            {...contentProps}
          >
            {contentText && (
              <DialogContentText id="dialog-description" sx={{ mb: theme.spacing(2) }}>
                {contentText}
              </DialogContentText>
            )}
            {content}
          </DialogContent>

          {actions && (
            <DialogActions
              sx={{
                px: theme.spacing(3),
                py: theme.spacing(2),
                ...actionsProps.sx,
              }}
              {...actionsProps}
            >
              {actions}
            </DialogActions>
          )}
        </>
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
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
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
  /** The children of the dialog. If provided, `title`, `content`, `contentText`, and `actions` props are ignored. */
  children: PropTypes.node,
};

export default Dialog;
