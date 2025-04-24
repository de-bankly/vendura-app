import { CircularProgress, Box } from '@mui/material';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';

/**
 * Component for protecting routes that require authentication.
 * It checks if the user is logged in and optionally if they have a specific role or admin privileges.
 * While checking authentication status, it displays a loading indicator.
 * If the user is not authenticated or authorized, it redirects them accordingly.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render if the user is authenticated and authorized.
 * @param {string} [props.requiredRole] - An optional role required to access the route.
 * @param {boolean} [props.adminOnly=false] - Specifies if only admin users can access the route. Defaults to false.
 * @returns {React.ReactElement | null} The child components if authorized, a redirect component, or a loading indicator.
 */
const ProtectedRoute = ({ children, requiredRole, adminOnly = false }) => {
  const { isLoggedIn, loading, hasRole, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
