import {
  Refresh as RefreshIcon,
  Inventory2 as Inventory2Icon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { Box, Button, Typography, Chip, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

/**
 * InventoryHeader component displays the header section of the inventory page
 * with title and action buttons
 */
const InventoryHeader = ({ onRefresh }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'flex-start', sm: 'center' },
        justifyContent: 'space-between',
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography variant="h4" component="h1" fontWeight={700}>
          Produktbestand
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Chip
            label="Übersicht"
            size="small"
            color="primary"
            sx={{
              borderRadius: 1,
              fontWeight: 500,
              mr: 1,
              backgroundColor: theme.palette.primary.main,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            Verwalten Sie Produkte und kontrollieren Sie den aktuellen Bestand
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={onRefresh}
          startIcon={<RefreshIcon />}
          size="small"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
          }}
        >
          Aktualisieren
        </Button>
        <Button
          component={Link}
          to="/inventory-management"
          variant="contained"
          color="primary"
          startIcon={<Inventory2Icon />}
          size="small"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
          }}
        >
          Bestandsverwaltung
        </Button>
        <Button
          component={Link}
          to="/inventory-report"
          variant="outlined"
          color="secondary"
          startIcon={<BarChartIcon />}
          size="small"
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 500,
            px: 2,
          }}
        >
          Bestandsanalyse
        </Button>
      </Box>
    </Box>
  );
};

InventoryHeader.propTypes = {
  onRefresh: PropTypes.func.isRequired,
};

export default InventoryHeader;
