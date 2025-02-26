import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography, Box } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PropTypes from 'prop-types';

/**
 * Enhanced Breadcrumbs component that extends MUI Breadcrumbs with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Breadcrumbs = ({
  items = [],
  separator = <NavigateNextIcon fontSize="small" />,
  maxItems = 8,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  sx = {},
  ...props
}) => {
  return (
    <Box sx={{ mb: 2, ...sx }}>
      <MuiBreadcrumbs
        separator={separator}
        maxItems={maxItems}
        itemsBeforeCollapse={itemsBeforeCollapse}
        itemsAfterCollapse={itemsAfterCollapse}
        aria-label="breadcrumb"
        sx={{
          '& .MuiBreadcrumbs-ol': {
            alignItems: 'center',
          },
          '& .MuiBreadcrumbs-li': {
            display: 'flex',
            alignItems: 'center',
          },
        }}
        {...props}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          // For the last item, render a Typography component
          if (isLast) {
            return (
              <Typography
                key={index}
                color="text.primary"
                variant="body2"
                fontWeight={600}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                {item.icon && (
                  <Box component="span" sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </Box>
                )}
                {item.label}
              </Typography>
            );
          }

          // For other items, render a Link component
          return (
            <Link
              key={index}
              color="inherit"
              variant="body2"
              underline="hover"
              sx={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
              onClick={item.onClick}
              href={item.href}
            >
              {item.icon && (
                <Box component="span" sx={{ mr: 0.5, display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                </Box>
              )}
              {item.label}
            </Link>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

Breadcrumbs.propTypes = {
  /** Array of breadcrumb items */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      /** The label of the breadcrumb item */
      label: PropTypes.node.isRequired,
      /** The URL of the breadcrumb item */
      href: PropTypes.string,
      /** Callback fired when the breadcrumb item is clicked */
      onClick: PropTypes.func,
      /** The icon of the breadcrumb item */
      icon: PropTypes.node,
    })
  ),
  /** The separator between breadcrumb items */
  separator: PropTypes.node,
  /** The maximum number of breadcrumbs to display */
  maxItems: PropTypes.number,
  /** The number of items to show before the ellipsis */
  itemsBeforeCollapse: PropTypes.number,
  /** The number of items to show after the ellipsis */
  itemsAfterCollapse: PropTypes.number,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Breadcrumbs;
