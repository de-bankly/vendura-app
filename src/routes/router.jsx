import { createBrowserRouter } from 'react-router-dom';
import { withFaroRouterInstrumentation, setRouter } from '../utils/faro';

// Layouts
import MainLayout from '../components/layout/MainLayout';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import ShowcasePage from '../pages/ShowcasePage';
import NotFound from '../pages/NotFound';
import ErrorPage from '../pages/ErrorPage';

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
    element: <MainLayout />,
    errorElement: <RouterErrorBoundary />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'showcase',
        element: <ShowcasePage />,
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
