import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { AuthService } from '../../services';
import { getUserFriendlyErrorMessage } from '../../utils/errorUtils';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

/**
 * Login form component for user authentication
 */
const LoginForm = ({ onLoginSuccess, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!username || !password) {
      setError('Bitte geben Sie Benutzernamen und Passwort ein');
      return;
    }

    setError('');
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(username, password);
      } else {
        const response = await AuthService.login(username, password);
        if (onLoginSuccess) {
          onLoginSuccess(response);
        }
      }
    } catch (err) {
      setLoading(false);

      // Use the error utils to get a user-friendly message
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);

      // Log the error for debugging
      console.error('Login error details:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 1 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Benutzername"
        variant="outlined"
        fullWidth
        margin="normal"
        value={username}
        onChange={e => setUsername(e.target.value)}
        autoFocus
        sx={{
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <PersonOutlineIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Passwort"
        type="password"
        variant="outlined"
        fullWidth
        margin="normal"
        value={password}
        onChange={e => setPassword(e.target.value)}
        sx={{
          mb: 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockOutlinedIcon color="action" />
            </InputAdornment>
          ),
        }}
      />

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        sx={{
          py: 1.5,
          borderRadius: 1,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Anmelden'}
      </Button>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Demo Zugangsdaten: admin / password
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
