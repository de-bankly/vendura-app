import React from 'react';
import PropTypes from 'prop-types';
import { Avatar, Box, Typography, MenuItem, alpha, useTheme } from '@mui/material';

/**
 * ProfileCard component displays user's profile information in a card format
 */
const ProfileCard = ({ user }) => {
  const theme = useTheme();

  return (
    <MenuItem sx={{ py: 1 }}>
      <Avatar sx={{ mr: 2, width: 30, height: 30 }}>
        {user?.firstName?.charAt(0) || user?.displayName?.charAt(0) || 'U'}
      </Avatar>
      <Box>
        <Typography variant="body2" fontWeight={600}>
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
