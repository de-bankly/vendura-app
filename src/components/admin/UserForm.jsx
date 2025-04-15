import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  Box,
  CircularProgress,
  Paper,
  Typography,
  InputAdornment,
  Alert as MuiAlert,
  Grid,
} from '@mui/material';
import { Visibility, VisibilityOff, Person } from '@mui/icons-material';
import { Select, TextField } from '../ui/inputs';
import { Form, FormField, FormSection } from '../ui/forms';
import { Button, IconButton } from '../ui/buttons';
import { Chip } from '../ui/feedback';
import { useTheme } from '@mui/material/styles';

/**
 * UserForm component for creating and editing users
 * Enhanced with better accessibility and visual design
 */
const UserForm = ({
  formData,
  onChange,
  onSubmit,
  roles = [],
  editMode = false,
  error = '',
  loading = false,
  onCancel,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const theme = useTheme();

  // Memoize handlers
  const handleInputChange = useCallback(
    e => {
      const { name, value } = e.target;
      onChange({
        ...formData,
        [name]: value,
      });
    },
    [formData, onChange]
  );

  const handleRoleChange = useCallback(
    e => {
      onChange({
        ...formData,
        roles: e.target.value,
      });
    },
    [formData, onChange]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  return (
    <Form onSubmit={onSubmit} aria-label={editMode ? 'Edit User Form' : 'Add User Form'}>
      {error && (
        <MuiAlert severity="error" sx={{ mb: 3 }}>
          {error}
        </MuiAlert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: theme.shape.borderRadius,
          border: theme => `1px solid ${theme.palette.divider}`,
          mb: 3,
        }}
      >
        <FormSection
          title="User Information"
          description="Basic user account information"
          icon={<Person color="primary" />}
        >
          <FormField
            label="Username"
            required
            helperText={
              editMode ? 'Username cannot be changed after creation' : 'Choose a unique username'
            }
          >
            <TextField
              name="username"
              type="text"
              value={formData.username}
              onChange={handleInputChange}
              disabled={editMode}
              autoFocus={!editMode}
              fullWidth
              inputProps={{
                'aria-required': 'true',
              }}
            />
          </FormField>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormField label="First Name" helperText="User's first name">
                <TextField
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  fullWidth
                />
              </FormField>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField label="Last Name" helperText="User's last name">
                <TextField
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  fullWidth
                />
              </FormField>
            </Grid>
          </Grid>

          <FormField label="Email Address" required helperText="A valid email address for the user">
            <TextField
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                'aria-required': 'true',
              }}
            />
          </FormField>

          <FormField
            label={editMode ? 'Password (leave empty to keep unchanged)' : 'Password'}
            required={!editMode}
            helperText={
              editMode
                ? 'Only fill this if you want to change the password'
                : 'Create a secure password'
            }
          >
            <TextField
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                'aria-required': !editMode ? 'true' : 'false',
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={togglePasswordVisibility}
                      edge="end"
                      size="large"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormField>

          <FormField
            label="Roles"
            helperText={
              editMode
                ? 'Bestehende Rollen bleiben erhalten, wenn keine Änderungen vorgenommen werden'
                : 'Assign one or more roles to the user'
            }
          >
            <Select
              name="roles"
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
              fullWidth
            />
          </FormField>
        </FormSection>
      </Paper>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: theme.spacing(2),
          justifyContent: 'flex-end',
          mt: theme.spacing(3),
        }}
      >
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          loading={loading}
          aria-label={editMode ? 'Save Changes' : 'Create User'}
        >
          {editMode ? 'Save Changes' : 'Create User'}
        </Button>
      </Box>
    </Form>
  );
};

UserForm.propTypes = {
  /** Form data object containing user information */
  formData: PropTypes.shape({
    username: PropTypes.string.isRequired,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string.isRequired,
    password: PropTypes.string,
    active: PropTypes.bool,
    roles: PropTypes.array,
  }).isRequired,
  /** Function called when form data changes */
  onChange: PropTypes.func.isRequired,
  /** Function called when form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Available roles for selection */
  roles: PropTypes.array,
  /** Whether the form is in edit mode */
  editMode: PropTypes.bool,
  /** Error message to display */
  error: PropTypes.string,
  /** Whether the form is in a loading state */
  loading: PropTypes.bool,
  /** Function called when cancel button is clicked */
  onCancel: PropTypes.func.isRequired,
};

export default UserForm;
