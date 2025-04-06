import { createBrowserRouter } from 'react-router-dom';
import { withFaroRouterInstrumentation, setRouter } from '../utils/faro';

// Layouts
import TopNavLayout from '../components/layout/TopNavLayout';

// Pages
import Home from '../pages/Home';
import ShowcasePage from '../pages/ShowcasePage';
import NotFound from '../pages/NotFound';
import ErrorPage from '../pages/ErrorPage';
import SalesScreen from '../pages/SalesScreen';

// Error handling
import { RouterErrorBoundary } from '../components/error/ErrorBoundary';
import ErrorTest from '../components/error/ErrorTest';

/**
 * Application router configuration
 * Defines all available routes and their corresponding components
 */
const reactBrowserRouter = createBrowserRouter([
  {
    path: '/',
    element: <TopNavLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'showcase',
        element: <ShowcasePage />,
      },
      {
        path: 'sales',
        element: <SalesScreen />,
      },
      {
        path: 'error-test',
        element: <ErrorTest />,
      },
      {
        path: 'error-page',
        element: <ErrorPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

// Store router reference for Faro instrumentation
setRouter(reactBrowserRouter);

// Apply Faro instrumentation to the router
const router = withFaroRouterInstrumentation(reactBrowserRouter);

export default router;
