import { CardContent, Divider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';
import CardHeader from './CardHeader';

/**
 * @typedef {object} CardWithHeaderProps
 * @property {React.ReactNode} [title] - The title to display in the card header.
 * @property {React.ReactNode} [subheader] - The subheader to display in the card header.
 * @property {React.ReactNode} [avatar] - The avatar element to display in the card header.
 * @property {React.ReactNode} [action] - The action element to display in the card header.
 * @property {React.ReactNode} children - The content of the card.
 * @property {boolean} [divider=true] - Whether to show a divider between the header and content.
 * @property {object} [headerProps={}] - Props to pass to the CardHeader component.
 * @property {object} [contentProps={}] - Props to pass to the CardContent component.
 * @property {string} [headerBgColor] - Background color for the header section.
 * @property {object} [cardProps] - Additional props to pass to the underlying Card component.
 */

/**
 * Card component with a header section.
 * Provides a consistent layout for cards with titles and optional actions.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 *
 * @param {CardWithHeaderProps} props - The props for the component.
 * @returns {React.ReactElement} The rendered CardWithHeader component.
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
