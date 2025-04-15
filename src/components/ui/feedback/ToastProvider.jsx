import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Toast from './Toast';

// Create context for toast notifications
const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

/**
 * Hook to use the toast context
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * ToastProvider component that manages multiple toast notifications.
 * Provides a context for showing and hiding toasts from anywhere in the application.
 */
const ToastProvider = ({ children, maxToasts = 3 }) => {
  const [toasts, setToasts] = useState([]);

  // Generate a unique ID for each toast
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  // Show a new toast notification
  const showToast = useCallback(
    options => {
      const id = options.id || generateId();

      // Add new toast to the list
      setToasts(prevToasts => {
        // If we've reached the maximum number of toasts, remove the oldest one
        const updatedToasts = [...prevToasts];
        if (updatedToasts.length >= maxToasts) {
          updatedToasts.shift();
        }

        return [
          ...updatedToasts,
          {
            id,
            open: true,
            message: options.message || '',
            severity: options.severity || 'info',
            title: options.title,
            autoHideDuration: options.autoHideDuration || 6000,
            anchorOrigin: options.anchorOrigin || { vertical: 'bottom', horizontal: 'left' },
            action: options.action,
            variant: options.variant || 'filled',
            sx: options.sx || {},
          },
        ];
      });

      return id;
    },
    [generateId, maxToasts]
  );

  // Function to remove toast from state after exit animation
  const removeToast = useCallback(id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  // Hide a toast notification (triggers exit animation)
  const hideToast = useCallback(id => {
    setToasts(prevToasts =>
      prevToasts.map(toast => (toast.id === id ? { ...toast, open: false } : toast))
    );
  }, []);

  // Handle toast close event (triggered by Snackbar onClose)
  const handleClose = useCallback(
    id => (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      hideToast(id); // Start hiding animation
    },
    [hideToast]
  );

  // Context value
  const contextValue = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Render all active toasts */}
      <Box
        sx={{
          position: 'fixed',
          zIndex: 2000,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            open={toast.open}
            onClose={handleClose(toast.id)}
            message={toast.message}
            severity={toast.severity}
            title={toast.title}
            autoHideDuration={toast.autoHideDuration}
            anchorOrigin={toast.anchorOrigin}
            action={toast.action}
            variant={toast.variant}
            TransitionProps={{ onExited: () => removeToast(toast.id) }}
            sx={{
              pointerEvents: 'auto',
              ...toast.sx,
            }}
          />
        ))}
      </Box>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  /** The children to render */
  children: PropTypes.node.isRequired,
  /** The maximum number of toasts to show at once */
  maxToasts: PropTypes.number,
};

export default ToastProvider;
