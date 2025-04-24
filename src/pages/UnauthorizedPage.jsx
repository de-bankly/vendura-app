import { Error as ErrorIcon } from '@mui/icons-material';
import { Box, Button, Container, Paper, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Page displayed when user doesn't have sufficient permissions.
 * @returns {React.ReactElement} The UnauthorizedPage component.
 */
const UnauthorizedPage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={2}
        sx={{
          p: 4,
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <ErrorIcon color="error" sx={{ fontSize: 80 }} />

        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>

        <Typography variant="body1" color="text.secondary" paragraph>
          You don't have permission to access this page. Please contact your administrator if you
          believe this is an error.
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button component={Link} to="/" variant="contained" color="primary" sx={{ mx: 1 }}>
            Go to Home
          </Button>

          <Button component={Link} to="/profile" variant="outlined" sx={{ mx: 1 }}>
            My Profile
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default UnauthorizedPage;
