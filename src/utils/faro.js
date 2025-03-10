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

// Function to wrap router with Faro instrumentation
export const withFaroRouterInstrumentation = router => {
  // Since we don't have the actual ReactIntegration, we'll implement a simpler version
  // that just returns the original router
  return router;
};

// Initialize Faro
export const initializeFaro = () => {
  // Check if window is defined (to avoid SSR issues)
  if (typeof window === 'undefined') {
    return;
  }

  // Dynamically import Faro to ensure it's only loaded in the browser
  import('@grafana/faro-web-sdk').then(({ initializeFaro }) => {
    initializeFaro({
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
      ],
    });
  });
};

// Export a reference to the router for use in the instrumentation
let router;
export const setRouter = r => {
  router = r;
};
