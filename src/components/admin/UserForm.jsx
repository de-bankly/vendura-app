import { Visibility, VisibilityOff, Person } from '@mui/icons-material';
import {
  Box,
  Paper,
  InputAdornment,
  Alert as MuiAlert,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';

import { Button, IconButton } from '../ui/buttons';
import { Chip } from '../ui/feedback';
import { Form, FormField, FormSection } from '../ui/forms';
import { Select, TextField } from '../ui/inputs';

/**
 * @typedef {object} Role
 * @property {string|number} id - The unique identifier for the role.
 * @property {string} name - The display name of the role.
 */

/**
 * @typedef {object} UserFormData
 * @property {string} username - The user's unique username.
 * @property {string} [firstName] - The user's first name.
 * @property {string} [lastName] - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} [password] - The user's password (only required/used on create or change).
 * @property {boolean} [active] - Whether the user account is active. Defaults to false if undefined.
 * @property {boolean} [locked] - Whether the user account is locked. Defaults to false if undefined.
 * @property {Array<string|number>} [roles] - Array of role IDs assigned to the user. Defaults to empty array if undefined.
 */

/**
 * A form component for creating or editing user details.
 * Provides fields for username, name, email, password, status, lock status, and roles.
 * Includes validation hints and accessibility features.
 *
 * @param {object} props - The component props.
 * @param {UserFormData} props.formData - The current state of the form data.
 * @param {function(UserFormData): void} props.onChange - Callback function triggered when any form field changes.
 * @param {function(React.FormEvent<HTMLFormElement>): void} props.onSubmit - Callback function triggered when the form is submitted.
 * @param {Array<Role>} [props.roles=[]] - An array of available roles to select from.
 * @param {boolean} [props.editMode=false] - If true, the form is in edit mode (e.g., disables username, changes labels).
 * @param {string} [props.error=''] - An error message to display at the top of the form.
 * @param {boolean} [props.loading=false] - If true, indicates the form is submitting and disables the submit button.
 * @param {function(): void} props.onCancel - Callback function triggered when the cancel button is clicked.
 * @returns {JSX.Element} The rendered UserForm component.
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
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();

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

  const handleSwitchChange = useCallback(
    e => {
      const { name, checked } = e.target;
      onChange({
        ...formData,
        [name]: checked,
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
              value={formData.username || ''}
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
                  value={formData.firstName || ''}
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
                  value={formData.lastName || ''}
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
              value={formData.email || ''}
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
              value={formData.password || ''}
              onChange={handleInputChange}
              fullWidth
              inputProps={{
                'aria-required': !editMode ? 'true' : 'false',
                autoComplete: editMode ? 'new-password' : 'current-password',
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

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormField
                label="Account Status"
                helperText="Whether the user's account is active or not"
              >
                <FormControlLabel
                  control={
                    <Switch
                      name="active"
                      checked={!!formData.active}
                      onChange={handleSwitchChange}
                      color="success"
                    />
                  }
                  label={formData.active ? 'Active' : 'Inactive'}
                />
              </FormField>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormField
                label="Account Lock"
                helperText="Whether the user's account is locked or not"
              >
                <FormControlLabel
                  control={
                    <Switch
                      name="locked"
                      checked={!!formData.locked}
                      onChange={handleSwitchChange}
                      color="error"
                    />
                  }
                  label={formData.locked ? 'Locked' : 'Unlocked'}
                />
              </FormField>
            </Grid>
          </Grid>

          <FormField
            label="Roles"
            helperText={
              editMode
                ? 'Existing roles are preserved if no changes are made'
                : 'Assign one or more roles to the user'
            }
          >
            <Select
              name="roles"
              multiple
              value={formData.roles || []}
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
    password: PropTypes.string, // Not required in edit mode unless changing
    active: PropTypes.bool,
    locked: PropTypes.bool,
    roles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])), // Allow string or number IDs
  }).isRequired,
  /** Function called when form data changes */
  onChange: PropTypes.func.isRequired,
  /** Function called when form is submitted */
  onSubmit: PropTypes.func.isRequired,
  /** Available roles for selection */
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
    })
  ),
  /** Whether the form is in edit mode */
  editMode: PropTypes.bool,
  /** Error message to display */
  error: PropTypes.string,
  /** Whether the form is currently loading/submitting */
  loading: PropTypes.bool,
  /** Function called when form is cancelled */
  onCancel: PropTypes.func.isRequired,
};

export default UserForm;
