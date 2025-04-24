import { CardContent, CardActions, Divider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';
import CardHeader from './CardHeader';

/**
 * @typedef {object} CompleteCardProps
 * @property {React.ReactNode} [title] - The title to display in the card header.
 * @property {React.ReactNode} [subheader] - The subheader to display in the card header.
 * @property {React.ReactNode} [avatar] - The avatar element to display in the card header.
 * @property {React.ReactNode} [headerAction] - The action element to display in the card header.
 * @property {React.ReactNode} children - The content of the card.
 * @property {React.ReactNode} [actions] - The actions to display in the card footer.
 * @property {boolean} [headerDivider=true] - Whether to show a divider between the header and content.
 * @property {boolean} [actionsDivider=true] - Whether to show a divider between the content and actions.
 * @property {object} [headerProps={}] - Props to pass to the CardHeader component.
 * @property {object} [contentProps={}] - Props to pass to the CardContent component.
 * @property {object} [actionsProps={}] - Props to pass to the CardActions component.
 * @property {string} [headerBgColor] - Background color for the header section.
 * @property {('flex-start'|'center'|'flex-end'|'space-between'|'space-around')} [actionsAlignment='flex-end'] - Alignment of the actions in the footer.
 * @property {number} [actionsSpacing=1] - Spacing between action buttons (multiplied by theme spacing unit).
 * @property {import('@mui/material').CardProps} [cardProps] - Additional props to pass to the underlying Card component.
 */

/**
 * Complete Card component with header, content, and actions.
 * Provides a consistent layout for complex card interfaces.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 * @param {CompleteCardProps} props - The props for the component.
 * @returns {JSX.Element} The rendered CompleteCard component.
 */
const CompleteCard = ({
  title,
  subheader,
  avatar,
  headerAction,
  children,
  actions,
  headerDivider = true,
  actionsDivider = true,
  headerProps = {},
  contentProps = {},
  actionsProps = {},
  headerBgColor,
  actionsAlignment = 'flex-end',
  actionsSpacing = 1,
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

  const actionsSx = {
    justifyContent: actionsAlignment,
    gap: theme.spacing(actionsSpacing),
    ...(actionsProps.sx || {}),
  };

  return (
    <Card {...cardProps}>
      {(title || subheader || avatar || headerAction) && (
        <>
          <CardHeader
            title={title}
            subheader={subheader}
            avatar={avatar}
            action={headerAction}
            sx={headerSx}
            {...headerProps}
          />
          {headerDivider && <Divider />}
        </>
      )}
      <CardContent sx={contentSx} {...contentProps}>
        {children}
      </CardContent>
      {actions && (
        <>
          {actionsDivider && <Divider />}
          <CardActions sx={actionsSx} {...actionsProps}>
            {actions}
          </CardActions>
        </>
      )}
    </Card>
  );
};

CompleteCard.propTypes = {
  /** The title to display in the card header */
  title: PropTypes.node,
  /** The subheader to display in the card header */
  subheader: PropTypes.node,
  /** The avatar element to display in the card header */
  avatar: PropTypes.node,
  /** The action element to display in the card header */
  headerAction: PropTypes.node,
  /** The content of the card */
  children: PropTypes.node,
  /** The actions to display in the card footer */
  actions: PropTypes.node,
  /** Whether to show a divider between the header and content */
  headerDivider: PropTypes.bool,
  /** Whether to show a divider between the content and actions */
  actionsDivider: PropTypes.bool,
  /** Props to pass to the CardHeader component */
  headerProps: PropTypes.object,
  /** Props to pass to the CardContent component */
  contentProps: PropTypes.object,
  /** Props to pass to the CardActions component */
  actionsProps: PropTypes.object,
  /** Background color for the header section */
  headerBgColor: PropTypes.string,
  /** Alignment of the actions in the footer (flex-start, center, flex-end, space-between, space-around) */
  actionsAlignment: PropTypes.oneOf([
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
  ]),
  /** Spacing between action buttons */
  actionsSpacing: PropTypes.number,
};

export default CompleteCard;
