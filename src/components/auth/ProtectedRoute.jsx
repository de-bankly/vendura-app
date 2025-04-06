import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * Component for protecting routes that require authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @param {string} [props.requiredRole] - Optional role required for access
 * @param {boolean} [props.adminOnly=false] - Whether the route requires admin access
 */
const ProtectedRoute = ({ children, requiredRole, adminOnly = false }) => {
  const { isLoggedIn, loading, hasRole, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // If not logged in, redirect to login
  if (!isLoggedIn()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check for admin requirement
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;
