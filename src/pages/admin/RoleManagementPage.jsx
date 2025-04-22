import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  VpnKey as RoleIcon,
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
              <RoleIcon
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
                Role Management
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              aria-label="Add new role"
            >
              Add Role
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
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          </motion.div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Roles Table Section */}
          <motion.div variants={itemVariants}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                minHeight: '60vh',
                borderRadius: 2,
                bgcolor: theme.palette.background.paper,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: theme.palette.text.primary,
                }}
              >
                Role Overview
              </Typography>

              <TableContainer>
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
                      <TableCell>Role Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
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
                            No roles found. Create a new one to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles?.map(role => (
                        <TableRow key={role.id} hover>
                          <TableCell>{role.name}</TableCell>
                          <TableCell>{role.description || '-'}</TableCell>
                          <TableCell>
                            <Chip
                              label={role.active !== false ? 'Active' : 'Inactive'}
                              color={role.active !== false ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Edit Role">
                                <IconButton size="small" onClick={() => handleOpenEditDialog(role)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Deactivate Role">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleOpenDeleteDialog(role)}
                                >
                                  <DeleteIcon fontSize="small" />
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
                              aria-label="Previous page"
                            >
                              Previous
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
                                aria-label={`Page ${pageNum + 1}`}
                                aria-current={pageNum === page ? 'page' : undefined}
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
                              aria-label="Next page"
                            >
                              Next
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
      >
        <DialogTitle id="role-dialog-title">
          <Box display="flex" alignItems="center">
            <RoleIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="span">
              {editMode ? 'Edit Role' : 'Add New Role'}
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Role Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              required
              error={!formData.name && error.includes('name')}
              helperText={!formData.name && error.includes('name') ? 'Role name is required' : ''}
              autoFocus
            />
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
            />
            <FormControlLabel
              control={
                <Switch checked={formData.active} onChange={handleActiveToggle} color="primary" />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={loading}
            loading={loading}
          >
            {editMode ? 'Save Changes' : 'Create Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          <Box display="flex" alignItems="center">
            <DeleteIcon sx={{ mr: 1, color: theme.palette.error.main }} />
            <Typography variant="h6" component="span">
              Deactivate Role
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate the role "{roleToDelete?.name}"? Users with this
            role may lose access to certain features.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDeleteDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteRole}
            variant="contained"
            color="error"
            disabled={loading}
            loading={loading}
          >
            Deactivate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoleManagementPage;
