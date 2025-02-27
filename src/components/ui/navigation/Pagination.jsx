import React from 'react';
import { Pagination as MuiPagination, Box } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * Enhanced Pagination component that extends MUI Pagination with consistent styling
 * and additional functionality based on the Vendura theme.
 */
const Pagination = ({
  count,
  page,
  onChange,
  color = 'primary',
  size = 'medium',
  variant = 'outlined',
  shape = 'rounded',
  showFirstButton = false,
  showLastButton = false,
  disabled = false,
  siblingCount = 1,
  boundaryCount = 1,
  hideNextButton = false,
  hidePrevButton = false,
  sx = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
        mb: 2,
        ...sx,
      }}
    >
      <MuiPagination
        count={count}
        page={page}
        onChange={onChange}
        color={color}
        size={size}
        variant={variant}
        shape={shape}
        showFirstButton={showFirstButton}
        showLastButton={showLastButton}
        disabled={disabled}
        siblingCount={siblingCount}
        boundaryCount={boundaryCount}
        hideNextButton={hideNextButton}
        hidePrevButton={hidePrevButton}
        sx={{
          '& .MuiPaginationItem-root': {
            fontWeight: 500,
          },
          '& .Mui-selected': {
            fontWeight: 700,
          },
        }}
        {...props}
      />
    </Box>
  );
};

Pagination.propTypes = {
  /** The total number of pages */
  count: PropTypes.number.isRequired,
  /** The current page */
  page: PropTypes.number.isRequired,
  /** Callback fired when the page is changed */
  onChange: PropTypes.func,
  /** The color of the pagination */
  color: PropTypes.oneOf(['primary', 'secondary', 'standard']),
  /** The size of the pagination */
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  /** The variant to use */
  variant: PropTypes.oneOf(['text', 'outlined']),
  /** The shape of the pagination items */
  shape: PropTypes.oneOf(['circular', 'rounded']),
  /** If true, the first-page button will be displayed */
  showFirstButton: PropTypes.bool,
  /** If true, the last-page button will be displayed */
  showLastButton: PropTypes.bool,
  /** If true, the pagination component will be disabled */
  disabled: PropTypes.bool,
  /** Number of always visible pages before and after the current page */
  siblingCount: PropTypes.number,
  /** Number of always visible pages at the beginning and end */
  boundaryCount: PropTypes.number,
  /** If true, the next button will be hidden */
  hideNextButton: PropTypes.bool,
  /** If true, the previous button will be hidden */
  hidePrevButton: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Pagination;
