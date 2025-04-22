import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { AuthProvider } from './contexts/AuthContext';

/**
 * Main application component
 * Serves as the entry point for the application
 */
function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
