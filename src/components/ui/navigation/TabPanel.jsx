import React from 'react';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * TabPanel component to display content for each tab.
 * Provides a consistent container for tab content.
 */
const TabPanel = ({
  children,
  value,
  index,
  padding = 3,
  keepMounted = false,
  sx = {},
  ...props
}) => {
  const isSelected = value === index;

  // If not selected and not keeping mounted, don't render
  if (!isSelected && !keepMounted) {
    return null;
  }

  return (
    <Box
      role="tabpanel"
      hidden={!isSelected}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{
        p: padding,
        ...sx,
      }}
      {...props}
    >
      {/* Only render children if selected or keepMounted is true */}
      {(isSelected || keepMounted) && children}
    </Box>
  );
};

TabPanel.propTypes = {
  /** The content of the tab panel */
  children: PropTypes.node,
  /** The value of the currently selected tab */
  value: PropTypes.any.isRequired,
  /** The index of this tab panel */
  index: PropTypes.any.isRequired,
  /** The padding of the tab panel in theme spacing units */
  padding: PropTypes.number,
  /** If true, the tab panel will remain mounted even when not selected */
  keepMounted: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default TabPanel;
