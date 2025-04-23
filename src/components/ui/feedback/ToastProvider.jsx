import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

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
  const theme = useTheme();

  // Generate a unique ID for each toast
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  // Show a new toast notification
  const showToast = useCallback(
    options => {
      const id = options.id || generateId();
      // Set default autoHideDuration to 5000ms if not provided
      const autoHideDuration = options.autoHideDuration || 5000;

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
            autoHideDuration,
            anchorOrigin: options.anchorOrigin || { vertical: 'bottom', horizontal: 'left' },
            action: options.action,
            variant: options.variant || 'standard',
            sx: options.sx || {},
          },
        ];
      });

      // Set a timer to automatically hide the toast after autoHideDuration
      setTimeout(() => {
        hideToast(id);
      }, autoHideDuration);

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

  // Clean up any "hanging" toasts (if they've been visible for more than 10 seconds)
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();

      setToasts(prevToasts => {
        // Check for toasts that might be "stuck"
        const updatedToasts = prevToasts.map(toast => {
          // Extract time from ID to determine when it was created
          const idParts = toast.id.split('-');
          if (idParts.length >= 2) {
            const creationTime = parseInt(idParts[1], 10);
            // If a toast has been visible for more than 15 seconds, close it
            if (now - creationTime > 15000 && toast.open) {
              return { ...toast, open: false };
            }
          }
          return toast;
        });

        return updatedToasts;
      });
    }, 5000); // Check every 5 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  // Context value
  const contextValue = {
    showToast,
    hideToast,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Render all active toasts */}
      {toasts.map((toast, index) => {
        // Calculate stacking position and bottom offset for multiple toasts
        const stackIndex = toasts.length - index;
        // Calculate how far from the bottom each toast should be positioned
        const bottomPosition = index * 80; // Each toast roughly takes 80px of space

        return (
          <Toast
            key={toast.id}
            open={toast.open}
            onClose={handleClose(toast.id)}
            message={toast.message}
            severity={toast.severity}
            title={toast.title}
            autoHideDuration={toast.autoHideDuration}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: toast.anchorOrigin?.horizontal || 'left',
            }}
            action={toast.action}
            variant={toast.variant}
            TransitionProps={{
              onExited: () => removeToast(toast.id),
              style: { zIndex: 2000 + stackIndex },
            }}
            sx={{
              minWidth: '280px',
              maxWidth: '400px',
              bottom: theme.spacing(3 + bottomPosition / 8), // Convert to theme spacing units
              ...toast.sx,
            }}
          />
        );
      })}
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
