import React from 'react';
import { CardContent, CardActions, Divider, Box } from '@mui/material';
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
  return (
    <Card {...cardProps}>
      <CardContent
        sx={{
          padding: '20px 24px',
          '&:last-child': { paddingBottom: actionsAlignment ? '20px' : '16px' },
          ...(contentProps.sx || {}),
        }}
        {...contentProps}
      >
        {children}
      </CardContent>
      {actions && (
        <>
          {divider && <Divider />}
          <CardActions
            sx={{
              padding: '12px 24px',
              justifyContent: actionsAlignment,
              gap: actionsSpacing,
              ...(actionsProps.sx || {}),
            }}
            {...actionsProps}
          >
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
