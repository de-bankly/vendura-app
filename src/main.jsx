// Initialize Faro as early as possible
import { initializeFaro } from './utils/faro';
initializeFaro();

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';

// Import our custom theme and global styles
import theme from './style/theme';
import './style/global/index.css';

// Import router configuration
import router from './routes/router';

// Import error boundary
import ErrorBoundary from './components/error/ErrorBoundary';

// Import configuration utility
import { applyRuntimeConfig } from './utils/config';

// Import service worker registration utility
import { registerServiceWorker } from './utils/registerSW';

// Create a function to initialize the app
const initializeApp = async () => {
  // Apply runtime configuration before rendering
  await applyRuntimeConfig();

  // Register service worker
  registerServiceWorker();

  // Render the application
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

// Initialize the application
initializeApp().catch(error => {
  console.error('Failed to initialize application:', error);

  // Render a fallback UI in case of initialization error
  createRoot(document.getElementById('root')).render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Application Error</h1>
      <p>Sorry, there was an error initializing the application. Please try again later.</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {error.message}
      </pre>
    </div>
  );
});
