import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import React from 'react';

/**
 * A search bar component that allows users to input search terms.
 *
 * @param {object} props - The component props.
 * @param {string} props.searchTerm - The current value of the search input.
 * @param {function(string): void} props.onSearchChange - Callback function triggered when the search term changes.
 * @returns {React.ReactElement} The rendered search bar component.
 */
const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Produkt suchen..."
      value={searchTerm}
      onChange={e => onSearchChange(e.target.value)}
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ mb: 2 }}
    />
  );
};

export default SearchBar;
