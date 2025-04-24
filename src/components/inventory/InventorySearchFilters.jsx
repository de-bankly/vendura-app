import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  CategoryOutlined as CategoryIcon,
  GridView as GridViewIcon,
  ViewList as ViewListIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Tooltip,
  useTheme,
  alpha,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * InventorySearchFilters component provides search, category filter, and view mode controls
 * @param {object} props - Component props
 * @param {string} props.searchQuery - The current search query string.
 * @param {function} props.onSearchChange - Callback function when the search query changes.
 * @param {string} props.selectedCategory - The ID of the currently selected category.
 * @param {function} props.onCategoryChange - Callback function when the selected category changes.
 * @param {Array<object>} props.categories - An array of available category objects.
 * @param {string} props.categories[].id - The unique ID of the category.
 * @param {string} props.categories[].name - The display name of the category.
 * @param {('grid'|'list')} props.viewMode - The current view mode ('grid' or 'list').
 * @param {function} props.onViewModeChange - Callback function when the view mode changes.
 * @param {function} props.onFilterToggle - Callback function to toggle the filter drawer/modal.
 */
const InventorySearchFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange,
  onFilterToggle,
}) => {
  const theme = useTheme();

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={5} md={4}>
        <TextField
          fullWidth
          placeholder="Produkt suchen..."
          value={searchQuery}
          onChange={onSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              backgroundColor: theme.palette.background.default,
            },
          }}
        />
      </Grid>

      <Grid item xs={12} sm={5} md={4}>
        <TextField
          select
          fullWidth
          value={selectedCategory}
          onChange={onCategoryChange}
          displayEmpty
          variant="outlined"
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5,
              backgroundColor: theme.palette.background.default,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CategoryIcon color="action" />
              </InputAdornment>
            ),
          }}
          renderValue={selected => {
            if (selected === '') {
              return (
                <Box component="em" sx={{ color: theme.palette.text.secondary }}>
                  Kategorie
                </Box>
              );
            }
            const category = categories.find(cat => cat.id === selected);
            return category ? category.name : '';
          }}
        >
          <MenuItem value="">
            <em>Alle Kategorien</em>
          </MenuItem>
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      <Grid item xs={12} sm={2} md={4} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<FilterIcon />}
          onClick={onFilterToggle}
          size="small"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
          }}
        >
          Filter
        </Button>

        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: 1, display: { xs: 'none', md: 'block' } }}
        />

        <Box
          sx={{
            display: 'flex',
            backgroundColor: theme.palette.background.default,
            borderRadius: 1.5,
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Tooltip title="Grid-Ansicht">
            <IconButton
              onClick={() => onViewModeChange('grid')}
              color={viewMode === 'grid' ? 'primary' : 'default'}
              size="small"
              sx={{
                borderRadius: '6px 0 0 6px',
                backgroundColor:
                  viewMode === 'grid' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              }}
            >
              <GridViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Listen-Ansicht">
            <IconButton
              onClick={() => onViewModeChange('list')}
              color={viewMode === 'list' ? 'primary' : 'default'}
              size="small"
              sx={{
                borderRadius: '0 6px 6px 0',
                backgroundColor:
                  viewMode === 'list' ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
              }}
            >
              <ViewListIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Grid>

      {selectedCategory && (
        <Grid item xs={12}>
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            <Chip
              label={categories.find(cat => cat.id === selectedCategory)?.name || 'Kategorie'}
              onDelete={() => onCategoryChange({ target: { value: '' } })}
              color="primary"
              variant="outlined"
              size="small"
            />
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

InventorySearchFilters.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  onFilterToggle: PropTypes.func.isRequired,
};

export default InventorySearchFilters;
