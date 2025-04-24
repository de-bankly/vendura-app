import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { Typography, Container, Button, Paper } from '@mui/material';
import { Component } from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';

import {
  logError,
  formatErrorForDisplay,
  getUserFriendlyErrorMessage,
} from '../../utils/errorUtils';

/**
 * Error details component that displays the error message and stack trace.
 * @param {object} props - Component props.
 * @param {Error} props.error - The error object to display.
 * @returns {JSX.Element} The rendered component.
 */
const ErrorDetails = ({ error }) => {
  const formattedError = formatErrorForDisplay(error, true);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mt: 2,
        backgroundColor: 'error.light',
        color: 'error.contrastText',
        borderRadius: 1,
        maxHeight: '200px',
        overflow: 'auto',
      }}
    >
      <Typography variant="subtitle2" fontFamily="monospace">
        {formattedError.message}
      </Typography>
      {formattedError.stack && (
        <Typography
          variant="body2"
          component="pre"
          sx={{
            mt: 1,
            fontSize: '0.75rem',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {formattedError.stack}
        </Typography>
      )}
    </Paper>
  );
};

/**
 * Button to navigate back to the home page.
 * @returns {JSX.Element} The rendered component.
 */
const HomeButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      onClick={() => navigate('/')}
      sx={{ mt: 3 }}
    >
      Return to Home
    </Button>
  );
};

/**
 * Error UI component that displays a user-friendly error message.
 * @param {object} props - Component props.
 * @param {Error | null} props.error - The error object.
 * @param {Function} [props.resetErrorBoundary] - Function to reset the error state.
 * @param {boolean} [props.showDetails=false] - Whether to show detailed error information.
 * @returns {JSX.Element} The rendered component.
 */
const ErrorUI = ({ error, resetErrorBoundary, showDetails = false }) => {
  const friendlyMessage = getUserFriendlyErrorMessage(error);

  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />

      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Something Went Wrong
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        {friendlyMessage}
      </Typography>

      {resetErrorBoundary && (
        <Button variant="outlined" color="primary" onClick={resetErrorBoundary} sx={{ mr: 2 }}>
          Try Again
        </Button>
      )}

      <HomeButton />

      {showDetails && error && <ErrorDetails error={error} />}
    </Container>
  );
};

/**
 * Router error boundary component that catches errors thrown during routing.
 * Uses `useRouteError` hook from react-router-dom.
 * @returns {JSX.Element} The rendered error UI.
 */
export const RouterErrorBoundary = () => {
  const error = useRouteError();

  logError(error, {}, 'RouterErrorBoundary');

  return <ErrorUI error={error} showDetails={import.meta.env.DEV} />;
};

/**
 * Class component that catches errors in its child component tree.
 * Implements the React Error Boundary interface.
 * @extends Component
 */
class ErrorBoundary extends Component {
  /**
   * Creates an instance of ErrorBoundary.
   * @param {object} props - Component props.
   * @param {React.ReactNode} props.children - The child components to render.
   * @param {Function} [props.fallback] - A fallback component/function to render on error.
   * @param {Function} [props.onReset] - Callback function when the boundary is reset.
   */
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Lifecycle method to update state when an error is thrown by a descendant component.
   * @param {Error} error - The error that was thrown.
   * @returns {{ hasError: boolean, error: Error }} - An object to update the state.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Lifecycle method called after an error has been thrown by a descendant component.
   * Used for side effects like logging.
   * @param {Error} error - The error that was thrown.
   * @param {React.ErrorInfo} errorInfo - An object with component stack information.
   */
  componentDidCatch(error, errorInfo) {
    logError(error, errorInfo, 'ErrorBoundary');
  }

  /**
   * Resets the error state of the boundary.
   * Calls the optional `onReset` prop if provided in development mode.
   */
  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    if (import.meta.env.DEV && this.props.onReset) {
      this.props.onReset();
    }
  };

  /**
   * Renders the component.
   * If an error occurred, it renders the fallback UI or a default ErrorUI.
   * Otherwise, it renders the children.
   * @returns {React.ReactNode} The rendered component tree or fallback UI.
   */
  render() {
    const { children, fallback } = this.props;
    const { hasError, error } = this.state;

    if (hasError) {
      if (fallback) {
        return fallback(error, this.resetErrorBoundary);
      }

      return (
        <ErrorUI
          error={error}
          resetErrorBoundary={this.resetErrorBoundary}
          showDetails={import.meta.env.DEV}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
