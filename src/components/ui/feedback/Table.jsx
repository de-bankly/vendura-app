import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
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
  TextField,
  InputAdornment,
  Typography,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { Pagination } from '../navigation';

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

  // Reset pagination when data changes
  useEffect(() => {
    setPage(1);
  }, [data.length, searchTerm]);

  // Handle sort request
  const handleRequestSort = property => {
    const isAsc = sortBy === property && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortBy(property);
  };

  // Handle row selection
  const handleSelectRow = id => {
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
  };

  // Handle select all rows
  const handleSelectAllClick = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(row => row.id));
    }

    if (onRowSelect) {
      onRowSelect(
        selectedRows.length === filteredData.length ? [] : filteredData.map(row => row.id)
      );
    }
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // Handle search
  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  // Filter data based on search term
  const filteredData = data.filter(row => {
    if (!searchTerm) return true;

    return columns.some(column => {
      const value = row[column.field];
      if (value == null) return false;
      return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
  });

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortBy) return 0;

    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Paginate data
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Check if a row is selected
  const isSelected = id => selectedRows.indexOf(id) !== -1;

  return (
    <Paper
      elevation={2}
      sx={{
        width: '100%',
        overflow: 'hidden',
        borderRadius: 2,
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
            <TextField
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

      {/* Pagination */}
      {filteredData.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            p: 2,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Pagination
            count={Math.ceil(filteredData.length / rowsPerPage)}
            page={page}
            onChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={rowsPerPageOptions}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
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
