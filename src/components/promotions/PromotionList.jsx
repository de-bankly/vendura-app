import {
  Box,
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
  Alert,
  useTheme,
  alpha,
  Skeleton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import PropTypes from 'prop-types';
import React from 'react';
import { format } from 'date-fns';
import deLocale from 'date-fns/locale/de';

/**
 * Formats a date string or object into 'dd.MM.yyyy' format using German locale.
 * @param {string | Date | undefined} date - The date to format.
 * @returns {string} The formatted date string or '-' if invalid/null.
 */
const formatDate = date => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd.MM.yyyy', { locale: deLocale });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Ungültiges Datum';
  }
};

/**
 * Formats a number as EUR currency using German locale.
 * @param {number} price - The price to format.
 * @returns {string} The formatted currency string.
 */
const formatPrice = price => {
  if (typeof price !== 'number') {
    return '-';
  }
  return price.toLocaleString('de-DE', {
    style: 'currency',
    currency: 'EUR',
  });
};

/**
 * PromotionList component for displaying and managing promotions.
 * @param {object} props - The component props.
 * @param {Array<object>} props.promotions - Array of promotion objects.
 * @param {boolean} [props.loading=false] - Indicates if data is loading.
 * @param {string|null} [props.error=null] - Error message, if any.
 * @param {Function} props.onEditClick - Callback function when edit button is clicked.
 * @param {Function} props.onDeleteClick - Callback function when delete button is clicked.
 * @returns {React.ReactElement} The PromotionList component.
 */
const PromotionList = ({ promotions, loading, error, onEditClick, onDeleteClick }) => {
  const theme = useTheme();

  /**
   * Determines the status of a promotion based on its dates and active flag.
   * @param {object} promotion - The promotion object.
   * @param {string | Date} promotion.begin - The start date of the promotion.
   * @param {string | Date} promotion.end - The end date of the promotion.
   * @param {boolean} promotion.active - The active status flag of the promotion.
   * @returns {{label: string, color: 'default' | 'warning' | 'error' | 'success'}} The status label and color.
   */
  const getPromotionStatus = promotion => {
    const now = new Date();
    let beginDate, endDate;

    try {
      beginDate = new Date(promotion.begin);
      endDate = new Date(promotion.end);
      if (isNaN(beginDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date');
      }
    } catch (e) {
      console.error('Error parsing promotion dates:', e);
      return { label: 'Ungültig', color: 'error' };
    }

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

  if (loading && (!promotions || promotions.length === 0)) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ height: 40, mb: 3 }}>
          <Skeleton variant="text" width="30%" height={40} />
        </Box>
        <TableContainer component={Paper} variant="outlined">
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h6">Aktionen & Rabatte</Typography>
      </Box>

      {!promotions || promotions.length === 0 ? (
        <Paper variant="outlined" sx={{ textAlign: 'center', py: 4, mt: 2 }}>
          <Typography color="text.secondary">
            Keine Aktionen gefunden. Erstellen Sie eine neue Aktion, um Rabatte anzubieten.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} variant="outlined">
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
                    hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor:
                          theme.palette.mode === 'light'
                            ? alpha(theme.palette.grey[100], 0.7)
                            : alpha(theme.palette.grey[900], 0.7),
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
                          aria-label={`Aktion ${promotion.productName || promotion.id} bearbeiten`}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Löschen">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDeleteClick(promotion.id)}
                          aria-label={`Aktion ${promotion.productName || promotion.id} löschen`}
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
      productId: PropTypes.string, // Can be null if it's a general promotion
      productName: PropTypes.string, // Can be null
      begin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
      discount: PropTypes.number.isRequired,
      active: PropTypes.bool,
    })
  ),
  loading: PropTypes.bool,
  error: PropTypes.string,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
};

PromotionList.defaultProps = {
  promotions: [],
  loading: false,
  error: null,
};

export default PromotionList;
