import { Box, Typography, Divider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * FormSection component that provides a way to group related form fields
 * with an optional title, description, and icon.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The form fields.
 * @param {React.ReactNode} [props.title] - The title of the section.
 * @param {React.ReactNode} [props.description] - The description of the section.
 * @param {React.ReactNode} [props.icon=null] - Optional icon to display next to the title.
 * @param {boolean} [props.divider=true] - Whether to show a divider below the title and description.
 * @param {number} [props.spacing=2] - The spacing between form fields in theme spacing units.
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles.
 * @returns {React.ReactElement} The rendered FormSection component.
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
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        mb: theme.spacing(4),
        ...sx,
      }}
      {...props}
    >
      {title && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: theme.spacing(description ? 1 : 2),
          }}
        >
          {icon && (
            <Box
              sx={{
                mr: theme.spacing(1.5),
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
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: theme.spacing(2), ml: theme.spacing(icon ? 5 : 0) }}
        >
          {description}
        </Typography>
      )}

      {divider && <Divider sx={{ mb: theme.spacing(3) }} />}

      <Box
        sx={{
          '& > *:not(:last-child)': {
            marginBottom: theme.spacing(spacing),
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
