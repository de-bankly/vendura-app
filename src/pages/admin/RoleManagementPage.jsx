import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as RoleIcon,
  Badge as BadgeIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import {
  Container,
  Typography,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
  useTheme,
  Grid,
  Card,
  CardContent,
  alpha,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

import { Button } from '../../components/ui/buttons';
import { RoleService } from '../../services';

// Animation variants
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
 * Role management page for administrators
 */
const RoleManagementPage = () => {
  const theme = useTheme();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentRole, setCurrentRole] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    active: true,
  });

  // Fetch roles with pagination
  const fetchRoles = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await RoleService.getAllRoles(page, 10);
      setRoles(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      setError('Failed to load roles: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Load roles
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Handle page change
  const handlePageChange = useCallback((event, value) => {
    setPage(value - 1);
  }, []);

  // Open dialog for new role
  const handleOpenAddDialog = useCallback(() => {
    setEditMode(false);
    setCurrentRole(null);
    setFormData({
      name: '',
      description: '',
      active: true,
    });
    setOpen(true);
  }, []);

  // Open dialog for editing role
  const handleOpenEditDialog = useCallback(role => {
    setEditMode(true);
    setCurrentRole(role);
    setFormData({
      name: role.name || '',
      description: role.description || '',
      active: role.active !== false,
    });
    setOpen(true);
  }, []);

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = useCallback(role => {
    setRoleToDelete(role);
    setConfirmDelete(true);
  }, []);

  // Close dialogs
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleCloseDeleteDialog = useCallback(() => {
    setConfirmDelete(false);
    setRoleToDelete(null);
  }, []);

  // Handle form input changes
  const handleInputChange = useCallback(e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Handle active toggle
  const handleActiveToggle = useCallback(e => {
    setFormData(prev => ({
      ...prev,
      active: e.target.checked,
    }));
  }, []);

  // Submit form
  const handleSubmit = useCallback(async () => {
    // Basic validation
    if (!formData.name) {
      setError('Role name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (editMode && currentRole) {
        await RoleService.updateRole(currentRole.id, formData);
      } else {
        await RoleService.createRole(formData);
      }

      // Refresh roles list
      fetchRoles();
      handleClose();
    } catch (err) {
      setError('Error saving role: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [formData, editMode, currentRole, fetchRoles, handleClose]);

  // Handle role deactivation
  const handleDeleteRole = useCallback(async () => {
    if (!roleToDelete) return;

    setLoading(true);
    try {
      await RoleService.deactivateRole(roleToDelete.id);
      fetchRoles();
      handleCloseDeleteDialog();
    } catch (err) {
      setError('Error deactivating role: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [roleToDelete, fetchRoles, handleCloseDeleteDialog]);

  // Stats calculation
  const activeRolesCount = roles.filter(role => role.active !== false).length;
  const inactiveRolesCount = roles.length - activeRolesCount;

  return (
    <Box sx={{ py: 3 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center">
              <SecurityIcon
                sx={{
                  fontSize: 40,
                  color: theme.palette.primary.main,
                  mr: 2,
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  color: theme.palette.text.primary,
                }}
              >
                Rolle Verwaltung
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              aria-label="Add new role"
              sx={{ borderRadius: 2 }}
            >
              Neue Rolle
            </Button>
          </Box>
        </Container>
      </motion.div>

      <Container maxWidth="xl">
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Statistics Cards */}
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    height: '100%',
                    background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.15)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Box
                        sx={{
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                          borderRadius: 1,
                          p: 1,
                          mr: 2,
                        }}
                      >
                        <BadgeIcon color="primary" />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Gesamt
                      </Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={700} my={1}>
                      {roles.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Definierte Rollen
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <motion.div variants={itemVariants}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    height: '100%',
                    background: `linear-gradient(45deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.light, 0.15)} 100%)`,
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={1}>
                      <Box
                        sx={{
                          backgroundColor: alpha(theme.palette.success.main, 0.1),
                          borderRadius: 1,
                          p: 1,
                          mr: 2,
                        }}
                      >
                        <RoleIcon color="success" />
                      </Box>
                      <Typography variant="h6" fontWeight={600}>
                        Aktiv
                      </Typography>
                    </Box>
                    <Typography variant="h3" fontWeight={700} my={1}>
                      {activeRolesCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Aktive Rollen
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <motion.div variants={itemVariants}>
                <Card
                  elevation={2}
                  sx={{
                    borderRadius: 2,
                    height: '100%',
                    background: theme.palette.background.paper,
                  }}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <SecurityIcon color="error" sx={{ mr: 1 }} />
                      <Typography variant="h6" fontWeight={600}>
                        Hinweis
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Rollen können nicht gelöscht, sondern nur deaktiviert werden, um die
                      Integrität des Systems zu bewahren.
                      <br />
                      <br />
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Roles Table Section */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
                overflow: 'hidden',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RoleIcon sx={{ mr: 1, fontSize: 20 }} />
                Rollenübersicht
              </Typography>

              <TableContainer sx={{ minHeight: '50vh' }}>
                <MuiTable>
                  <TableHead>
                    <TableRow
                      sx={{
                        backgroundColor: theme.palette.background.default,
                        '& th': {
                          fontWeight: 600,
                        },
                      }}
                    >
                      <TableCell>Name</TableCell>
                      <TableCell>Beschreibung</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Aktionen</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading && !roles?.length ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <CircularProgress size={40} sx={{ my: 3 }} />
                        </TableCell>
                      </TableRow>
                    ) : roles?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                            Keine Rollen gefunden. Erstellen Sie eine neue Rolle, um zu beginnen.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles?.map(role => (
                        <TableRow
                          key={role.id}
                          hover
                          sx={{
                            transition: 'all 0.2s',
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.04),
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <RoleIcon
                                fontSize="small"
                                sx={{
                                  mr: 1,
                                  color:
                                    role.active !== false
                                      ? theme.palette.primary.main
                                      : theme.palette.text.disabled,
                                }}
                              />
                              <Typography fontWeight={500}>{role.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{role.description || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={role.active !== false ? 'Aktiv' : 'Inaktiv'}
                              color={role.active !== false ? 'success' : 'error'}
                              size="small"
                              sx={{ fontWeight: 500 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                              <Tooltip title="Rolle bearbeiten">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenEditDialog(role)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.2),
                                    },
                                  }}
                                >
                                  <EditIcon fontSize="small" color="primary" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Rolle deaktivieren">
                                <IconButton
                                  size="small"
                                  onClick={() => handleOpenDeleteDialog(role)}
                                  sx={{
                                    backgroundColor: alpha(theme.palette.error.main, 0.1),
                                    '&:hover': {
                                      backgroundColor: alpha(theme.palette.error.main, 0.2),
                                    },
                                  }}
                                >
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </MuiTable>
              </TableContainer>

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Box sx={{ p: 1, borderRadius: 1 }}>
                      <Box
                        component="nav"
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Box
                          component="ul"
                          sx={{
                            display: 'flex',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                          }}
                        >
                          <Box
                            component="li"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Button
                              variant="text"
                              color="primary"
                              disabled={page === 0}
                              onClick={e => handlePageChange(e, page)}
                              aria-label="Vorherige Seite"
                            >
                              Zurück
                            </Button>
                          </Box>
                          {[...Array(totalPages).keys()].map(pageNum => (
                            <Box
                              component="li"
                              key={pageNum}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <Button
                                variant={pageNum === page ? 'contained' : 'text'}
                                color="primary"
                                onClick={e => handlePageChange(e, pageNum + 1)}
                                aria-label={`Seite ${pageNum + 1}`}
                                aria-current={pageNum === page ? 'page' : undefined}
                                sx={{ borderRadius: 2, minWidth: '36px' }}
                              >
                                {pageNum + 1}
                              </Button>
                            </Box>
                          ))}
                          <Box
                            component="li"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <Button
                              variant="text"
                              color="primary"
                              disabled={page === totalPages - 1}
                              onClick={e => handlePageChange(e, page + 2)}
                              aria-label="Nächste Seite"
                            >
                              Weiter
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </motion.div>
                </Box>
              )}
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      {/* Role Form Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="role-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <DialogTitle id="role-dialog-title" sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center">
            <SecurityIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="span" fontWeight={600}>
              {editMode ? 'Rolle bearbeiten' : 'Neue Rolle erstellen'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              label="Rollenname"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!formData.name && error.includes('name')}
              helperText={
                !formData.name && error.includes('name') ? 'Rollenname ist erforderlich' : ''
              }
              autoFocus
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
            <TextField
              label="Beschreibung"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
              InputProps={{
                sx: { borderRadius: 2 },
              }}
            />
            <FormControlLabel
              control={
                <Switch checked={formData.active} onChange={handleActiveToggle} color="primary" />
              }
              label="Aktiv"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit" variant="outlined" sx={{ borderRadius: 2 }}>
            Abbrechen
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            loading={loading}
            sx={{ borderRadius: 2 }}
          >
            {editMode ? 'Änderungen speichern' : 'Rolle erstellen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: theme.shadows[10],
          },
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center">
            <DeleteIcon sx={{ mr: 1, color: theme.palette.error.main }} />
            <Typography variant="h6" component="span" fontWeight={600}>
              Rolle deaktivieren
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Sind Sie sicher, dass Sie die Rolle "{roleToDelete?.name}" deaktivieren möchten?
            Benutzer mit dieser Rolle könnten den Zugriff auf bestimmte Funktionen verlieren.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleDeleteRole}
            variant="contained"
            color="error"
            disabled={loading}
            loading={loading}
            sx={{ borderRadius: 2 }}
          >
            Deaktivieren
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagementPage;
