import { Avatar, Box, Typography, MenuItem } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * ProfileCard component displays user's profile information in a card format
 */
const ProfileCard = ({ user }) => {
  return (
    <MenuItem sx={{ py: 1 }}>
      <Avatar sx={{ mr: 2, width: 30, height: 30 }}>
        {user?.firstName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
      </Avatar>
      <Box>
        <Typography variant="subtitle2">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.displayName || 'User'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.email || 'user@example.com'}
        </Typography>
      </Box>
    </MenuItem>
  );
};

ProfileCard.propTypes = {
  /**
   * User object containing profile information
   */
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    displayName: PropTypes.string,
    email: PropTypes.string,
  }),
};

export default ProfileCard;
