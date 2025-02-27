import React from 'react';
import { CardContent, CardActions, Divider } from '@mui/material';
import PropTypes from 'prop-types';
import Card from './Card';

/**
 * Card component with actions in the footer.
 * Provides a consistent layout for cards with action buttons.
 */
const CardWithActions = ({
  children,
  actions,
  divider = true,
  contentProps = {},
  actionsProps = {},
  ...cardProps
}) => {
  return (
    <Card {...cardProps}>
      <CardContent {...contentProps}>{children}</CardContent>
      {divider && <Divider />}
      <CardActions sx={{ padding: 2 }} {...actionsProps}>
        {actions}
      </CardActions>
    </Card>
  );
};

CardWithActions.propTypes = {
  /** The content of the card */
  children: PropTypes.node,
  /** The actions to display in the card footer */
  actions: PropTypes.node,
  /** Whether to show a divider between the content and actions */
  divider: PropTypes.bool,
  /** Props to pass to the CardContent component */
  contentProps: PropTypes.object,
  /** Props to pass to the CardActions component */
  actionsProps: PropTypes.object,
};

export default CardWithActions;
