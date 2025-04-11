import React from 'react';
import { CardHeader, CardContent, Divider, Typography, Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import Card from './Card';

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
  titleTypographyProps = {},
  subheaderTypographyProps = {},
  headerBgColor,
  ...cardProps
}) => {
  const theme = useTheme();

  return (
    <Card {...cardProps}>
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
        action={action}
        sx={{
          padding: '16px 24px',
          backgroundColor: headerBgColor || 'transparent',
          ...(headerProps.sx || {}),
        }}
        {...headerProps}
        disableTypography
      />
      {divider && <Divider />}
      <CardContent
        sx={{
          padding: '20px 24px',
          '&:last-child': { paddingBottom: '20px' },
          ...(contentProps.sx || {}),
        }}
        {...contentProps}
      >
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
  /** Props to pass to the title Typography component */
  titleTypographyProps: PropTypes.object,
  /** Props to pass to the subheader Typography component */
  subheaderTypographyProps: PropTypes.object,
  /** Background color for the header section */
  headerBgColor: PropTypes.string,
};

export default CardWithHeader;
