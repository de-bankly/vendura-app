import { Person as PersonIcon } from '@mui/icons-material';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';

import Chip from '../components/ui/feedback/Chip';
import { useAuth } from '../contexts/AuthContext';
import { RoleService } from '../services';

/**
 * User profile page to display current user information
 */
const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch available roles for mapping role IDs to names
  const fetchRoles = useCallback(async () => {
    try {
      const response = await RoleService.getAllRoles(0, 100);
      setRoles(response.content || []);
    } catch (err) {
      console.error('Failed to load roles:', err);
      setError('Failed to load role information');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load roles on mount
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Show loading state based on auth context loading or roles loading
  if (authLoading || loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  // Handle case where user is not loaded (e.g., not logged in, error during context load)
  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Could not load user profile. Please ensure you are logged in.
        </Alert>
      </Container>
    );
  }

  // Use user directly from context as profileData
  const profileData = user;

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {profileData && (
        <Paper elevation={2} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
              <PersonIcon sx={{ fontSize: 40 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" gutterBottom>
                {profileData.firstName} {profileData.lastName}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                @{profileData.username}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1" gutterBottom>
                {profileData.email || 'Not provided'}
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={profileData.active !== false ? 'Active' : 'Inactive'}
                color={profileData.active !== false ? 'success' : 'error'}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Roles
              </Typography>
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {profileData.roles?.map((role, index) => {
                  // If role is a string (just the ID)
                  if (typeof role === 'string') {
                    const roleObj = roles.find(r => r.id === role);
                    const roleName = roleObj ? roleObj.name : `Role ${index + 1}`;
                    return (
                      <Chip
                        key={role || index}
                        label={roleName}
                        variant="outlined"
                        color="primary"
                        size="small"
                      />
                    );
                  }

                  return null;
                })}
                {(!profileData.roles || profileData.roles.length === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    No roles assigned
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}
    </Container>
  );
};

export default ProfilePage;
