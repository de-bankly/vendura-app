import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CardGiftcard as CardGiftcardIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTheme, alpha } from '@mui/material/styles';

const tableRowVariants = {
  hidden: { opacity: 0 },
  visible: i => ({
    opacity: 1,
    transition: {
      delay: i * 0.05,
    },
  }),
};

/**
 * Formats a date string into a localized date string.
 * Returns 'Kein Ablaufdatum' if the date string is falsy.
 * @param {string | undefined | null} dateString - The date string to format.
 * @returns {string} The formatted date string or 'Kein Ablaufdatum'.
 */
const formatDate = dateString => {
  if (!dateString) return 'Kein Ablaufdatum';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

/**
 * Displays a table of vouchers with pagination and action buttons.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.vouchers - Array of voucher objects to display. Each object should have properties like id, type, initialBalance, remainingBalance, discountPercentage, remainingUsages, expirationDate.
 * @param {boolean} props.loading - Indicates if data is currently being loaded.
 * @param {number} props.totalElements - Total number of vouchers for pagination.
 * @param {number} props.page - Current zero-based page index.
 * @param {number} props.rowsPerPage - Number of rows per page.
 * @param {function(event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void} props.onPageChange - Callback for page change.
 * @param {function(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void} props.onRowsPerPageChange - Callback for rows per page change.
 * @param {function(voucher: object): void} props.onEdit - Callback for edit action, receives the voucher object.
 * @param {function(voucher: object): void} props.onDelete - Callback for delete action, receives the voucher object.
 * @param {function(): void} props.onRefresh - Callback for refresh action.
 * @returns {React.ReactElement} The rendered VoucherTable component.
 */
const VoucherTable = ({
  vouchers,
  loading,
  totalElements,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
  onRefresh,
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.grey[700], 0.5)
              : alpha(theme.palette.grey[300], 0.8)
          }`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" component="div">
            Alle Gutscheine
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<RefreshIcon />}
              onClick={onRefresh}
              disabled={loading}
              size="small"
            >
              Aktualisieren
            </Button>
          </Box>
        </Box>

        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="Gutschein-Tabelle">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.grey[100], 0.9),
                  }}
                >
                  Gutscheincode
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.grey[100], 0.9),
                  }}
                >
                  Typ
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.grey[100], 0.9),
                  }}
                >
                  Wert/Rabatt
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.grey[100], 0.9),
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.grey[100], 0.9),
                  }}
                >
                  Ablaufdatum
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 'bold',
                    backgroundColor:
                      theme.palette.mode === 'dark'
                        ? alpha(theme.palette.background.paper, 0.9)
                        : alpha(theme.palette.grey[100], 0.9),
                  }}
                >
                  Aktionen
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <CircularProgress size={40} />
                  </TableCell>
                </TableRow>
              ) : vouchers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                      Keine Gutscheine gefunden
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                vouchers.map((voucher, index) => (
                  <motion.tr
                    key={voucher.id}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={tableRowVariants}
                    component={TableRow}
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.action.hover, 0.05)
                            : alpha(theme.palette.action.hover, 0.05),
                      },
                      '&:hover': {
                        backgroundColor:
                          theme.palette.mode === 'dark'
                            ? alpha(theme.palette.action.hover, 0.1)
                            : alpha(theme.palette.action.hover, 0.1),
                      },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {voucher.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={
                          voucher.type === 'GIFT_CARD' ? (
                            <CardGiftcardIcon fontSize="small" />
                          ) : (
                            <LocalOfferIcon fontSize="small" />
                          )
                        }
                        label={voucher.type === 'GIFT_CARD' ? 'Geschenkkarte' : 'Rabattgutschein'}
                        color={voucher.type === 'GIFT_CARD' ? 'primary' : 'secondary'}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {voucher.type === 'GIFT_CARD' ? (
                        <Typography>
                          <Box component="span" fontWeight="medium">
                            {voucher.initialBalance?.toFixed(2)}€
                          </Box>{' '}
                          {voucher.remainingBalance !== undefined && (
                            <Box component="span" color="text.secondary" fontSize="0.85rem">
                              (Verbleibend: {voucher.remainingBalance?.toFixed(2)}
                              €)
                            </Box>
                          )}
                        </Typography>
                      ) : (
                        <Typography>
                          <Box component="span" fontWeight="medium">
                            {voucher.discountPercentage}%
                          </Box>{' '}
                          {voucher.remainingUsages !== undefined && (
                            <Box component="span" color="text.secondary" fontSize="0.85rem">
                              (Verbleibend: {voucher.remainingUsages}x)
                            </Box>
                          )}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {voucher.type === 'GIFT_CARD' ? (
                        <Chip
                          label={voucher.remainingBalance > 0 ? 'Aktiv' : 'Aufgebraucht'}
                          color={voucher.remainingBalance > 0 ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      ) : (
                        <Chip
                          label={voucher.remainingUsages > 0 ? 'Aktiv' : 'Aufgebraucht'}
                          color={voucher.remainingUsages > 0 ? 'success' : 'default'}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      {voucher.expirationDate ? (
                        <Typography variant="body2">
                          {formatDate(voucher.expirationDate)}
                        </Typography>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Kein Ablaufdatum
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Bearbeiten">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => onEdit(voucher)}
                            sx={{
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.2),
                              },
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Löschen">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => onDelete(voucher)}
                            sx={{
                              backgroundColor: alpha(theme.palette.error.main, 0.1),
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.2),
                              },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalElements}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          labelRowsPerPage="Zeilen pro Seite:"
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} von ${count !== -1 ? count : `mehr als ${to}`}`
          }
        />
      </Paper>
    </Box>
  );
};

export default VoucherTable;
