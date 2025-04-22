import { Box, Chip, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

const CategoryFilter = ({ categories, selectedCategory, onCategorySelect }) => {
  return (
    <Box sx={{ mb: 2, overflow: 'auto' }}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap', pb: 1 }}>
        <Chip
          label="Alle"
          color={selectedCategory === 'all' ? 'primary' : 'default'}
          onClick={() => onCategorySelect('all')}
          clickable
        />
        {categories.map(category => (
          <Chip
            key={category}
            label={category}
            color={selectedCategory === category ? 'primary' : 'default'}
            onClick={() => onCategorySelect(category)}
            clickable
          />
        ))}
      </Stack>
    </Box>
  );
};

CategoryFilter.propTypes = {
  categories: PropTypes.array.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onCategorySelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
