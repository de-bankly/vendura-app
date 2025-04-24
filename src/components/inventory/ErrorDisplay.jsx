import { WarningAmber as WarningIcon } from '@mui/icons-material';
import { Paper, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Displays an error message with an icon in a styled Paper component.
 * Returns null if no message is provided.
 *
 * @param {object} props - The component props.
 * @param {string} [props.message] - The error message to display. If empty or null, the component renders nothing.
 * @returns {React.ReactElement|null} The rendered error display component or null.
 */
const ErrorDisplay = ({ message }) => {
  if (!message) {
    return null;
  }

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
  /**
   * The error message string to be displayed.
   */
  message: PropTypes.string,
};

export default ErrorDisplay;
