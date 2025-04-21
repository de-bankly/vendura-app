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
  if (import.meta.env.DEV) {
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
  const isProduction = import.meta.env.PROD;

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
 * @param {string} defaultMessage - The default error message
 * @returns {string} User-friendly error message
 */
export const getUserFriendlyErrorMessage = (
  error,
  defaultMessage = 'Ein Fehler ist aufgetreten'
) => {
  console.log('Detailed Error:', error);

  // If we have a detailed error message from our enhanced error handling
  if (error.message && error.message.includes('Payment failed')) {
    // Extract the actual error message part after the colon
    const matchResult = error.message.match(/Payment failed \(\d+\): (.*)/);
    if (matchResult && matchResult[1]) {
      return matchResult[1];
    }
    return error.message; // Return the whole message if we can't extract
  }

  // Handle other known error scenarios
  if (error.response) {
    const { status, data } = error.response;

    // Handle specific status codes
    switch (status) {
      case 400:
        return (
          data.message || data.error || 'Ungültige Anfrage. Bitte überprüfen Sie Ihre Eingaben.'
        );
      case 401:
        return 'Sie sind nicht berechtigt, diese Aktion durchzuführen.';
      case 403:
        return 'Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.';
      case 404:
        return 'Die angeforderte Ressource wurde nicht gefunden.';
      case 500:
        return 'Ein Serverfehler ist aufgetreten. Bitte versuchen Sie es später erneut.';
      default:
        // Try to get a message from the response
        return data.message || data.error || defaultMessage;
    }
  }

  // Check for network errors
  if (error.request && !error.response) {
    return 'Netzwerkfehler. Bitte überprüfen Sie Ihre Internetverbindung.';
  }

  // For all other error types
  return error.message || defaultMessage;
};
