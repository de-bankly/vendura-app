import React from 'react';
import { CardHeader as MuiCardHeader } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced CardHeader component that extends MUI CardHeader with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const CardHeader = ({
  title,
  subheader,
  avatar,
  action,
  titleTypographyProps = {},
  subheaderTypographyProps = {},
  sx = {},
  ...props
}) => {
  return (
    <MuiCardHeader
      title={title}
      subheader={subheader}
      avatar={avatar}
      action={action}
      titleTypographyProps={{
        variant: 'h6',
        fontWeight: 600,
        ...titleTypographyProps,
      }}
      subheaderTypographyProps={{
        variant: 'body2',
        color: 'text.secondary',
        ...subheaderTypographyProps,
      }}
      sx={{
        padding: 3,
        paddingBottom: 0,
        ...sx,
      }}
      {...props}
    />
  );
};

CardHeader.propTypes = {
  /** The title of the card */
  title: PropTypes.node,
  /** The subheader of the card */
  subheader: PropTypes.node,
  /** The avatar element to display in the card header */
  avatar: PropTypes.node,
  /** The action element to display in the card header */
  action: PropTypes.node,
  /** Props to pass to the title Typography component */
  titleTypographyProps: PropTypes.object,
  /** Props to pass to the subheader Typography component */
  subheaderTypographyProps: PropTypes.object,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default CardHeader;
