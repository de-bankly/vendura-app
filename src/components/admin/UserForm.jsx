import React from 'react';
import PropTypes from 'prop-types';
import {
  TextField,
  FormControl,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import { Visibility, VisibilityOff, Person } from '@mui/icons-material';
import { Select } from '../ui/inputs';
import { Form, FormField, FormRow, FormActions, FormSection } from '../ui/forms';

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

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  // Handle role selection
  const handleRoleChange = e => {
    onChange({
      ...formData,
      roles: e.target.value,
    });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form onSubmit={onSubmit} aria-label={editMode ? 'Edit User Form' : 'Add User Form'}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
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

          <FormRow>
            <FormField label="First Name" helperText="User's first name">
              <TextField
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                fullWidth
              />
            </FormField>

            <FormField label="Last Name" helperText="User's last name">
              <TextField
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                fullWidth
              />
            </FormField>
          </FormRow>

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

      <FormActions>
        <Button onClick={onCancel} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading}
          aria-label={editMode ? 'Save Changes' : 'Create User'}
        >
          {loading ? <CircularProgress size={24} /> : editMode ? 'Save Changes' : 'Create User'}
        </Button>
      </FormActions>
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
