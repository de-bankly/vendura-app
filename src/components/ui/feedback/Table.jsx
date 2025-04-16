import SearchIcon from '@mui/icons-material/Search';
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Box,
  Checkbox,
  InputAdornment,
  Typography,
  useTheme,
  useMediaQuery,
  TablePagination,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import LocalTextField from '../inputs/TextField';

/**
 * Enhanced Table component with sorting, filtering, pagination, and row selection capabilities.
 * Designed to be responsive and accessible.
 */
const Table = ({
  columns,
  data,
  title,
  selectable = false,
  onRowSelect,
  onRowClick,
  initialSortBy = '',
  initialSortDirection = 'asc',
  rowsPerPageOptions = [5, 10, 25],
  defaultRowsPerPage = 10,
  searchable = true,
  searchPlaceholder = 'Search...',
  emptyStateMessage = 'No data available',
  stickyHeader = true,
  maxHeight,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for sorting
  const [sortBy, setSortBy] = useState(initialSortBy);
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  // State for pagination
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // State for filtering/search
  const [searchTerm, setSearchTerm] = useState('');

  // State for selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  // Reset pagination when data or search term changes
  useEffect(() => {
    setPage(1);
  }, [data.length, searchTerm]);

  // Memoize handler functions with useCallback
  const handleRequestSort = useCallback(
    property => {
      const isAsc = sortBy === property && sortDirection === 'asc';
      setSortDirection(isAsc ? 'desc' : 'asc');
      setSortBy(property);
    },
    [sortBy, sortDirection]
  );

  const handleSearch = useCallback(event => {
    setSearchTerm(event.target.value);
  }, []);

  const handleChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  }, []);

  // Memoize filtered data
  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (!searchTerm) return true;
      return columns.some(column => {
        const value = row[column.field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Memoize sorted data
  const sortedData = useMemo(() => {
    const sortableData = [...filteredData];
    sortableData.sort((a, b) => {
      if (!sortBy) return 0;
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
    return sortableData;
  }, [filteredData, sortBy, sortDirection]);

  // Memoize paginated data
  const paginatedData = useMemo(() => {
    return sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  // Memoize selection handlers
  const handleSelectAllClick = useCallback(() => {
    let newSelected;
    if (selectedRows.length === filteredData.length) {
      newSelected = [];
    } else {
      newSelected = filteredData.map(row => row.id);
    }
    setSelectedRows(newSelected);
    if (onRowSelect) {
      onRowSelect(newSelected);
    }
  }, [selectedRows, filteredData, onRowSelect]);

  const handleSelectRow = useCallback(
    id => {
      const selectedIndex = selectedRows.indexOf(id);
      let newSelected = [];
      if (selectedIndex === -1) {
        newSelected = [...selectedRows, id];
      } else {
        newSelected = selectedRows.filter(rowId => rowId !== id);
      }
      setSelectedRows(newSelected);
      if (onRowSelect) {
        onRowSelect(newSelected);
      }
    },
    [selectedRows, onRowSelect]
  );

  // Check if a row is selected
  const isSelected = useCallback(id => selectedRows.indexOf(id) !== -1, [selectedRows]);

  // Calculate total rows (length of filtered data)
  const totalRows = useMemo(() => filteredData.length, [filteredData]);

  // Handler for TablePagination page change (provides 0-based page)
  const handleTblPageChange = useCallback((event, newZeroBasedPage) => {
    setPage(newZeroBasedPage + 1); // Convert to 1-based for internal state
  }, []);

  // Handler for TablePagination rowsPerPage change
  const handleTblRowsPerPageChange = useCallback(event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset to first page
  }, []);

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: theme.shape.borderRadius,
        ...sx,
      }}
      {...props}
    >
      {/* Table header with title and search */}
      {(title || searchable) && (
        <Box
          sx={{
            p: 2,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'space-between',
            alignItems: isMobile ? 'flex-start' : 'center',
            gap: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }}
        >
          {title && (
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          )}

          {searchable && (
            <LocalTextField
              size="small"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 200 }}
            />
          )}
        </Box>
      )}

      {/* Table container */}
      <TableContainer
        sx={{
          maxHeight: maxHeight,
          overflowX: 'auto',
        }}
      >
        <MuiTable stickyHeader={stickyHeader} aria-label={title || 'data-table'}>
          {/* Table header */}
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selectedRows.length > 0 && selectedRows.length < filteredData.length
                    }
                    checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                    onChange={handleSelectAllClick}
                    inputProps={{ 'aria-label': 'select all' }}
                  />
                </TableCell>
              )}

              {columns.map(column => (
                <TableCell
                  key={column.field}
                  align={column.numeric ? 'right' : 'left'}
                  padding={column.disablePadding ? 'none' : 'normal'}
                  sortDirection={sortBy === column.field ? sortDirection : false}
                  sx={{
                    minWidth: column.minWidth,
                    width: column.width,
                    whiteSpace: 'nowrap',
                    ...column.headerSx,
                  }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={sortBy === column.field}
                      direction={sortBy === column.field ? sortDirection : 'asc'}
                      onClick={() => handleRequestSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table body */}
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => {
                const isItemSelected = isSelected(row.id);

                return (
                  <TableRow
                    hover
                    onClick={event => {
                      if (onRowClick) onRowClick(row);
                    }}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id || index}
                    selected={isItemSelected}
                    sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={event => {
                            event.stopPropagation();
                            handleSelectRow(row.id);
                          }}
                          inputProps={{ 'aria-labelledby': `table-row-${row.id}` }}
                        />
                      </TableCell>
                    )}

                    {columns.map(column => {
                      const value = row[column.field];

                      return (
                        <TableCell
                          key={`${row.id}-${column.field}`}
                          align={column.numeric ? 'right' : 'left'}
                          sx={column.cellSx}
                        >
                          {column.renderCell ? column.renderCell(row) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  align="center"
                  sx={{ py: 3 }}
                >
                  <Typography variant="body1" color="text.secondary">
                    {emptyStateMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </MuiTable>
      </TableContainer>

      {/* Pagination Controls - Use only TablePagination */}
      {totalRows > 0 && (
        <TablePagination
          component="div"
          count={totalRows} // Total number of rows
          page={page - 1} // Convert 1-based state to 0-based prop
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={rowsPerPageOptions}
          onPageChange={handleTblPageChange} // Use handler for 0-based index
          onRowsPerPageChange={handleTblRowsPerPageChange}
          // Customize labels if needed
          // labelRowsPerPage="Rows per page:"
          // sx={{ borderTop: `1px solid ${theme.palette.divider}` }} // Apply styling here if needed
        />
      )}
    </Paper>
  );
};

Table.propTypes = {
  /** Array of column definitions */
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      /** Unique field identifier */
      field: PropTypes.string.isRequired,
      /** Display name for the column header */
      headerName: PropTypes.string.isRequired,
      /** If true, content will be right-aligned */
      numeric: PropTypes.bool,
      /** If true, padding will be reduced */
      disablePadding: PropTypes.bool,
      /** If false, column will not be sortable */
      sortable: PropTypes.bool,
      /** Minimum width of the column */
      minWidth: PropTypes.number,
      /** Fixed width of the column */
      width: PropTypes.number,
      /** Custom render function for cell content */
      renderCell: PropTypes.func,
      /** Custom styles for header cell */
      headerSx: PropTypes.object,
      /** Custom styles for body cells */
      cellSx: PropTypes.object,
    })
  ).isRequired,
  /** Array of data objects */
  data: PropTypes.array.isRequired,
  /** Table title */
  title: PropTypes.string,
  /** If true, rows can be selected */
  selectable: PropTypes.bool,
  /** Callback fired when rows are selected */
  onRowSelect: PropTypes.func,
  /** Callback fired when a row is clicked */
  onRowClick: PropTypes.func,
  /** Initial sort field */
  initialSortBy: PropTypes.string,
  /** Initial sort direction */
  initialSortDirection: PropTypes.oneOf(['asc', 'desc']),
  /** Available options for rows per page */
  rowsPerPageOptions: PropTypes.array,
  /** Default rows per page */
  defaultRowsPerPage: PropTypes.number,
  /** If true, search functionality is enabled */
  searchable: PropTypes.bool,
  /** Placeholder text for search input */
  searchPlaceholder: PropTypes.string,
  /** Message to display when no data is available */
  emptyStateMessage: PropTypes.string,
  /** If true, the table header will be sticky */
  stickyHeader: PropTypes.bool,
  /** Maximum height of the table */
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default Table;
