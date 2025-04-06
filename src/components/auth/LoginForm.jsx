import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Alert } from '@mui/material';
import { AuthService } from '../../services';

/**
 * Login form component for user authentication
 */
const LoginForm = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await AuthService.login(username, password);
      setLoading(false);

      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
    } catch (err) {
      setLoading(false);
      const errorMessage =
        err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        Login
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />

        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LoginForm;
