import { WarningAmber as WarningIcon } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * ErrorDisplay component for showing error messages
 */
const ErrorDisplay = ({ message }) => {
  if (!message) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        bgcolor: 'error.light',
        color: 'error.dark',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <WarningIcon color="error" />
      <Typography>{message}</Typography>
    </Paper>
  );
};

ErrorDisplay.propTypes = {
  message: PropTypes.string,
};

export default ErrorDisplay;
