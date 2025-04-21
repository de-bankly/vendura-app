// Initialize Faro as early as possible
import { initializeFaro } from './utils/faro';
initializeFaro();

import { ThemeProvider, CssBaseline } from '@mui/material';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import './style/global/index.css';

import ErrorBoundary from './components/error/ErrorBoundary';

// Import AuthProvider
import { AuthProvider } from './contexts/AuthContext';
import router from './routes/router';
import theme from './style/theme';

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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
              <RouterProvider router={router} />
            </AuthProvider>
          </LocalizationProvider>
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
