import { Avatar, Box, Typography, MenuItem, alpha, useTheme, Chip } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * @typedef {object} User
 * @property {string} [firstName] - The user's first name.
 * @property {string} [lastName] - The user's last name.
 * @property {string} [displayName] - The user's display name (used if first/last name are not available).
 * @property {string} [email] - The user's email address.
 * @property {Array<string|number>} [roles] - An array representing the user's roles.
 */

/**
 * ProfileCard component displays user's profile information in a card format,
 * styled consistently with dashboard, sales, inventory, and deposit screens.
 * @param {object} props - The component props.
 * @param {User} props.user - User object containing profile information.
 * @returns {React.ReactElement} The rendered ProfileCard component.
 */
const ProfileCard = ({ user }) => {
  const theme = useTheme();
  const userRole = user?.roles?.[0] ? 'Admin' : 'Mitarbeiter';

  return (
    <MenuItem
      sx={{
        py: 2,
        px: 2.5,
        backgroundColor: alpha(theme.palette.primary.main, 0.03),
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
        },
        borderRadius: theme.shape.borderRadius,
        mb: 0.5,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            width: 40,
            height: 40,
            boxShadow: `0 0 0 2px ${alpha(theme.palette.background.paper, 0.8)}`,
          }}
        >
          {user?.firstName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
        </Avatar>

        <Box sx={{ ml: 2, flex: 1, overflow: 'hidden' }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.displayName || 'User'}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '70%',
                mr: 1,
              }}
            >
              {user?.email || 'user@example.com'}
            </Typography>

            <Chip
              label={userRole}
              size="small"
              variant="outlined"
              color="primary"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 500,
                borderRadius: '4px',
              }}
            />
          </Box>
        </Box>
      </Box>
    </MenuItem>
  );
};

ProfileCard.propTypes = {
  /**
   * User object containing profile information.
   * See the User typedef for details on the expected shape.
   */
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
    roles: PropTypes.array,
  }),
};

export default ProfileCard;
