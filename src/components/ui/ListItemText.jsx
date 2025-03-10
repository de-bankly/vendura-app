import React from 'react';
import { ListItemText as MuiListItemText } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced ListItemText component that extends MUI ListItemText with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const ListItemText = ({
  primary,
  secondary,
  primaryTypographyProps = {},
  secondaryTypographyProps = {},
  inset = false,
  sx = {},
  ...props
}) => {
  return (
    <MuiListItemText
      primary={primary}
      secondary={secondary}
      primaryTypographyProps={{
        variant: 'body1',
        fontWeight: 500,
        ...primaryTypographyProps,
      }}
      secondaryTypographyProps={{
        variant: 'body2',
        color: 'text.secondary',
        ...secondaryTypographyProps,
      }}
      inset={inset}
      sx={{
        ...sx,
      }}
      {...props}
    />
  );
};

ListItemText.propTypes = {
  /** The main text */
  primary: PropTypes.node,
  /** The secondary text */
  secondary: PropTypes.node,
  /** Props applied to the primary typography element */
  primaryTypographyProps: PropTypes.object,
  /** Props applied to the secondary typography element */
  secondaryTypographyProps: PropTypes.object,
  /** If true, the children are indented */
  inset: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default ListItemText;
