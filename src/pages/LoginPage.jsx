import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Box, Paper, Avatar, alpha } from '@mui/material';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTheme } from '@mui/material/styles';

/**
 * Login page component
 */
const LoginPage = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

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
  const handleLoginSuccess = useCallback(() => {
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  }, [navigate, location.state]);

  /**
   * Handle login form submission
   */
  const handleLogin = useCallback(
    async (username, password) => {
      try {
        await login(username, password);
        handleLoginSuccess();
      } catch (error) {
        // Error handling is done in the LoginForm component
        console.error('Login error:', error);
      }
    },
    [login, handleLoginSuccess]
  );

  return (
    <Container maxWidth="xs" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: theme.shape.borderRadius * 2,
            border: 1,
            borderColor: 'grey.200',
            boxShadow: theme.shadows[3],
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              sx={{
                bgcolor: alpha(theme.palette.primary.main, 0.9),
                mb: 2,
                width: 56,
                height: 56,
              }}
            >
              <LockOutlinedIcon fontSize="medium" />
            </Avatar>

            <Typography variant="h5" component="h1" align="center" sx={{ mb: 3, fontWeight: 600 }}>
              Willkommen bei Vendura
            </Typography>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
              Bitte melden Sie sich an, um fortzufahren
            </Typography>

            <LoginForm onLoginSuccess={handleLoginSuccess} onSubmit={handleLogin} />
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;
