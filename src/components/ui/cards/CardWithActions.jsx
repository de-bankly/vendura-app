import React from 'react';
import { CardContent, CardActions, Divider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Card from './Card';

/**
 * Card component with actions in the footer.
 * Provides a consistent layout for cards with action buttons.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 */
const CardWithActions = ({
  children,
  actions,
  divider = true,
  contentProps = {},
  actionsProps = {},
  actionsAlignment = 'flex-end',
  actionsSpacing = 1,
  ...cardProps
}) => {
  const theme = useTheme();

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
      <CardContent sx={contentSx} {...contentProps}>
        {children}
      </CardContent>
      {actions && (
        <>
          {divider && <Divider />}
          <CardActions sx={actionsSx} {...actionsProps}>
            {actions}
          </CardActions>
        </>
      )}
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
  /** Alignment of the actions in the footer (flex-start, center, flex-end, space-between, space-around) */
  actionsAlignment: PropTypes.string,
  /** Spacing between action buttons */
  actionsSpacing: PropTypes.number,
};

export default CardWithActions;
