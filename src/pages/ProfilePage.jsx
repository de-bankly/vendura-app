import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { UserService, RoleService } from '../services';

/**
 * User profile page to display current user information
 */
const ProfilePage = () => {
  const { user, refreshUserProfile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [roles, setRoles] = useState([]);

  // Load user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');

      try {
        const userData = await UserService.getCurrentUserProfile();
        setProfileData(userData);

        // Fetch roles to ensure we have role names
        const rolesResponse = await RoleService.getAllRoles(0, 100);
        setRoles(rolesResponse.content || []);
      } catch (err) {
        setError('Failed to load profile: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Show loading state
  if (loading && !profileData) {
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
                {profileData.roles?.map(role => {
                  // Check if role is an object with id and name or just an ID
                  const roleId = typeof role === 'object' ? role.id : role;
                  const roleName =
                    typeof role === 'object' && role.name
                      ? role.name
                      : roles.find(r => r.id === roleId)?.name || roleId;

                  return (
                    <Chip
                      key={roleId}
                      label={roleName}
                      variant="outlined"
                      color="primary"
                      size="small"
                    />
                  );
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
