import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  Alert as MuiAlert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import { UserService, RoleService } from '../../services';
import UserForm from '../../components/admin/UserForm';
import { Button, IconButton } from '../../components/ui/buttons';
import { Chip } from '../../components/ui/feedback';
import { Table } from '../../components/ui/feedback';

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

  // Define columns for the local Table component
  const columns = [
    { field: 'username', headerName: 'Username', sortable: true },
    {
      field: 'name',
      headerName: 'Name',
      sortable: true,
      renderCell: row => `${row.firstName || ''} ${row.lastName || ''}`,
    },
    { field: 'email', headerName: 'Email', sortable: true },
    {
      field: 'roles',
      headerName: 'Roles',
      sortable: false, // Sorting complex objects is tricky client-side
      renderCell: row => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.roles?.map((role, index) => {
            const roleName = role.name || `Role ${index + 1}`; // Assume name exists
            const roleKey = role.id || roleName;
            return (
              <Chip
                key={roleKey}
                label={roleName}
                variant="outlined"
                color="primary"
                size="small"
              />
            );
          })}
          {(!row.roles || row.roles.length === 0) && (
            <Typography variant="caption" color="text.secondary">
              -
            </Typography>
          )}
        </Box>
      ),
    },
    {
      field: 'active',
      headerName: 'Status',
      sortable: true,
      renderCell: row => (
        <Chip
          label={row.active !== false ? 'Active' : 'Inactive'}
          color={row.active !== false ? 'success' : 'error'}
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      renderCell: row => (
        <Tooltip title="Edit User">
          {/* Ensure local IconButton is used */}
          <IconButton
            size="small"
            onClick={e => {
              e.stopPropagation();
              handleOpenEditDialog(row);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  // Fetch users (needs to be wrapped in useCallback)
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Pass current page state to service
      const response = await UserService.getAllUsers(page, 10);
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (err) {
      setError('Failed to load users: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Fetch available roles
  const fetchRoles = useCallback(async () => {
    try {
      const response = await RoleService.getAllRoles(0, 100);
      setRoles(response.content || []);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  }, []);

  // Load users and roles on mount and page change
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, [fetchUsers, fetchRoles]);

  // Handle page change
  const handlePageChange = useCallback((event, value) => {
    setPage(value - 1);
  }, []);

  // Open dialog for new user
  const handleOpenAddDialog = useCallback(() => {
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
  }, []);

  // Open dialog for editing user
  const handleOpenEditDialog = useCallback(user => {
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
  }, []);

  // Close dialog
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Handle form data changes
  const handleFormChange = useCallback(newFormData => {
    setFormData(newFormData);
  }, []);

  // Submit form
  const handleSubmit = useCallback(
    async e => {
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
    },
    [editMode, currentUser, formData, originalRoles, fetchUsers, handleClose]
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
        <MuiAlert severity="error" sx={{ mb: 3 }}>
          {error}
        </MuiAlert>
      )}

      <Table
        columns={columns}
        data={users}
        selectable={false}
        searchable={true}
        loading={loading}
        emptyStateMessage="No users found"
      />

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
