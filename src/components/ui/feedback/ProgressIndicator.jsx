import { CircularProgress, LinearProgress, Box, Typography, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * ProgressIndicator component for showing loading or progress states.
 * Supports both circular and linear progress indicators with optional labels.
 */
const ProgressIndicator = ({
  type = 'circular',
  value = 0,
  variant = 'indeterminate',
  size = 'medium',
  thickness = 3.6,
  color = 'primary',
  label,
  labelPosition = 'bottom',
  sx = {},
  ...props
}) => {
  const theme = useTheme();

  // Define size values for circular progress
  const sizeValues = {
    small: 24,
    medium: 40,
    large: 56,
  };

  // Determine the actual size value
  const circularSize = typeof size === 'number' ? size : sizeValues[size] || sizeValues.medium;

  // Render the progress indicator
  const renderProgress = () => {
    if (type === 'circular') {
      return (
        <CircularProgress
          variant={variant}
          value={value}
          size={circularSize}
          thickness={thickness}
          color={color}
          {...props}
        />
      );
    }

    return (
      <LinearProgress
        variant={variant}
        value={value}
        color={color}
        sx={{ width: '100%', borderRadius: theme.shape.borderRadius }}
        {...props}
      />
    );
  };

  // Render the label
  const renderLabel = () => {
    if (!label) return null;

    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: labelPosition === 'bottom' ? 1 : 0, mb: labelPosition === 'top' ? 1 : 0 }}
      >
        {label}
        {variant === 'determinate' && ` (${Math.round(value)}%)`}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: labelPosition === 'left' || labelPosition === 'right' ? 'row' : 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: labelPosition === 'left' || labelPosition === 'right' ? 2 : 0,
        ...sx,
      }}
    >
      {(labelPosition === 'top' || labelPosition === 'left') && renderLabel()}
      {renderProgress()}
      {(labelPosition === 'bottom' || labelPosition === 'right') && renderLabel()}
    </Box>
  );
};

ProgressIndicator.propTypes = {
  /** The type of progress indicator */
  type: PropTypes.oneOf(['circular', 'linear']),
  /** The value of the progress indicator (0-100) */
  value: PropTypes.number,
  /** The variant of the progress indicator */
  variant: PropTypes.oneOf(['determinate', 'indeterminate', 'buffer', 'query']),
  /** The size of the circular progress indicator */
  size: PropTypes.oneOfType([PropTypes.oneOf(['small', 'medium', 'large']), PropTypes.number]),
  /** The thickness of the circular progress indicator */
  thickness: PropTypes.number,
  /** The color of the progress indicator */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'error',
    'info',
    'warning',
    'inherit',
  ]),
  /** The label to display */
  label: PropTypes.node,
  /** The position of the label */
  labelPosition: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default ProgressIndicator;
