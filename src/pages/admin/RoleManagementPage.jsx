import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Pagination,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { RoleService } from '../../services';

/**
 * Role management page for administrators
 */
const RoleManagementPage = () => {
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

  // Load roles
  useEffect(() => {
    fetchRoles();
  }, [page]);

  // Fetch roles with pagination
  const fetchRoles = async () => {
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
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  // Open dialog for new role
  const handleOpenAddDialog = () => {
    setEditMode(false);
    setCurrentRole(null);
    setFormData({
      name: '',
      description: '',
      active: true,
    });
    setOpen(true);
  };

  // Open dialog for editing role
  const handleOpenEditDialog = role => {
    setEditMode(true);
    setCurrentRole(role);
    setFormData({
      name: role.name || '',
      description: role.description || '',
      active: role.active !== false,
    });
    setOpen(true);
  };

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = role => {
    setRoleToDelete(role);
    setConfirmDelete(true);
  };

  // Close dialogs
  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseDeleteDialog = () => {
    setConfirmDelete(false);
    setRoleToDelete(null);
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle active toggle
  const handleActiveToggle = e => {
    setFormData({
      ...formData,
      active: e.target.checked,
    });
  };

  // Submit form
  const handleSubmit = async () => {
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
  };

  // Handle role deactivation
  const handleDeleteRole = async () => {
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
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Role Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add Role
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && !roles.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <CircularProgress size={40} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                roles.map(role => (
                  <TableRow key={role.id}>
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
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        )}
      </Paper>

      {/* Add/Edit Role Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Role Name"
            type="text"
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <FormControlLabel
            control={
              <Switch
                checked={formData.active}
                onChange={handleActiveToggle}
                name="active"
                color="primary"
              />
            }
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Deactivate Role</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to deactivate the role <strong>{roleToDelete?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This may affect users who have this role assigned.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteRole} variant="contained" color="error" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RoleManagementPage;
