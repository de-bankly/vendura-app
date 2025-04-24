import { Person as PersonIcon, Email as EmailIcon, Work as WorkIcon } from '@mui/icons-material';
import {
  Container,
  Box,
  Typography,
  Grid,
  Avatar,
  Paper,
  Divider,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import React, { useState, useEffect, useCallback } from 'react';

import Chip from '../components/ui/feedback/Chip';
import { useAuth } from '../contexts/AuthContext';
import { RoleService } from '../services';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * Renders the user profile page, displaying the current user's information,
 * roles, and some placeholder statistics. It fetches role details to map
 * role IDs to names.
 * @returns {React.ReactElement} The ProfilePage component.
 */
const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError('');
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

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  if (authLoading || loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Could not load user profile. Please ensure you are logged in.
        </Alert>
      </Container>
    );
  }

  const profileData = user;

  return (
    <Box sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Benutzerprofil
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Verwalten Sie Ihre persönlichen Informationen und Einstellungen
          </Typography>
        </Container>
      </motion.div>

      <Container maxWidth="xl">
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          <motion.div variants={itemVariants}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 120,
                      height: 120,
                      my: 2,
                      bgcolor: theme.palette.primary.main,
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 64 }} />
                  </Avatar>

                  <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, textAlign: 'center' }}>
                    {profileData.firstName} {profileData.lastName}
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    sx={{ mb: 2, textAlign: 'center' }}
                  >
                    @{profileData.username}
                  </Typography>

                  <Chip
                    label={profileData.active !== false ? 'Aktiv' : 'Inaktiv'}
                    color={profileData.active !== false ? 'success' : 'error'}
                    size="medium"
                    sx={{ mb: 3 }}
                  />
                </Paper>
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <EmailIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Kontaktinformationen
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 3 }} />

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Vorname
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {profileData.firstName || 'Nicht angegeben'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Nachname
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {profileData.lastName || 'Nicht angegeben'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            Benutzername
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {profileData.username || 'Nicht angegeben'}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle2" color="text.secondary">
                            E-Mail
                          </Typography>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {profileData.email || 'Nicht angegeben'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <WorkIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Rollen & Berechtigungen
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 3 }} />

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {profileData.roles?.map((role, index) => {
                          if (typeof role === 'string') {
                            const roleObj = roles.find(r => r.id === role);
                            const roleName = roleObj ? roleObj.name : `Role ${index + 1}`;
                            return (
                              <Chip
                                key={role || index}
                                label={roleName}
                                variant="outlined"
                                color="primary"
                                size="medium"
                              />
                            );
                          }
                          return null;
                        })}
                        {(!profileData.roles || profileData.roles.length === 0) && (
                          <Typography variant="body2" color="text.secondary">
                            Keine Rollen zugewiesen
                          </Typography>
                        )}
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        background: alpha(theme.palette.primary.main, 0.05),
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Konto-Statistik
                      </Typography>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              borderRadius: 1,
                              bgcolor: theme.palette.background.paper,
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: 700, color: theme.palette.primary.main }}
                            >
                              {Math.floor(Math.random() * 200)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Abgeschlossene Verkäufe
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              borderRadius: 1,
                              bgcolor: theme.palette.background.paper,
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: 700, color: theme.palette.secondary.main }}
                            >
                              {Math.floor(Math.random() * 50)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Inventaraktualisierungen
                            </Typography>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                          <Box
                            sx={{
                              textAlign: 'center',
                              p: 2,
                              borderRadius: 1,
                              bgcolor: theme.palette.background.paper,
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{ fontWeight: 700, color: theme.palette.success.main }}
                            >
                              {Math.floor(Math.random() * 30)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Eingelöste Gutscheine
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProfilePage;
