import React from 'react';
import { Stack as MuiStack } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Stack component that extends MUI Stack with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Stack = ({
  children,
  direction = 'column',
  spacing = 2,
  alignItems,
  justifyContent,
  divider,
  sx = {},
  ...props
}) => {
  return (
    <MuiStack
      direction={direction}
      spacing={spacing}
      alignItems={alignItems}
      justifyContent={justifyContent}
      divider={divider}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiStack>
  );
};

Stack.propTypes = {
  /** The content of the stack */
  children: PropTypes.node,
  /** The direction of the stack */
  direction: PropTypes.oneOfType([
    PropTypes.oneOf(['column', 'column-reverse', 'row', 'row-reverse']),
    PropTypes.object,
    PropTypes.array,
  ]),
  /** The spacing between items */
  spacing: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
  ]),
  /** Defines the align-items style property */
  alignItems: PropTypes.oneOf(['flex-start', 'center', 'flex-end', 'stretch', 'baseline']),
  /** Defines the justify-content style property */
  justifyContent: PropTypes.oneOf([
    'flex-start',
    'center',
    'flex-end',
    'space-between',
    'space-around',
    'space-evenly',
  ]),
  /** Element placed between each child */
  divider: PropTypes.node,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Stack;
