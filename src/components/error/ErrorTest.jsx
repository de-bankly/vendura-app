import { useState } from 'react';
import { Button, Box, Typography, Container, Paper, Alert } from '@mui/material';
import ErrorBoundary from './ErrorBoundary';

/**
 * Component that throws an error when a button is clicked
 */
const BuggyCounter = () => {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    setCounter(prevCounter => prevCounter + 1);
  };

  if (counter === 3) {
    // Intentionally throw an error when counter reaches 3
    throw new Error('Simulated error: Counter reached 3!');
  }

  return (
    <Box sx={{ textAlign: 'center', my: 2 }}>
      <Typography variant="h6" gutterBottom>
        Counter: {counter}
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        {counter < 3
          ? `Click ${3 - counter} more time${3 - counter !== 1 ? 's' : ''} to trigger an error`
          : 'This should not be visible'}
      </Typography>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Increment Counter
      </Button>
    </Box>
  );
};

/**
 * Custom fallback component for the error boundary
 */
const CustomFallback = (error, resetErrorBoundary) => (
  <Paper sx={{ p: 3, backgroundColor: 'error.light', color: 'error.contrastText' }}>
    <Typography variant="h6" gutterBottom>
      Something went wrong in the counter component
    </Typography>
    <Typography variant="body2" paragraph>
      {error.message}
    </Typography>
    <Button variant="contained" color="secondary" onClick={resetErrorBoundary}>
      Reset Counter
    </Button>
  </Paper>
);

/**
 * Test component to demonstrate error boundary functionality
 */
const ErrorTest = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Error Boundary Test
      </Typography>

      <Alert severity="info" sx={{ mb: 4 }}>
        This page demonstrates how error boundaries work. The counter below will throw an error when
        it reaches 3. The error will be caught by the error boundary and a fallback UI will be
        displayed.
      </Alert>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            With Custom Fallback UI
          </Typography>
          <ErrorBoundary fallback={CustomFallback}>
            <BuggyCounter />
          </ErrorBoundary>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            With Default Fallback UI
          </Typography>
          <ErrorBoundary>
            <BuggyCounter />
          </ErrorBoundary>
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorTest;
