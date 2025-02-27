import { createBrowserRouter } from 'react-router-dom';

// Layouts
import MainLayout from '../components/layout/MainLayout';

// Pages
import Home from '../pages/Home';
import About from '../pages/About';
import ShowcasePage from '../pages/ShowcasePage';
import NotFound from '../pages/NotFound';

/**
 * Application router configuration
 * Defines all available routes and their corresponding components
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <NotFound />,
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
    ],
  },
]);

export default router;
