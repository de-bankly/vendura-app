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
  useTheme,
  alpha,
  Skeleton,
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
  const theme = useTheme();

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

  // Check if promotion is active
  const isPromotionActive = promotion => {
    const now = new Date();
    const beginDate = new Date(promotion.begin);
    const endDate = new Date(promotion.end);
    return promotion.active && now >= beginDate && now <= endDate;
  };

  // Get promotion status
  const getPromotionStatus = promotion => {
    const now = new Date();
    const beginDate = new Date(promotion.begin);
    const endDate = new Date(promotion.end);

    if (!promotion.active) {
      return { label: 'Inaktiv', color: 'default' };
    }
    if (now < beginDate) {
      return { label: 'Bevorstehend', color: 'warning' };
    }
    if (now > endDate) {
      return { label: 'Abgelaufen', color: 'error' };
    }
    return { label: 'Aktiv', color: 'success' };
  };

  if (loading && promotions.length === 0) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ height: 40, mb: 3 }}>
          <Skeleton variant="text" width="30%" height={40} />
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '& th': {
                    fontWeight: 'bold',
                  },
                }}
              >
                <TableCell>Produkt</TableCell>
                <TableCell>Rabatt</TableCell>
                <TableCell>Gültig von</TableCell>
                <TableCell>Gültig bis</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="100%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={70} height={24} />
                  </TableCell>
                  <TableCell align="right">
                    <Skeleton variant="rectangular" width={80} height={30} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
      </Box>

      {promotions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            Keine Aktionen gefunden. Erstellen Sie eine neue Aktion, um Rabatte anzubieten.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  '& th': {
                    fontWeight: 'bold',
                  },
                }}
              >
                <TableCell>Produkt</TableCell>
                <TableCell>Rabatt</TableCell>
                <TableCell>Gültig von</TableCell>
                <TableCell>Gültig bis</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {promotions.map(promotion => {
                const status = getPromotionStatus(promotion);

                return (
                  <TableRow
                    key={promotion.id}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor:
                          theme.palette.mode === 'light'
                            ? alpha(theme.palette.background.default, 0.5)
                            : alpha(theme.palette.background.paper, 0.1),
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {promotion.productName || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={formatPrice(promotion.discount)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{formatDate(promotion.begin)}</TableCell>
                    <TableCell>{formatDate(promotion.end)}</TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" />
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
                );
              })}
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
