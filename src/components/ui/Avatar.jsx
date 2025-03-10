import React from 'react';
import { Avatar as MuiAvatar, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Avatar component that extends MUI Avatar with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Avatar = ({ children, alt, src, srcSet, variant = 'circular', sizes, sx = {}, ...props }) => {
  const theme = useTheme();

  return (
    <MuiAvatar
      alt={alt}
      src={src}
      srcSet={srcSet}
      variant={variant}
      sizes={sizes}
      sx={{
        transition: 'all 0.2s ease-in-out',
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiAvatar>
  );
};

Avatar.propTypes = {
  /** The content of the avatar */
  children: PropTypes.node,
  /** Used in combination with src or srcSet to provide an alt attribute for the rendered img element */
  alt: PropTypes.string,
  /** The src attribute for the img element */
  src: PropTypes.string,
  /** The srcSet attribute for the img element */
  srcSet: PropTypes.string,
  /** The shape of the avatar */
  variant: PropTypes.oneOf(['circular', 'rounded', 'square']),
  /** The sizes attribute for the img element */
  sizes: PropTypes.string,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Avatar;
