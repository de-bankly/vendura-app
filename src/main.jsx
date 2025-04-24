import { initializeFaro } from './utils/faro';
initializeFaro();

import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import ErrorBoundary from './components/error/ErrorBoundary';
import { ToastProvider } from './components/ui/feedback';
import { AuthProvider } from './contexts/AuthContext';
import router from './routes/router';
import './style/global/index.css';
import theme from './style/theme';
import { applyRuntimeConfig } from './utils/config';
import { registerServiceWorker } from './utils/registerSW';

/**
 * Asynchronously initializes the application.
 * Applies runtime configuration, registers the service worker,
 * and then renders the main React component tree into the DOM.
 * @async
 * @function
 * @name initializeApp
 * @returns {Promise<void>} A promise that resolves once the rendering process is initiated.
 */
const initializeApp = async () => {
  await applyRuntimeConfig();
  registerServiceWorker();

  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AuthProvider>
              <ToastProvider>
                <RouterProvider router={router} />
              </ToastProvider>
            </AuthProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

initializeApp().catch(error => {
  console.error('Failed to initialize application:', error);

  // Render a fallback UI in case of initialization error
  createRoot(document.getElementById('root')).render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Application Error</h1>
      <p>Sorry, there was an error initializing the application. Please try again later.</p>
      <pre
        style={{
          background: '#f5f5f5',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        {error.message}
      </pre>
    </div>
  );
});
