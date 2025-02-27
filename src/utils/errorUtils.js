/**
 * Utility functions for error handling and logging
 */

/**
 * Logs an error to the console and potentially to an error tracking service
 * @param {Error} error - The error object
 * @param {Object} errorInfo - Additional information about the error
 * @param {string} source - The source of the error (e.g., 'ErrorBoundary', 'API', etc.)
 */
export const logError = (error, errorInfo = {}, source = 'Application') => {
  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.group(`Error caught by ${source}:`);
    console.error(error);
    if (Object.keys(errorInfo).length > 0) {
      console.error('Error Info:', errorInfo);
    }
    console.groupEnd();
  }

  // In a real application, you would send this to an error tracking service
  // Example with a hypothetical error tracking service:
  // if (typeof window.errorTrackingService !== 'undefined') {
  //   window.errorTrackingService.captureException(error, {
  //     extra: {
  //       ...errorInfo,
  //       source,
  //     },
  //   });
  // }
};

/**
 * Formats an error message for display to users
 * @param {Error} error - The error object
 * @param {boolean} includeStack - Whether to include the stack trace
 * @returns {Object} - Formatted error with message and optionally stack
 */
export const formatErrorForDisplay = (error, includeStack = false) => {
  if (!error) {
    return {
      message: 'An unknown error occurred',
      stack: null,
    };
  }

  // For security reasons, in production we might want to sanitize error messages
  // to avoid leaking sensitive information
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    message: isProduction ? 'An application error occurred' : error.message || 'Unknown error',
    stack: includeStack && !isProduction ? error.stack : null,
  };
};

/**
 * Determines if an error is a network error
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether the error is a network error
 */
export const isNetworkError = error => {
  return (
    error.message.includes('Network Error') ||
    error.message.includes('Failed to fetch') ||
    error.message.includes('NetworkError') ||
    error.message.includes('network request failed')
  );
};

/**
 * Gets a user-friendly message based on error type
 * @param {Error} error - The error object
 * @returns {string} - User-friendly error message
 */
export const getUserFriendlyErrorMessage = error => {
  if (!error) return 'An unknown error occurred';

  if (isNetworkError(error)) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  if (error.status === 404 || error.message.includes('404')) {
    return 'The requested resource was not found.';
  }

  if (
    error.status === 403 ||
    error.message.includes('403') ||
    error.message.includes('forbidden')
  ) {
    return 'You do not have permission to access this resource.';
  }

  if (
    error.status === 401 ||
    error.message.includes('401') ||
    error.message.includes('unauthorized')
  ) {
    return 'Please log in to access this resource.';
  }

  if (error.status === 500 || error.message.includes('500')) {
    return 'The server encountered an error. Please try again later.';
  }

  // Default message for production
  return process.env.NODE_ENV === 'production'
    ? 'An error occurred. Please try again later.'
    : error.message || 'An unknown error occurred';
};
