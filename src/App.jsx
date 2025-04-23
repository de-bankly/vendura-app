import { RouterProvider } from 'react-router-dom';
import router from './routes/router';

/**
 * Main application component
 * Serves as the entry point for the application
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;
