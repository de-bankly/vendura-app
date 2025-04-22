import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { AuthProvider } from './contexts/AuthContext';
import { BarcodeProvider } from './contexts/BarcodeContext';

/**
 * Main application component
 * Serves as the entry point for the application
 */
function App() {
  return (
    <AuthProvider>
      <BarcodeProvider>
        <RouterProvider router={router} />
      </BarcodeProvider>
    </AuthProvider>
  );
}

export default App;
