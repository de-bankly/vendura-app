import React from 'react';
import { CardHeader, CardContent, CardActions, Divider, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Card from './Card';

/**
 * Complete Card component with header, content, and actions.
 * Provides a consistent layout for complex card interfaces.
 * Designed for a modern, minimalistic look suitable for a POS and inventory system.
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
  titleTypographyProps = {},
  subheaderTypographyProps = {},
  headerBgColor,
  actionsAlignment = 'flex-end',
  actionsSpacing = 1,
  ...cardProps
}) => {
  const theme = useTheme();

  return (
    <Card {...cardProps}>
      {(title || subheader || avatar || headerAction) && (
        <>
          <CardHeader
            title={
              typeof title === 'string' ? (
                <Typography
                  variant="h6"
                  fontWeight={600}
                  color="text.primary"
                  {...titleTypographyProps}
                >
                  {title}
                </Typography>
              ) : (
                title
              )
            }
            subheader={
              typeof subheader === 'string' ? (
                <Typography variant="body2" color="text.secondary" {...subheaderTypographyProps}>
                  {subheader}
                </Typography>
              ) : (
                subheader
              )
            }
            avatar={avatar}
            action={headerAction}
            sx={{
              padding: '16px 24px',
              backgroundColor: headerBgColor || 'transparent',
              ...(headerProps.sx || {}),
            }}
            {...headerProps}
            disableTypography
          />
          {headerDivider && <Divider />}
        </>
      )}
      <CardContent
        sx={{
          padding: '20px 24px',
          '&:last-child': { paddingBottom: actions ? '20px' : '16px' },
          ...(contentProps.sx || {}),
        }}
        {...contentProps}
      >
        {children}
      </CardContent>
      {actions && (
        <>
          {actionsDivider && <Divider />}
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
  /** Props to pass to the title Typography component */
  titleTypographyProps: PropTypes.object,
  /** Props to pass to the subheader Typography component */
  subheaderTypographyProps: PropTypes.object,
  /** Background color for the header section */
  headerBgColor: PropTypes.string,
  /** Alignment of the actions in the footer (flex-start, center, flex-end, space-between, space-around) */
  actionsAlignment: PropTypes.string,
  /** Spacing between action buttons */
  actionsSpacing: PropTypes.number,
};

export default CompleteCard;
