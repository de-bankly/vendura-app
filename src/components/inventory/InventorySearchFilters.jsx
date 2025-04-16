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
  Card,
  CardContent,
  Grid,
  InputAdornment,
  MenuItem,
  Tab,
  Tabs,
  TextField,
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
  const handleViewModeChange = (event, newValue) => {
    onViewModeChange(newValue === 0 ? 'grid' : 'list');
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              placeholder="Produkt suchen..."
              value={searchQuery}
              onChange={onSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              size="small"
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              select
              fullWidth
              value={selectedCategory}
              onChange={onCategoryChange}
              label="Kategorie"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon />
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

          <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              onClick={onFilterToggle}
              sx={{ mr: 1 }}
            >
              Filter
            </Button>

            <Tabs
              value={viewMode === 'grid' ? 0 : 1}
              onChange={handleViewModeChange}
              aria-label="Ansichtsmodus"
              sx={{
                minHeight: 'unset',
                '& .MuiTabs-indicator': { display: 'none' },
                '& .MuiTab-root': { minHeight: 'unset', py: 1 },
              }}
            >
              <Tab icon={<GridViewIcon />} sx={{ minWidth: 'unset' }} />
              <Tab icon={<ViewListIcon />} sx={{ minWidth: 'unset' }} />
            </Tabs>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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
