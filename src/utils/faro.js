import { matchRoutes } from 'react-router-dom';
import { getWebInstrumentations } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

// Create a custom React integration since we don't have @grafana/faro-react
const createReactRouterInstrumentation = matchRoutes => {
  return {
    name: 'react-router',
    instrumentRouting: router => {
      // This function will be used to wrap the router
      return router;
    },
    getRouteData: location => {
      // Extract route data from the current location
      const routes = router.routes || [];
      const matches = matchRoutes(routes, location.pathname);

      if (!matches || matches.length === 0) {
        return { name: 'unknown' };
      }

      // Get the matched route
      const match = matches[matches.length - 1];
      return {
        name: match.route.path || 'root',
      };
    },
  };
};

// Export a reference to the router for use in the instrumentation
let router;
export const setRouter = r => {
  router = r;
};

// Function to wrap router with Faro instrumentation
export const withFaroRouterInstrumentation = router => {
  // Use our custom instrumentation to wrap the router
  const reactRouterInstrumentation = createReactRouterInstrumentation(matchRoutes);
  return reactRouterInstrumentation.instrumentRouting(router);
};

// Initialize Faro
export const initializeFaro = () => {
  // Check if window is defined (to avoid SSR issues)
  if (typeof window === 'undefined') {
    return;
  }

  // For local development, don't initialize Faro
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.debug('Skipping Faro initialization in local development');
    return null;
  }

  // Dynamically import Faro to ensure it's only loaded in the browser
  import('@grafana/faro-web-sdk')
    .then(({ initializeFaro }) => {
      try {
        // Create the React Router instrumentation
        const reactRouterInstrumentation = createReactRouterInstrumentation(matchRoutes);

        // Create a custom transport that handles blocked requests
        const { FetchTransport } = window['@grafana/faro-web-sdk'] || {};

        const faroInstance = initializeFaro({
          url: 'https://faro-collector-prod-eu-west-2.grafana.net/collect/28c6b243dbe8e09e237d384271aee864',
          app: {
            name: 'vendura',
            version: '1.0.0',
            environment: 'production',
          },
          instrumentations: [
            // Mandatory, omits default instrumentations otherwise.
            ...getWebInstrumentations(),

            // Tracing package to get end-to-end visibility for HTTP requests.
            new TracingInstrumentation(),

            // Add our custom React Router instrumentation
            reactRouterInstrumentation,
          ],
          // Add error handling for transport
          transportOptions: {
            maxRetries: 0, // Don't retry if blocked
            captureException: false, // Don't report transport errors
            mode: 'no-cors', // Use no-cors mode to avoid CORS issues
          },
        });

        // Silence console errors from Faro
        const originalConsoleError = console.error;
        console.error = (...args) => {
          if (args[0] && typeof args[0] === 'string' && args[0].includes('Faro')) {
            // Suppress Faro errors
            return;
          }
          originalConsoleError.apply(console, args);
        };

        return faroInstance;
      } catch (error) {
        // Silently fail if Faro initialization fails
        console.debug('Telemetry initialization failed:', error);
        return null;
      }
    })
    .catch(error => {
      // Silently fail if Faro import fails
      console.debug('Telemetry import failed:', error);
      return null;
    });
};
