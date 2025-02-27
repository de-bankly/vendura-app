import React from 'react';
import { Tabs as MuiTabs, Tab as MuiTab, Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Tabs component that extends MUI Tabs with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Tabs = ({
  value,
  onChange,
  tabs = [],
  variant = 'standard',
  orientation = 'horizontal',
  centered = false,
  scrollButtons = 'auto',
  indicatorColor = 'primary',
  textColor = 'primary',
  allowScrollButtonsMobile = false,
  tabsProps = {},
  tabProps = {},
  sx = {},
  ...props
}) => {
  return (
    <Box sx={{ width: '100%', ...sx }} {...props}>
      <MuiTabs
        value={value}
        onChange={onChange}
        variant={variant}
        orientation={orientation}
        centered={centered}
        scrollButtons={scrollButtons}
        indicatorColor={indicatorColor}
        textColor={textColor}
        allowScrollButtonsMobile={allowScrollButtonsMobile}
        sx={{
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            minWidth: 'auto',
            px: 3,
          },
          '& .Mui-selected': {
            fontWeight: 700,
          },
          ...tabsProps.sx,
        }}
        {...tabsProps}
      >
        {tabs.map(tab => (
          <MuiTab
            key={tab.value}
            label={tab.label}
            value={tab.value}
            icon={tab.icon}
            iconPosition={tab.iconPosition || 'start'}
            disabled={tab.disabled}
            sx={{
              ...tabProps.sx,
              ...tab.sx,
            }}
            {...tabProps}
            {...tab.props}
          />
        ))}
      </MuiTabs>
    </Box>
  );
};

Tabs.propTypes = {
  /** The value of the currently selected tab */
  value: PropTypes.any,
  /** Callback fired when the value changes */
  onChange: PropTypes.func,
  /** Array of tab objects */
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      /** The label of the tab */
      label: PropTypes.node.isRequired,
      /** The value of the tab */
      value: PropTypes.any.isRequired,
      /** The icon element */
      icon: PropTypes.node,
      /** The position of the icon */
      iconPosition: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),
      /** If true, the tab is disabled */
      disabled: PropTypes.bool,
      /** Additional props for the tab */
      props: PropTypes.object,
      /** The system prop that allows defining system overrides as well as additional CSS styles */
      sx: PropTypes.object,
    })
  ),
  /** The variant to use */
  variant: PropTypes.oneOf(['standard', 'scrollable', 'fullWidth']),
  /** The orientation of the tabs */
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  /** If true, the tabs will be centered */
  centered: PropTypes.bool,
  /** Determines the behavior of scroll buttons */
  scrollButtons: PropTypes.oneOf(['auto', 'desktop', 'on', 'off']),
  /** The color of the indicator */
  indicatorColor: PropTypes.oneOf(['primary', 'secondary']),
  /** The color of the text */
  textColor: PropTypes.oneOf(['primary', 'secondary', 'inherit']),
  /** If true, the scroll buttons will be displayed on mobile */
  allowScrollButtonsMobile: PropTypes.bool,
  /** Additional props for the MuiTabs component */
  tabsProps: PropTypes.object,
  /** Additional props for all MuiTab components */
  tabProps: PropTypes.object,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Tabs;
