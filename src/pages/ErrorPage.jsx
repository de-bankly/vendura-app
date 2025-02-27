import { useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';

/**
 * Page that throws an error during rendering to test the RouterErrorBoundary
 * This component will throw an error when the throwError parameter is present in the URL
 */
const ErrorPage = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const shouldThrowError = searchParams.has('throwError');

  useEffect(() => {
    // Log that the component is about to throw an error
    if (shouldThrowError) {
      console.log('ErrorPage is about to throw an error due to throwError parameter');
    }
  }, [shouldThrowError]);

  // Throw an error if the throwError parameter is present
  if (shouldThrowError) {
    throw new Error('This is a simulated route error triggered by the throwError parameter');
  }

  return (
    <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Route Error Test Page
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        This page demonstrates how the RouterErrorBoundary works. Add the <code>?throwError</code>{' '}
        parameter to the URL to trigger an error.
      </Typography>

      <Button
        variant="contained"
        color="primary"
        href={`${window.location.pathname}?throwError`}
        sx={{ mr: 2 }}
      >
        Trigger Error
      </Button>

      <Button variant="outlined" color="primary" href="/error-test">
        Go to Component Error Test
      </Button>
    </Container>
  );
};

export default ErrorPage;
