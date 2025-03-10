import React from 'react';
import { Grid as MuiGrid } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Grid component that extends MUI Grid with consistent styling
 * based on the Vendura theme. Designed for a modern, minimalistic look
 * suitable for a POS and inventory system.
 */
const Grid = ({ children, container, item, spacing, xs, sm, md, lg, xl, sx = {}, ...props }) => {
  return (
    <MuiGrid
      container={container}
      item={item}
      spacing={spacing}
      xs={xs}
      sm={sm}
      md={md}
      lg={lg}
      xl={xl}
      sx={{
        ...sx,
      }}
      {...props}
    >
      {children}
    </MuiGrid>
  );
};

Grid.propTypes = {
  /** The content of the grid */
  children: PropTypes.node,
  /** If true, the component will have the flex container behavior */
  container: PropTypes.bool,
  /** If true, the component will have the flex item behavior */
  item: PropTypes.bool,
  /** Defines the space between the type item components */
  spacing: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.array]),
  /** Defines the number of grids the component is going to use for extra small screens */
  xs: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.bool]),
  /** Defines the number of grids the component is going to use for small screens */
  sm: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.bool]),
  /** Defines the number of grids the component is going to use for medium screens */
  md: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.bool]),
  /** Defines the number of grids the component is going to use for large screens */
  lg: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.bool]),
  /** Defines the number of grids the component is going to use for extra large screens */
  xl: PropTypes.oneOfType([PropTypes.number, PropTypes.object, PropTypes.bool]),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Grid;
