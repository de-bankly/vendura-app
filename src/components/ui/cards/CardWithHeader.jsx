import { CardContent, Divider, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';
import CardHeader from './CardHeader';

/**
 * Card component with a header section.
 * Provides a consistent layout for cards with titles and optional actions.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 */
const CardWithHeader = ({
  title,
  subheader,
  avatar,
  action,
  children,
  divider = true,
  headerProps = {},
  contentProps = {},
  headerBgColor,
  ...cardProps
}) => {
  const theme = useTheme();

  const headerSx = {
    ...(headerBgColor && { backgroundColor: headerBgColor }),
    ...(headerProps.sx || {}),
  };

  const contentSx = {
    ...(contentProps.sx || {}),
  };

  return (
    <Card {...cardProps}>
      <CardHeader
        title={title}
        subheader={subheader}
        avatar={avatar}
        action={action}
        sx={headerSx}
        {...headerProps}
      />
      {divider && <Divider />}
      <CardContent sx={contentSx} {...contentProps}>
        {children}
      </CardContent>
    </Card>
  );
};

CardWithHeader.propTypes = {
  /** The title to display in the card header */
  title: PropTypes.node,
  /** The subheader to display in the card header */
  subheader: PropTypes.node,
  /** The avatar element to display in the card header */
  avatar: PropTypes.node,
  /** The action element to display in the card header */
  action: PropTypes.node,
  /** The content of the card */
  children: PropTypes.node,
  /** Whether to show a divider between the header and content */
  divider: PropTypes.bool,
  /** Props to pass to the CardHeader component */
  headerProps: PropTypes.object,
  /** Props to pass to the CardContent component */
  contentProps: PropTypes.object,
  /** Background color for the header section */
  headerBgColor: PropTypes.string,
};

export default CardWithHeader;
