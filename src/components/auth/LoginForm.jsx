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
} from '@mui/material';
import { useState } from 'react';

import { getUserFriendlyErrorMessage } from '../../utils/errorUtils';

/**
 * Login form component for user authentication
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
          sx={{ mb: 3, borderRadius: theme.shape.borderRadius }}
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
          mb: 2,
          '& .MuiOutlinedInput-root': {
            borderRadius: theme.shape.borderRadius,
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
            borderRadius: theme.shape.borderRadius,
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
