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
      {/* Search Field */}
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

      {/* Category Select */}
      <Grid item xs={12} sm={5} md={4}>
        <TextField
          select
          fullWidth
          value={selectedCategory}
          onChange={onCategoryChange}
          placeholder="Kategorie"
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
        >
          <MenuItem value="">Alle Kategorien</MenuItem>
          {categories.map(category => (
            <MenuItem key={category.id} value={category.id}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>

      {/* Filter and View Buttons */}
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

      {/* Active Filter Display */}
      {selectedCategory && (
        <Grid item xs={12}>
          <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
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
