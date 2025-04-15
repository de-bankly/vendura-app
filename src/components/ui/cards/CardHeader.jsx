import React from 'react';
import { CardHeader as MuiCardHeader, styled, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

// Define styled component
const StyledMuiCardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: theme.spacing(2, 3, 0, 3),
  '.MuiCardHeader-title': {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  '.MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

/**
 * Enhanced CardHeader component using styled API.
 */
const CardHeader = React.forwardRef(
  (
    {
      title,
      subheader,
      avatar,
      action,
      titleTypographyProps = {},
      subheaderTypographyProps = {},
      sx = {},
      ...props
    },
    ref
  ) => {
    const finalTitleTypographyProps = {
      ...titleTypographyProps,
    };
    const finalSubheaderTypographyProps = {
      ...subheaderTypographyProps,
    };

    return (
      <StyledMuiCardHeader
        ref={ref}
        title={title}
        subheader={subheader}
        avatar={avatar}
        action={action}
        titleTypographyProps={finalTitleTypographyProps}
        subheaderTypographyProps={finalSubheaderTypographyProps}
        sx={sx}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

CardHeader.propTypes = {
  title: PropTypes.node,
  subheader: PropTypes.node,
  avatar: PropTypes.node,
  action: PropTypes.node,
  titleTypographyProps: PropTypes.object,
  subheaderTypographyProps: PropTypes.object,
  sx: PropTypes.object,
};

export default CardHeader;
