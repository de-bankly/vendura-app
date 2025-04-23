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

  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }, []);

  const showToast = useCallback(
    options => {
      const id = options.id || generateId();
      const autoHideDuration = options.autoHideDuration || 5000;

      setToasts(prevToasts => {
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

      setTimeout(() => {
        hideToast(id);
      }, autoHideDuration);

      return id;
    },
    [generateId, maxToasts]
  );

  const removeToast = useCallback(id => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  }, []);

  const hideToast = useCallback(id => {
    setToasts(prevToasts =>
      prevToasts.map(toast => (toast.id === id ? { ...toast, open: false } : toast))
    );
  }, []);

  const handleClose = useCallback(
    id => (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
      hideToast(id);
    },
    [hideToast]
  );

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();

      setToasts(prevToasts => {
        const updatedToasts = prevToasts.map(toast => {
          const idParts = toast.id.split('-');
          if (idParts.length >= 2) {
            const creationTime = parseInt(idParts[1], 10);
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
                autoHideDuration={toast.autoHideDuration}
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
