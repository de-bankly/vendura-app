import { CardHeader as MuiCardHeader, styled } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const StyledMuiCardHeader = styled(MuiCardHeader)(({ theme }) => ({
  padding: theme.spacing(2, 3, 0, 3),
  '.MuiCardHeader-title': {
    fontSize: '1.125rem',
    fontWeight: 600,
  },
  '.MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
}));

/**
 * Enhanced CardHeader component using styled API.
 * @param {object} props - The component props.
 * @param {React.ReactNode} [props.title] - The content of the Card Title.
 * @param {React.ReactNode} [props.subheader] - The content of the Card Subheader.
 * @param {React.ReactNode} [props.avatar] - The Avatar for the Card Header.
 * @param {React.ReactNode} [props.action] - The action to display in the Card Header.
 * @param {object} [props.titleTypographyProps={}] - Props applied to the title Typography element.
 * @param {object} [props.subheaderTypographyProps={}] - Props applied to the subheader Typography element.
 * @param {object} [props.sx={}] - The system prop that allows defining system overrides as well as additional CSS styles.
 * @param {React.Ref<HTMLDivElement>} ref - Forwarded ref.
 * @returns {React.ReactElement} The rendered component.
 */
const CardHeader = React.forwardRef(
  (
    {
      title,
      subheader,
      avatar,
      action,
      titleTypographyProps = {},
      subheaderTypographyProps = {},
      sx = {},
      ...props
    },
    ref
  ) => {
    const finalTitleTypographyProps = {
      ...titleTypographyProps,
    };
    const finalSubheaderTypographyProps = {
      ...subheaderTypographyProps,
    };

    return (
      <StyledMuiCardHeader
        ref={ref}
        title={title}
        subheader={subheader}
        avatar={avatar}
        action={action}
        titleTypographyProps={finalTitleTypographyProps}
        subheaderTypographyProps={finalSubheaderTypographyProps}
        sx={sx}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

CardHeader.propTypes = {
  /**
   * The content of the Card Title.
   */
  title: PropTypes.node,
  /**
   * The content of the Card Subheader.
   */
  subheader: PropTypes.node,
  /**
   * The Avatar for the Card Header.
   */
  avatar: PropTypes.node,
  /**
   * The action to display in the Card Header.
   */
  action: PropTypes.node,
  /**
   * Props applied to the title Typography element.
   */
  titleTypographyProps: PropTypes.object,
  /**
   * Props applied to the subheader Typography element.
   */
  subheaderTypographyProps: PropTypes.object,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.object,
};

export default CardHeader;
