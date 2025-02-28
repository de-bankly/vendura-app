import { createBrowserRouter } from 'react-router-dom';

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
const router = createBrowserRouter([
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

export default router;
