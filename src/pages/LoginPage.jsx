import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login page component
 */
const LoginPage = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already logged in, redirect to homepage or intended destination
  useEffect(() => {
    if (isLoggedIn()) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  /**
   * Handle successful login
   */
  const handleLoginSuccess = () => {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };

  /**
   * Handle login form submission
   */
  const handleLogin = async (username, password) => {
    try {
      await login(username, password);
      handleLoginSuccess();
    } catch (error) {
      // Error handling is done in the LoginForm component
      console.error('Login error:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" align="center" sx={{ my: 4 }}>
        Welcome to Vendura
      </Typography>
      <LoginForm onLoginSuccess={handleLoginSuccess} onSubmit={handleLogin} />
    </Container>
  );
};

export default LoginPage;
