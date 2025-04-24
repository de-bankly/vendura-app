import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Container, Typography, Box, Paper, Grid, useMediaQuery, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import React, { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../contexts/AuthContext';

/**
 * Login page component for cashier platform
 */
const LoginPage = () => {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
  }, [navigate, location]);

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
    <Container
      maxWidth="md"
      sx={{
        py: { xs: 4, md: 8 },
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: '100%' }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: theme.shape.borderRadius * 2,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Left side - Brand section */}
          <Box
            sx={{
              bgcolor: alpha(theme.palette.primary.main, 0.95),
              color: 'white',
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              width: { xs: '100%', md: '45%' },
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1,
                zIndex: 0,
                background: `repeating-linear-gradient(
                  45deg,
                  ${theme.palette.primary.dark},
                  ${theme.palette.primary.dark} 10px,
                  ${theme.palette.primary.main} 10px,
                  ${theme.palette.primary.main} 20px
                )`,
              }}
            />

            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ mb: 3 }}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 200,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: 'rgba(255, 255, 255, 0.15)',
                      width: { xs: 80, md: 100 },
                      height: { xs: 80, md: 100 },
                      mb: 3,
                      mx: 'auto',
                    }}
                  >
                    <PointOfSaleIcon sx={{ fontSize: { xs: 40, md: 50 } }} />
                  </Box>
                </motion.div>
              </Box>

              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                Vendura Kasse
              </Typography>

              <Typography variant="subtitle1" sx={{ mb: 3, opacity: 0.85 }}>
                Ihre moderne Kassenlösung für den täglichen Gebrauch
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2, justifyContent: 'center' }}>
                {[
                  { icon: <StorefrontIcon />, text: 'Effiziente Verkaufsabwicklung' },
                  { icon: <LockOutlinedIcon />, text: 'Sichere Transaktionen' },
                ].map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: theme.shape.borderRadius,
                      }}
                    >
                      <Box sx={{ mr: 2 }}>{item.icon}</Box>
                      <Typography variant="body2">{item.text}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* Right side - Login form */}
          <Box
            sx={{
              p: { xs: 3, sm: 4, md: 5 },
              width: { xs: '100%', md: '55%' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                Willkommen zurück
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Bitte melden Sie sich an, um auf das Kassensystem zuzugreifen
              </Typography>
            </Box>

            <LoginForm onLoginSuccess={handleLoginSuccess} onSubmit={handleLogin} />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                mt: 4,
                textAlign: 'center',
                opacity: 0.7,
              }}
            >
              © {new Date().getFullYear()} Vendura a product by BankLy
            </Typography>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default LoginPage;
