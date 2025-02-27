import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';

/**
 * FormSection component that provides a way to group related form fields
 * with an optional title and description.
 */
const FormSection = ({
  children,
  title,
  description,
  divider = true,
  spacing = 2,
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        width: '100%',
        mb: 4,
        ...sx,
      }}
      {...props}
    >
      {title && (
        <Typography
          variant="h6"
          component="h2"
          color="text.primary"
          sx={{ mb: description ? 1 : 2 }}
        >
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
      )}

      {divider && <Divider sx={{ mb: 3 }} />}

      <Box
        sx={{
          '& > *:not(:last-child)': {
            marginBottom: spacing,
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

FormSection.propTypes = {
  /** The form fields */
  children: PropTypes.node,
  /** The title of the section */
  title: PropTypes.node,
  /** The description of the section */
  description: PropTypes.node,
  /** Whether to show a divider below the title and description */
  divider: PropTypes.bool,
  /** The spacing between form fields in theme spacing units */
  spacing: PropTypes.number,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default FormSection;
