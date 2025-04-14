import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  TextField,
  Autocomplete,
  Chip,
  CircularProgress,
  Typography,
  useTheme,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

/**
 * SearchableDropdown component that provides a dropdown menu with search functionality.
 * Supports single and multiple selection modes.
 */
const SearchableDropdown = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Search...',
  multiple = false,
  loading = false,
  error = false,
  helperText = '',
  required = false,
  disabled = false,
  freeSolo = false,
  noOptionsText = 'No options',
  loadingText = 'Loading...',
  groupBy,
  getOptionLabel = option => option.label || option.toString(),
  getOptionDisabled,
  renderOption,
  renderTags,
  filterOptions,
  limitTags = 2,
  size = 'medium',
  fullWidth = true,
  clearOnBlur = !freeSolo,
  clearOnEscape = true,
  disableClearable = false,
  sx = {},
  ...props
}) => {
  const theme = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [open, setOpen] = useState(false);

  // Handle value change
  const handleChange = (event, newValue) => {
    if (onChange) {
      // Create a synthetic event object that mimics MUI's onChange behavior
      const syntheticEvent = {
        target: {
          name: props.name,
          value: newValue,
        },
        // Preserve the original event properties
        ...event,
      };

      onChange(syntheticEvent);
    }
  };

  // Handle input value change
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  // Custom rendering of the input
  const renderInput = params => (
    <TextField
      {...params}
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      size={size}
      InputProps={{
        ...params.InputProps,
        startAdornment: (
          <>
            <SearchIcon color="action" sx={{ ml: 0.5, mr: 0.5 }} />
            {params.InputProps.startAdornment}
          </>
        ),
        endAdornment: (
          <>
            {loading ? <CircularProgress color="inherit" size={20} /> : null}
            {params.InputProps.endAdornment}
          </>
        ),
      }}
    />
  );

  // Custom rendering of the option
  const defaultRenderOption = (props, option, state) => {
    const { key, ...otherProps } = props;
    // Generate a unique key if none is provided
    const uniqueKey = key || `option-${option.id || JSON.stringify(option)}`;
    return (
      <li key={uniqueKey} {...otherProps}>
        <Typography variant="body2" noWrap>
          {getOptionLabel(option)}
        </Typography>
      </li>
    );
  };

  // Custom rendering of the tags in multiple mode
  const defaultRenderTags = (tagValue, getTagProps) =>
    tagValue.map((option, index) => (
      <Chip
        label={getOptionLabel(option)}
        size="small"
        {...getTagProps({ index })}
        sx={{
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.contrastText,
          '& .MuiChip-deleteIcon': {
            color: theme.palette.primary.contrastText,
            '&:hover': {
              color: theme.palette.primary.contrastText,
            },
          },
        }}
      />
    ));

  return (
    <Autocomplete
      options={options}
      value={value}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      multiple={multiple}
      disableCloseOnSelect={multiple}
      loading={loading}
      loadingText={loadingText}
      noOptionsText={noOptionsText}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      getOptionLabel={getOptionLabel}
      getOptionDisabled={getOptionDisabled}
      renderInput={renderInput}
      renderOption={renderOption || defaultRenderOption}
      renderTags={renderTags || defaultRenderTags}
      filterOptions={filterOptions}
      limitTags={limitTags}
      freeSolo={freeSolo}
      fullWidth={fullWidth}
      clearOnBlur={clearOnBlur}
      clearOnEscape={clearOnEscape}
      disableClearable={disableClearable}
      groupBy={groupBy}
      isOptionEqualToValue={
        props.isOptionEqualToValue ||
        ((option, val) => {
          if (!val) return false;
          if (!option) return false;
          return option.id === val.id;
        })
      }
      PaperComponent={props => (
        <Paper
          elevation={4}
          {...props}
          sx={{
            borderRadius: 1,
            mt: 0.5,
            '& .MuiAutocomplete-listbox': {
              padding: '4px 0',
              '& .MuiAutocomplete-option': {
                padding: '8px 16px',
                minHeight: 48,
                '&[aria-selected="true"]': {
                  backgroundColor: theme.palette.primary.lighter,
                },
                '&.Mui-focused': {
                  backgroundColor: theme.palette.primary.lighter,
                },
              },
            },
          }}
        />
      )}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: error ? theme.palette.error.main : theme.palette.divider,
          },
          '&:hover fieldset': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
          },
        },
        ...sx,
      }}
      {...props}
    />
  );
};

SearchableDropdown.propTypes = {
  /** Array of options */
  options: PropTypes.array.isRequired,
  /** Selected value(s) */
  value: PropTypes.any,
  /** Callback fired when the value changes */
  onChange: PropTypes.func,
  /** The label of the dropdown */
  label: PropTypes.string,
  /** The placeholder text */
  placeholder: PropTypes.string,
  /** If true, multiple values can be selected */
  multiple: PropTypes.bool,
  /** If true, the component is in a loading state */
  loading: PropTypes.bool,
  /** If true, the component is in an error state */
  error: PropTypes.bool,
  /** The helper text */
  helperText: PropTypes.node,
  /** If true, the label is displayed as required */
  required: PropTypes.bool,
  /** If true, the component is disabled */
  disabled: PropTypes.bool,
  /** If true, the user can enter arbitrary values */
  freeSolo: PropTypes.bool,
  /** Text to display when there are no options */
  noOptionsText: PropTypes.string,
  /** Text to display when the component is loading */
  loadingText: PropTypes.string,
  /** Function to group the options */
  groupBy: PropTypes.func,
  /** Function to get the label of an option */
  getOptionLabel: PropTypes.func,
  /** Function to determine if an option is disabled */
  getOptionDisabled: PropTypes.func,
  /** Custom render function for options */
  renderOption: PropTypes.func,
  /** Custom render function for tags */
  renderTags: PropTypes.func,
  /** Custom filter function */
  filterOptions: PropTypes.func,
  /** The maximum number of tags to display when multiple is true */
  limitTags: PropTypes.number,
  /** The size of the component */
  size: PropTypes.oneOf(['small', 'medium']),
  /** If true, the component will take up the full width of its container */
  fullWidth: PropTypes.bool,
  /** If true, the input value will be cleared on blur */
  clearOnBlur: PropTypes.bool,
  /** If true, the input value will be cleared when Escape is pressed */
  clearOnEscape: PropTypes.bool,
  /** If true, the clear button will not be displayed */
  disableClearable: PropTypes.bool,
  /** The system prop that allows defining system overrides as well as additional CSS styles */
  sx: PropTypes.object,
};

export default SearchableDropdown;
