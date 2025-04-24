import { Box, Chip, Stack } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Renders a horizontal list of category chips for filtering.
 * Includes an "All" option.
 * @component
 * @param {object} props - Component props.
 * @param {string[]} props.categories - An array of category names to display as chips.
 * @param {string} props.selectedCategory - The identifier of the currently selected category ('all' or a category name).
 * @param {(category: string) => void} props.onCategorySelect - Callback function triggered when a category chip is clicked. Passes the selected category identifier.
 * @returns {React.ReactElement} The rendered category filter component.
 */
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
  /**
   * An array of category names to display as chips.
   */
  categories: PropTypes.array.isRequired,
  /**
   * The identifier of the currently selected category ('all' or a category name).
   */
  selectedCategory: PropTypes.string.isRequired,
  /**
   * Callback function triggered when a category chip is clicked.
   * Passes the selected category identifier.
   */
  onCategorySelect: PropTypes.func.isRequired,
};

export default CategoryFilter;
