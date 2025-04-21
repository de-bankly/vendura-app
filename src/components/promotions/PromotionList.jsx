import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { format } from 'date-fns';
import deLocale from 'date-fns/locale/de';

/**
 * PromotionList component for displaying and managing promotions
 */
const PromotionList = ({ promotions, loading, error, onAddClick, onEditClick, onDeleteClick }) => {
  // Format date with German locale
  const formatDate = date => {
    if (!date) return '-';
    try {
      return format(new Date(date), 'dd.MM.yyyy', { locale: deLocale });
    } catch (error) {
      return 'Ungültiges Datum';
    }
  };

  // Format price with German locale
  const formatPrice = price => {
    return price.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Fehler beim Laden der Aktionen: {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Aktionen & Rabatte</Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={onAddClick}>
          Neue Aktion
        </Button>
      </Box>

      {promotions.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="textSecondary">
            Keine Aktionen gefunden. Erstellen Sie eine neue Aktion, um Rabatte anzubieten.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Produkt</TableCell>
                <TableCell>Rabatt</TableCell>
                <TableCell>Gültig von</TableCell>
                <TableCell>Gültig bis</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map(promotion => (
                <TableRow key={promotion.id}>
                  <TableCell>{promotion.productName || '-'}</TableCell>
                  <TableCell>{formatPrice(promotion.discount)}</TableCell>
                  <TableCell>{formatDate(promotion.begin)}</TableCell>
                  <TableCell>{formatDate(promotion.end)}</TableCell>
                  <TableCell>
                    {promotion.active ? (
                      <Chip label="Aktiv" color="success" size="small" />
                    ) : (
                      <Chip label="Inaktiv" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Bearbeiten">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEditClick(promotion)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Löschen">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDeleteClick(promotion.id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

PromotionList.propTypes = {
  promotions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      productId: PropTypes.string.isRequired,
      productName: PropTypes.string,
      begin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      discount: PropTypes.number.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.string,
  onAddClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

export default PromotionList;
