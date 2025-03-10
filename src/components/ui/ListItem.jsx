import React from 'react';
import { ListItem as MuiListItem } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced ListItem component that extends MUI ListItem with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const ListItem = ({
  children,
  alignItems = 'center',
  button = false,
  dense = false,
  disableGutters = false,
  disablePadding = false,
  divider = false,
  selected = false,
  sx = {},
  ...props
}) => {
  return (
    <MuiListItem
      alignItems={alignItems}
      button={button}
      dense={dense}
      disableGutters={disableGutters}
      disablePadding={disablePadding}
      divider={divider}
      selected={selected}
      sx={{
        transition: 'background-color 0.2s ease-in-out',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: 'action.hover',
        },
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiListItem>
  );
};

ListItem.propTypes = {
  /** The content of the list item */
  children: PropTypes.node,
  /** Defines the align-items style property */
  alignItems: PropTypes.oneOf(['flex-start', 'center']),
  /** If true, the list item will be a button */
  button: PropTypes.bool,
  /** If true, compact vertical padding designed for keyboard and mouse input is used */
  dense: PropTypes.bool,
  /** If true, the left and right padding is removed */
  disableGutters: PropTypes.bool,
  /** If true, all padding is removed */
  disablePadding: PropTypes.bool,
  /** If true, a 1px light border is added to the bottom of the list item */
  divider: PropTypes.bool,
  /** If true, the list item is highlighted */
  selected: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default ListItem;
