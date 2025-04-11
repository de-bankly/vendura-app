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
  FormControl,
  InputLabel,
  MenuItem,
  Chip,
  Box,
  Pagination,
  Alert,
  IconButton,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import { UserService, RoleService } from '../../services';
import { Select } from '../../components/ui/inputs';

/**
 * User management page for administrators
 */
const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    active: true,
    roles: [],
  });

  // Load users and roles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [page]);

  // Fetch users with pagination
  const fetchUsers = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await UserService.getAllUsers(page, 10);
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      setError('Failed to load users: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch available roles
  const fetchRoles = async () => {
    try {
      const response = await RoleService.getAllRoles(0, 100);
      setRoles(response.content || []);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value - 1);
  };

  // Open dialog for new user
  const handleOpenAddDialog = () => {
    setEditMode(false);
    setCurrentUser(null);
    setFormData({
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      active: true,
      roles: [],
    });
    setOpen(true);
  };

  // Open dialog for editing user
  const handleOpenEditDialog = user => {
    setEditMode(true);
    setCurrentUser(user);
    setFormData({
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Don't pre-fill password
      active: user.active !== false,
      roles: user.roles?.map(role => role.id) || [],
    });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle role selection
  const handleRoleChange = e => {
    setFormData({
      ...formData,
      roles: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.username || (formData.password === '' && !editMode)) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Format data for API
      const userData = {
        ...formData,
        roles: formData.roles.map(roleId => {
          const role = roles.find(r => r.id === roleId);
          return { id: roleId, name: role?.name };
        }),
      };

      if (editMode && currentUser) {
        // Remove password if empty (not changing password)
        if (!userData.password) {
          delete userData.password;
        }
        await UserService.updateUser(currentUser.id, userData);
      } else {
        await UserService.createUser(userData);
      }

      // Refresh users list
      fetchUsers();
      handleClose();
    } catch (err) {
      setError('Error saving user: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenAddDialog}
        >
          Add User
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
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Roles</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && !users.length ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <CircularProgress size={40} sx={{ my: 3 }} />
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.roles?.map(role => (
                        <Chip
                          key={role.id}
                          label={role.name}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.active !== false ? 'Active' : 'Inactive'}
                        color={user.active !== false ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Edit User">
                        <IconButton size="small" onClick={() => handleOpenEditDialog(user)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
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

      {/* Add/Edit User Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            autoFocus
            margin="dense"
            name="username"
            label="Username"
            type="text"
            fullWidth
            value={formData.username}
            onChange={handleInputChange}
            disabled={editMode} // Don't allow changing username in edit mode
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              margin="dense"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              value={formData.firstName}
              onChange={handleInputChange}
            />

            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </Box>

          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            margin="dense"
            name="password"
            label={editMode ? 'Password (leave empty to keep unchanged)' : 'Password'}
            type="password"
            fullWidth
            value={formData.password}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <Select
              label="Roles"
              multiple
              value={formData.roles}
              onChange={handleRoleChange}
              options={roles.map(role => ({
                value: role.id,
                label: role.name,
              }))}
              renderTags={selected => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map(value => {
                    const role = roles.find(r => r.id === value);
                    return <Chip key={value} label={role?.name || value} size="small" />;
                  })}
                </Box>
              )}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserManagementPage;
