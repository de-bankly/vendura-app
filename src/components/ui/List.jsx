import React from 'react';
import { List as MuiList } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced List component that extends MUI List with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const List = ({
  children,
  dense = false,
  disablePadding = false,
  subheader,
  sx = {},
  ...props
}) => {
  return (
    <MuiList
      dense={dense}
      disablePadding={disablePadding}
      subheader={subheader}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiList>
  );
};

List.propTypes = {
  /** The content of the list */
  children: PropTypes.node,
  /** If true, compact vertical padding designed for keyboard and mouse input is used */
  dense: PropTypes.bool,
  /** If true, vertical padding is removed from the list */
  disablePadding: PropTypes.bool,
  /** The content of the subheader, normally ListSubheader */
  subheader: PropTypes.node,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default List;
