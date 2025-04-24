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

const SupplierOrdersList = ({ orders, onRefresh }) => {
  const theme = useTheme();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [statusAction, setStatusAction] = useState(null);

  const formatDate = dateString => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd.MM.yyyy');
  };

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

  const handleDelete = order => {
    setSelectedOrder(order);
    setStatusAction('delete');
    setConfirmDialogOpen(true);
  };

  const handleStatusChange = (order, newStatus) => {
    setSelectedOrder(order);
    setStatusAction({ type: 'status', status: newStatus });
    setConfirmDialogOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (statusAction === 'delete') {
        await SupplierOrderService.deleteSupplierOrder(selectedOrder.id);
      } else if (statusAction && statusAction.type === 'status') {
        await SupplierOrderService.updateSupplierOrderStatus(selectedOrder.id, statusAction.status);

        // Force refresh inventory data if order was marked as delivered
        if (statusAction.status === 'DELIVERED' && onRefresh) {
          onRefresh();
        }
      }

      setConfirmDialogOpen(false);
      setSelectedOrder(null);
      setStatusAction(null);

      // Ensure refresh happens in all cases
      if (onRefresh) {
        onRefresh();
      }
    } catch (err) {
      console.error('Error processing order action:', err);
      // Could add error handling here
    }
  };

  const handleCancelAction = () => {
    setConfirmDialogOpen(false);
    setSelectedOrder(null);
    setStatusAction(null);
  };

  const getConfirmDialogContent = () => {
    if (!selectedOrder) return '';

    if (statusAction === 'delete') {
      return `Möchten Sie die Bestellung ${selectedOrder.id} wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`;
    } else if (statusAction && statusAction.type === 'status') {
      let message = '';

      if (statusAction.status === 'SHIPPED') {
        message = `Bestellung ${selectedOrder.id} als versendet markieren?`;
      } else if (statusAction.status === 'DELIVERED') {
        message = `Bestellung ${selectedOrder.id} als geliefert markieren? Dies wird die Lagerbestände aktualisieren.`;
      }

      return message;
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

                    {order.orderStatus !== 'DELIVERED' && (
                      <>
                        <Tooltip title="Bearbeiten">
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
  orders: PropTypes.array,
  onRefresh: PropTypes.func,
};

SupplierOrdersList.defaultProps = {
  orders: [],
};

export default SupplierOrdersList;
