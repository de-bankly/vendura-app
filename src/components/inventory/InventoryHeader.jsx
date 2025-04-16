import { Refresh as RefreshIcon, Inventory2 as Inventory2Icon } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * InventoryHeader component displays the header section of the inventory page
 * with title and action buttons
 */
const InventoryHeader = ({ onRefresh }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
      <Typography variant="h4" component="h1">
        Produktbestand
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" color="primary" onClick={onRefresh} startIcon={<RefreshIcon />}>
          Aktualisieren
        </Button>
        <Button
          component={Link}
          to="/inventory-management"
          variant="contained"
          color="primary"
          startIcon={<Inventory2Icon />}
        >
          Bestandsverwaltung
        </Button>
      </Box>
    </Box>
  );
};

InventoryHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default InventoryHeader;
