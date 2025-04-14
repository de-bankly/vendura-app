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
import UserForm from '../../components/admin/UserForm';

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
  const [originalRoles, setOriginalRoles] = useState([]);

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
    setOriginalRoles([]);
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
    const userRoles = user.roles?.map(role => role.id) || [];
    setOriginalRoles(userRoles);
    setFormData({
      username: user.username || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      password: '', // Don't pre-fill password
      active: user.active !== false,
      roles: userRoles,
    });
    setOpen(true);
  };

  // Close dialog
  const handleClose = () => {
    setOpen(false);
  };

  // Handle form data changes
  const handleFormChange = newFormData => {
    setFormData(newFormData);
  };

  // Submit form
  const handleSubmit = async e => {
    if (e) {
      e.preventDefault();
    }

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
      };

      if (editMode && currentUser) {
        // Remove password if empty (not changing password)
        if (!userData.password) {
          delete userData.password;
        }

        // Only include roles if they've been modified from the original
        // This prevents accidentally removing all roles
        const rolesChanged =
          JSON.stringify(formData.roles.sort()) !== JSON.stringify(originalRoles.sort());
        if (rolesChanged) {
          userData.roles = formData.roles;
        } else {
          delete userData.roles;
        }

        await UserService.updateUser(currentUser.id, userData);
      } else {
        // For new users, always include roles even if empty
        userData.roles = formData.roles;
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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={async () => {
              try {
                setLoading(true);
                await UserService.initializeUserData();
                setError('');
                fetchUsers(); // Refresh the list
              } catch (err) {
                setError(
                  'Failed to initialize data: ' + (err.response?.data?.message || err.message)
                );
              } finally {
                setLoading(false);
              }
            }}
          >
            Initialize Data
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenAddDialog}
          >
            Add User
          </Button>
        </Box>
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
                      {user.roles?.map(role => {
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
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        );
                      })}
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

      {/* User Form Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        sx={{ '& .MuiDialog-paper': { p: 3 } }}
      >
        <DialogTitle sx={{ px: 0, pt: 0 }}>{editMode ? 'Edit User' : 'Add New User'}</DialogTitle>

        <UserForm
          formData={formData}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          roles={roles}
          editMode={editMode}
          error={error}
          loading={loading}
          onCancel={handleClose}
        />
      </Dialog>
    </Container>
  );
};

export default UserManagementPage;
