import { Add as AddIcon, Edit as EditIcon, Person as PersonIcon } from '@mui/icons-material';
import {
  Container,
  Typography,
  Box,
  Tooltip,
  Dialog,
  DialogTitle,
  Alert as MuiAlert,
  Paper,
  Grid,
  useTheme,
  TableContainer,
  Table as MuiTable,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  CircularProgress,
} from '@mui/material';
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

import UserForm from '../../components/admin/UserForm';
import { Button, IconButton } from '../../components/ui/buttons';
import { Chip } from '../../components/ui/feedback';
import { UserService, RoleService } from '../../services';

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
 * User management page for administrators
 */
const UserManagementPage = () => {
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
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
    locked: false,
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
      sortable: false,
      renderCell: row => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {row.roles?.map((role, index) => {
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
      field: 'locked',
      headerName: 'Lock Status',
      sortable: true,
      renderCell: row => (
        <Chip
          label={row.locked ? 'Locked' : 'Unlocked'}
          color={row.locked ? 'error' : 'success'}
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
      const response = await UserService.getAllUsers(page, rowsPerPage);
      setUsers(response.content || []);
      setTotalPages(response.totalPages || 0);
      setTotalElements(response.totalElements || 0);
    } catch (err) {
      setError('Failed to load users: ' + (err.response?.data?.message || err.message));
      setUsers([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

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

  // Handle page change for MUI TablePagination
  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
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
      locked: false,
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
      locked: user.locked === true,
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
    [formData, editMode, currentUser, originalRoles, fetchUsers, handleClose]
  );

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
              <PersonIcon
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
                User Management
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenAddDialog}
              aria-label="Add new user"
            >
              Add User
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
            <MuiAlert severity="error" sx={{ mb: 3 }}>
              {error}
            </MuiAlert>
          </motion.div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="visible">
          {/* Users Table Section */}
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
                User Overview
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <MuiTable stickyHeader aria-label="user overview table">
                  <TableHead
                    sx={{
                      '& .MuiTableCell-head': {
                        backgroundColor: theme.palette.background.default,
                        fontWeight: 'bold',
                      },
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <TableRow>
                      {columns.map(column => (
                        <TableCell
                          key={column.field}
                          sx={{ py: 1.5 }}
                          align={column.field === 'actions' ? 'right' : 'left'}
                        >
                          {column.headerName}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center" sx={{ py: 5 }}>
                          <CircularProgress />
                        </TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                          <Typography color="error">{error}</Typography>
                        </TableCell>
                      </TableRow>
                    ) : users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            No users found. Create a new one to get started.
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user, index) => (
                        <TableRow
                          key={user.id || index}
                          hover
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            '&:nth-of-type(odd)': {
                              backgroundColor: theme.palette.action.hover,
                            },
                          }}
                        >
                          {columns.map(column => (
                            <TableCell
                              key={`${user.id}-${column.field}`}
                              sx={{ py: 1.5 }}
                              align={column.field === 'actions' ? 'right' : 'left'}
                            >
                              {column.renderCell
                                ? column.renderCell(user)
                                : column.field === 'name'
                                  ? `${user.firstName || ''} ${user.lastName || ''}`
                                  : (user[column.field] ?? '-')}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </MuiTable>
              </TableContainer>

              {/* Pagination */}
              {!loading && totalElements > 0 && (
                <TablePagination
                  component="div"
                  count={totalElements}
                  page={page}
                  onPageChange={handlePageChange}
                  rowsPerPage={rowsPerPage}
                  rowsPerPageOptions={[rowsPerPage]}
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    mt: 'auto',
                  }}
                />
              )}
            </Paper>
          </motion.div>
        </motion.div>
      </Container>

      {/* User Form Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="user-dialog-title"
      >
        <DialogTitle id="user-dialog-title">
          <Box display="flex" alignItems="center">
            <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="span">
              {editMode ? 'Edit User' : 'Add New User'}
            </Typography>
          </Box>
        </DialogTitle>
        <Box p={3}>
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
        </Box>
      </Dialog>
    </Box>
  );
};

export default UserManagementPage;
