import React from 'react';
import { LinearProgress as MuiLinearProgress, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced LinearProgress component that extends MUI LinearProgress with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const LinearProgress = ({
  color = 'primary',
  variant = 'indeterminate',
  value = 0,
  valueBuffer = 0,
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  return (
    <MuiLinearProgress
      color={color}
      variant={variant}
      value={value}
      valueBuffer={valueBuffer}
      sx={{
        height: 6,
        borderRadius: 3,
        backgroundColor:
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
        '& .MuiLinearProgress-bar': {
          borderRadius: 3,
        },
        ...sx,
      }}
      {...props}
    />
  );
};

LinearProgress.propTypes = {
  /** The color of the component */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'error',
    'info',
    'success',
    'warning',
    'inherit',
  ]),
  /** The variant to use */
  variant: PropTypes.oneOf(['determinate', 'indeterminate', 'buffer', 'query']),
  /** The value of the progress indicator for the determinate and buffer variants */
  value: PropTypes.number,
  /** The value for the buffer variant */
  valueBuffer: PropTypes.number,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default LinearProgress;
