import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  CircularProgress,
  useTheme,
  Divider,
} from '@mui/material';
import { useState } from 'react';

import { getUserFriendlyErrorMessage } from '../../utils/errorUtils';

/**
 * Modern login form component for cashier platform
 */
const LoginForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const errorAlertId = 'login-error-alert';

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
      }
    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);
      console.error('Login error details:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: '100%' }}
      aria-describedby={error ? errorAlertId : undefined}
    >
      {error && (
        <Alert
          id={errorAlertId}
          severity="error"
          sx={{
            mb: 3,
            borderRadius: theme.shape.borderRadius,
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.1)',
            animation: 'shake 0.5s',
            '@keyframes shake': {
              '0%, 100%': { transform: 'translateX(0)' },
              '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
              '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
            },
          }}
          role="alert"
        >
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
          mb: 2.5,
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.1)',
            },
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
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            },
            '&.Mui-focused': {
              boxShadow: '0 2px 10px rgba(15, 23, 42, 0.1)',
            },
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
          py: 1.75,
          borderRadius: theme.shape.borderRadius * 1.5,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
          boxShadow: '0 4px 10px rgba(15, 23, 42, 0.15)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 6px 15px rgba(15, 23, 42, 0.2)',
            transform: 'translateY(-2px)',
          },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Anmelden'}
      </Button>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Divider sx={{ mb: 2, '&::before, &::after': { borderColor: 'grey.200' } }}>
          <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
            oder
          </Typography>
        </Divider>

        <Typography variant="body2" color="text.secondary">
          Probleme bei der Anmeldung?{' '}
          <Typography
            component="span"
            variant="body2"
            color="primary"
            sx={{
              cursor: 'pointer',
              fontWeight: 500,
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            Support kontaktieren
          </Typography>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
