import React from 'react';
import { CardHeader, CardContent, CardActions, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import Card from './Card';

/**
 * Complete Card component with header, content, and actions.
 * Provides a consistent layout for complex card interfaces.
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
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      {(title || subheader || avatar || headerAction) && (
        <>
          <CardHeader
            title={title}
            subheader={subheader}
            avatar={avatar}
            action={headerAction}
            {...headerProps}
          />
          {headerDivider && <Divider />}
        </>
      )}
      <CardContent {...contentProps}>{children}</CardContent>
      {actions && (
        <>
          {actionsDivider && <Divider />}
          <CardActions sx={{ padding: 2 }} {...actionsProps}>
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
};

export default CompleteCard;
