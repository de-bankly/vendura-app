import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Divider } from '@mui/material';

/**
 * FormSection component that provides a way to group related form fields
 * with an optional title, description, and icon.
 */
const FormSection = ({
  children,
  title,
  description,
  icon = null,
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: description ? 1 : 2 }}>
          {icon && (
            <Box
              sx={{
                mr: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {icon}
            </Box>
          )}
          <Typography variant="h6" component="h2" color="text.primary">
            {title}
          </Typography>
        </Box>
      )}

      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, ml: icon ? 5 : 0 }}>
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
  /** Optional icon to display next to the title */
  icon: PropTypes.node,
  /** Whether to show a divider below the title and description */
  divider: PropTypes.bool,
  /** The spacing between form fields in theme spacing units */
  spacing: PropTypes.number,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default FormSection;
