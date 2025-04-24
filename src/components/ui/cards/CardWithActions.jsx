import { CardContent, CardActions, Divider, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import Card from './Card';

/**
 * @typedef {import('@mui/material').CardProps} CardProps
 * @typedef {import('@mui/material').CardContentProps} CardContentProps
 * @typedef {import('@mui/material').CardActionsProps} CardActionsProps
 * @typedef {import('react').ReactNode} ReactNode
 */

/**
 * Card component with actions in the footer.
 * Provides a consistent layout for cards with action buttons.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
 *
 * @param {object} props - The component props.
 * @param {ReactNode} [props.children] - The content of the card.
 * @param {ReactNode} [props.actions] - The actions to display in the card footer.
 * @param {boolean} [props.divider=true] - Whether to show a divider between the content and actions.
 * @param {CardContentProps} [props.contentProps={}] - Props to pass to the CardContent component.
 * @param {CardActionsProps} [props.actionsProps={}] - Props to pass to the CardActions component.
 * @param {('flex-start'|'center'|'flex-end'|'space-between'|'space-around')} [props.actionsAlignment='flex-end'] - Alignment of the actions in the footer.
 * @param {number} [props.actionsSpacing=1] - Spacing between action buttons (theme spacing units).
 * @param {CardProps} props.cardProps - Additional props to pass to the underlying Card component.
 * @returns {JSX.Element} The rendered CardWithActions component.
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
  /**
   * The content of the card
   * @type {ReactNode}
   */
  children: PropTypes.node,
  /**
   * The actions to display in the card footer
   * @type {ReactNode}
   */
  actions: PropTypes.node,
  /**
   * Whether to show a divider between the content and actions
   * @type {boolean}
   */
  divider: PropTypes.bool,
  /**
   * Props to pass to the CardContent component
   * @type {CardContentProps}
   */
  contentProps: PropTypes.object,
  /**
   * Props to pass to the CardActions component
   * @type {CardActionsProps}
   */
  actionsProps: PropTypes.object,
  /**
   * Alignment of the actions in the footer (flex-start, center, flex-end, space-between, space-around)
   * @type {('flex-start'|'center'|'flex-end'|'space-between'|'space-around')}
   */
  actionsAlignment: PropTypes.string,
  /**
   * Spacing between action buttons (theme spacing units)
   * @type {number}
   */
  actionsSpacing: PropTypes.number,
};

export default CardWithActions;
