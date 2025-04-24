import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  LocalShipping as ShippingIcon,
  Inventory2 as InventoryIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  alpha,
  useTheme,
  Tooltip,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { SupplierOrderService } from '../../services';

/**
 * @typedef {'PLACED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'} OrderStatus
 */

/**
 * @typedef {object} Supplier
 * @property {string} legalName
 */

/**
 * @typedef {object} OrderPosition
 * // Define properties of OrderPosition if known, e.g.,
 * // @property {string} productId
 * // @property {number} quantity
 */

/**
 * @typedef {object} SupplierOrder
 * @property {string|number} id
 * @property {Supplier} [supplier]
 * @property {string} [timestamp] - ISO date string
 * @property {string} [expectedDeliveryDate] - ISO date string
 * @property {OrderStatus} orderStatus
 * @property {OrderPosition[]} [positions]
 */

/**
 * Renders a list of supplier orders with actions to manage them.
 * @param {object} props - The component props.
 * @param {SupplierOrder[]} props.orders - The array of supplier orders to display.
 * @param {Function} [props.onRefresh] - Callback function to refresh the order list after an action.
 * @returns {React.ReactElement} The SupplierOrdersList component.
 */
const SupplierOrdersList = ({ orders, onRefresh }) => {
  const theme = useTheme();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState(null);

  /**
   * Formats a date string into 'dd.MM.yyyy' format.
   * @param {string | undefined} dateString - The date string to format.
   * @returns {string} The formatted date or '—' if the input is invalid.
   */
  const formatDate = dateString => {
    if (!dateString) return '—';
    try {
      return format(new Date(dateString), 'dd.MM.yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return '—';
    }
  };

  /**
   * Returns a Material UI Chip component styled based on the order status.
   * @param {OrderStatus} status - The order status.
   * @returns {React.ReactElement} A Chip component representing the status.
   */
  const getStatusChip = status => {
    let color;
    let label;

    switch (status) {
      case 'PLACED':
        color = 'info';
        label = 'Bestellt';
        break;
      case 'SHIPPED':
        color = 'warning';
        label = 'Versandt';
        break;
      case 'DELIVERED':
        color = 'success';
        label = 'Geliefert';
        break;
      case 'CANCELLED':
        color = 'error';
        label = 'Storniert';
        break;
      default:
        color = 'default';
        label = status;
    }

    return <Chip size="small" color={color} label={label} />;
  };

  /**
   * Sets the selected order for deletion and opens the confirmation dialog.
   * @param {SupplierOrder} order - The order to delete.
   */
  const handleDelete = order => {
    setSelectedOrder(order);
    setStatusAction('delete');
    setConfirmDialogOpen(true);
  };

  /**
   * Sets the selected order and the new status, then opens the confirmation dialog.
   * @param {SupplierOrder} order - The order whose status is to be changed.
   * @param {OrderStatus} newStatus - The new status for the order.
   */
  const handleStatusChange = (order, newStatus) => {
    setSelectedOrder(order);
    setStatusAction({ type: 'status', status: newStatus });
    setConfirmDialogOpen(true);
  };

  /**
   * Handles the confirmation of the pending action (delete or status change).
   * Calls the appropriate service and triggers a refresh.
   */
  const handleConfirmAction = async () => {
    if (!selectedOrder) return;

    try {
      if (statusAction === 'delete') {
        await SupplierOrderService.deleteSupplierOrder(selectedOrder.id);
      } else if (statusAction?.type === 'status') {
        await SupplierOrderService.updateSupplierOrderStatus(selectedOrder.id, statusAction.status);
      }

      setConfirmDialogOpen(false);
      setSelectedOrder(null);
      setStatusAction(null);

      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error processing order action:', err);
      setConfirmDialogOpen(false);
      setSelectedOrder(null);
      setStatusAction(null);
    }
  };

  /**
   * Closes the confirmation dialog and resets the selected order and action.
   */
  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
    setSelectedOrder(null);
    setStatusAction(null);
  };

  /**
   * Generates the content text for the confirmation dialog based on the selected action.
   * @returns {string} The confirmation message.
   */
  const getConfirmDialogContent = () => {
    if (!selectedOrder) return '';

    if (statusAction === 'delete') {
      return `Möchten Sie die Bestellung ${selectedOrder.id} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`;
    } else if (statusAction?.type === 'status') {
      switch (statusAction.status) {
        case 'SHIPPED':
          return `Bestellung ${selectedOrder.id} als versendet markieren?`;
        case 'DELIVERED':
          return `Bestellung ${selectedOrder.id} als geliefert markieren? Dies wird die Lagerbestände aktualisieren.`;
        default:
          return `Status der Bestellung ${selectedOrder.id} ändern?`;
      }
    }

    return '';
  };

  if (!orders || orders.length === 0) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: alpha(theme.palette.info.light, 0.05),
          borderRadius: 2,
          border: `1px dashed ${alpha(theme.palette.info.main, 0.3)}`,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <InventoryIcon
            sx={{
              fontSize: '3rem',
              color: alpha(theme.palette.info.main, 0.4),
            }}
          />
        </Box>
        <Typography variant="h6" color="text.primary" fontWeight={500}>
          Keine Lieferantenbestellungen gefunden
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Es sind keine Bestellungen vorhanden. Erstellen Sie eine neue Bestellung mit der
          Schaltfläche oben.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 'none',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
          overflow: 'hidden',
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Bestell-Nr.</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Lieferant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Datum</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Erwartete Lieferung</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Positionen</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                Aktionen
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow
                key={order.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.02),
                  },
                }}
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.supplier ? order.supplier.legalName : '—'}</TableCell>
                <TableCell>{formatDate(order.timestamp)}</TableCell>
                <TableCell>{formatDate(order.expectedDeliveryDate)}</TableCell>
                <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
                <TableCell>{order.positions ? order.positions.length : 0} Artikel</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {order.orderStatus === 'PLACED' && (
                      <Tooltip title="Als versandt markieren">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleStatusChange(order, 'SHIPPED')}
                          sx={{ mx: 0.5 }}
                        >
                          <ShippingIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {order.orderStatus === 'SHIPPED' && (
                      <Tooltip title="Als geliefert markieren">
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleStatusChange(order, 'DELIVERED')}
                          sx={{ mx: 0.5 }}
                        >
                          <CheckIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {order.orderStatus !== 'DELIVERED' && order.orderStatus !== 'CANCELLED' && (
                      <>
                        <Tooltip title="Bearbeiten">
                          {/* Add onClick handler for edit functionality */}
                          <IconButton size="small" color="info" sx={{ mx: 0.5 }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Löschen">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(order)}
                            sx={{ mx: 0.5 }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={confirmDialogOpen}
        onClose={handleCancelAction}
        PaperProps={{
          sx: {
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Aktion bestätigen</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography>{getConfirmDialogContent()}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCancelAction}
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
            }}
          >
            Abbrechen
          </Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={statusAction === 'delete' ? 'error' : 'primary'}
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
            }}
          >
            Bestätigen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

SupplierOrdersList.propTypes = {
  /** The array of supplier orders to display. */
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      supplier: PropTypes.shape({
        legalName: PropTypes.string,
      }),
      timestamp: PropTypes.string,
      expectedDeliveryDate: PropTypes.string,
      orderStatus: PropTypes.oneOf(['PLACED', 'SHIPPED', 'DELIVERED', 'CANCELLED']).isRequired,
      positions: PropTypes.array,
    })
  ),
  /** Callback function to refresh the order list after an action. */
  onRefresh: PropTypes.func,
};

SupplierOrdersList.defaultProps = {
  orders: [],
  onRefresh: undefined,
};

export default SupplierOrdersList;
