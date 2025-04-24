import { useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Toast from './Toast';

const ToastContext = createContext({
  showToast: () => {},
  hideToast: () => {},
});

/**
 * Hook to use the toast context.
 * @returns {object} The toast context value.
 * @throws {Error} If used outside of a ToastProvider.
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
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @param {number} [props.maxToasts=3] - The maximum number of toasts to display simultaneously.
 */
const ToastProvider = ({ children, maxToasts = 3 }) => {
  const [toasts, setToasts] = useState([]);
  const theme = useTheme();

  /**
   * Generates a unique ID for a toast.
   * @returns {string} A unique toast ID.
   */
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  /**
   * Removes a toast from the state entirely.
   * @param {string} id - The ID of the toast to remove.
   */
  const removeToast = useCallback(id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  /**
   * Hides a toast by setting its 'open' state to false, triggering the exit animation.
   * @param {string} id - The ID of the toast to hide.
   */
  const hideToast = useCallback(id => {
    setToasts(prevToasts =>
      prevToasts.map(toast => (toast.id === id ? { ...toast, open: false } : toast))
    );
  }, []);

  /**
   * Shows a new toast notification.
   * @param {object} options - The options for the toast.
   * @param {string} [options.id] - An optional specific ID for the toast.
   * @param {string} options.message - The message content of the toast.
   * @param {'success'|'info'|'warning'|'error'} [options.severity='info'] - The severity level of the toast.
   * @param {string} [options.title] - An optional title for the toast.
   * @param {number} [options.autoHideDuration=5000] - Duration in ms before the toast automatically hides.
   * @param {object} [options.anchorOrigin={ vertical: 'bottom', horizontal: 'left' }] - Position of the toast.
   * @param {React.ReactNode} [options.action] - Optional action element for the toast.
   * @param {'standard'|'filled'|'outlined'} [options.variant='standard'] - The visual variant of the toast.
   * @param {object} [options.sx] - Custom styles for the toast.
   * @returns {string} The ID of the shown toast.
   */
  const showToast = useCallback(
    options => {
      const id = options.id || generateId();
      const autoHideDuration = options.autoHideDuration ?? 5000;

      setToasts(prevToasts => {
        const updatedToasts =
          prevToasts.length >= maxToasts
            ? prevToasts.slice(prevToasts.length - maxToasts + 1)
            : [...prevToasts];

        return [
          ...updatedToasts,
          {
            id,
            open: true,
            message: options.message || '',
            severity: options.severity || 'info',
            title: options.title,
            autoHideDuration,
            anchorOrigin: options.anchorOrigin || {
              vertical: 'bottom',
              horizontal: 'left',
            },
            action: options.action,
            variant: options.variant || 'standard',
            sx: options.sx || {},
            creationTime: Date.now(),
          },
        ];
      });

      setTimeout(() => {
        hideToast(id);
      }, autoHideDuration);

      return id;
    },
    [generateId, maxToasts, hideToast]
  );

  /**
   * Creates a close handler for a specific toast ID.
   * Prevents closing on 'clickaway'.
   * @param {string} id - The ID of the toast this handler is for.
   * @returns {function} The event handler function.
   */
  const handleClose = useCallback(
    id => (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      hideToast(id);
    },
    [hideToast]
  );

  /**
   * Effect to periodically check for and hide toasts that have been visible
   * for an extended period (e.g., > 15 seconds), potentially due to issues
   * with the auto-hide timer or animation callbacks.
   */
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      const staleTimeThreshold = 15000; // 15 seconds

      setToasts(prevToasts =>
        prevToasts.map(toast => {
          if (
            toast &&
            toast.open &&
            toast.creationTime &&
            now - toast.creationTime > staleTimeThreshold
          ) {
            return { ...toast, open: false };
          }
          return toast;
        })
      );
    }, 5000); // Check every 5 seconds

    return () => clearInterval(cleanupInterval);
  }, []);

  const contextValue = {
    showToast,
    hideToast,
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const toastVariants = {
    initial: {
      x: -100,
      opacity: 0,
    },
    animate: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      <motion.div
        style={{
          position: 'fixed',
          bottom: theme.spacing(3),
          left: theme.spacing(3),
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column-reverse',
          alignItems: 'flex-start',
          gap: theme.spacing(2),
          pointerEvents: 'none',
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              layout
              initial="initial"
              animate={toast.open ? 'animate' : 'exit'}
              exit="exit"
              variants={toastVariants}
              style={{
                pointerEvents: 'auto',
                width: '100%',
              }}
              onAnimationComplete={definition => {
                if (definition === 'exit') {
                  removeToast(toast.id);
                }
              }}
            >
              <Toast
                open={true}
                onClose={handleClose(toast.id)}
                message={toast.message}
                severity={toast.severity}
                title={toast.title}
                autoHideDuration={null}
                action={toast.action}
                variant={toast.variant}
                sx={{
                  position: 'static',
                  width: { xs: 'calc(100vw - 32px)', sm: '320px' },
                  ...toast.sx,
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
  maxToasts: PropTypes.number,
};

export default ToastProvider;
