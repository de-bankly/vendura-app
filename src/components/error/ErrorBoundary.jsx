import { Component } from 'react';
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate, useRouteError } from 'react-router-dom';

/**
 * Error details component that displays the error message and stack trace
 */
const ErrorDetails = ({ error }) => {
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
        {error?.message || 'An unknown error occurred'}
      </Typography>
      {error?.stack && (
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
          {error.stack}
        </Typography>
      )}
    </Paper>
  );
};

/**
 * Button to navigate back to the home page
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
 * Error UI component that displays a user-friendly error message
 */
const ErrorUI = ({ error, resetErrorBoundary, showDetails = false }) => {
  return (
    <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
      <ErrorOutlineIcon color="error" sx={{ fontSize: 80, mb: 2 }} />

      <Typography variant="h4" gutterBottom sx={{ mb: 2 }}>
        Something Went Wrong
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 3 }}>
        We apologize for the inconvenience. An error has occurred in the application.
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
 * Router error boundary component that catches errors thrown during routing
 */
export const RouterErrorBoundary = () => {
  const error = useRouteError();

  return <ErrorUI error={error} showDetails={process.env.NODE_ENV !== 'production'} />;
};

/**
 * Class component that catches errors in its child component tree
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

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
          showDetails={process.env.NODE_ENV !== 'production'}
        />
      );
    }

    return children;
  }
}

export default ErrorBoundary;
