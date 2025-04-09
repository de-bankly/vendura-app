import React, { useState } from 'react';
import PropTypes from 'prop-types';
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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  LocalShipping as ShippingIcon,
} from '@mui/icons-material';
import { SupplierOrderService } from '../../services';
import { format } from 'date-fns';

const SupplierOrdersList = ({ orders, onRefresh }) => {
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
        label = 'Placed';
        break;
      case 'SHIPPED':
        color = 'warning';
        label = 'Shipped';
        break;
      case 'DELIVERED':
        color = 'success';
        label = 'Delivered';
        break;
      case 'CANCELLED':
        color = 'error';
        label = 'Cancelled';
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
      return `Are you sure you want to delete order ${selectedOrder.purchaseOrderNumber || selectedOrder.id}? This action cannot be undone.`;
    } else if (statusAction && statusAction.type === 'status') {
      let message = '';

      if (statusAction.status === 'SHIPPED') {
        message = `Mark order ${selectedOrder.purchaseOrderNumber || selectedOrder.id} as shipped?`;
      } else if (statusAction.status === 'DELIVERED') {
        message = `Mark order ${selectedOrder.purchaseOrderNumber || selectedOrder.id} as delivered? This will update inventory stock levels.`;
      }

      return message;
    }

    return '';
  };

  if (!orders || orders.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography>No supplier orders found.</Typography>
      </Paper>
    );
  }

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order #</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Expected Delivery</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Items</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell>{order.purchaseOrderNumber || order.id}</TableCell>
                <TableCell>{order.supplier ? order.supplier.legalName : '—'}</TableCell>
                <TableCell>{formatDate(order.timestamp)}</TableCell>
                <TableCell>{formatDate(order.expectedDeliveryDate)}</TableCell>
                <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
                <TableCell>{order.positions ? order.positions.length : 0} items</TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {order.orderStatus === 'PLACED' && (
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleStatusChange(order, 'SHIPPED')}
                        title="Mark as Shipped"
                      >
                        <ShippingIcon />
                      </IconButton>
                    )}

                    {order.orderStatus === 'SHIPPED' && (
                      <IconButton
                        size="small"
                        color="success"
                        onClick={() => handleStatusChange(order, 'DELIVERED')}
                        title="Mark as Delivered"
                      >
                        <CheckIcon />
                      </IconButton>
                    )}

                    {order.orderStatus !== 'DELIVERED' && (
                      <>
                        <IconButton size="small" color="info" title="Edit Order">
                          <EditIcon />
                        </IconButton>

                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(order)}
                          title="Delete Order"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={confirmDialogOpen} onClose={handleCancelAction}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <Typography>{getConfirmDialogContent()}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAction}>Cancel</Button>
          <Button
            onClick={handleConfirmAction}
            variant="contained"
            color={statusAction === 'delete' ? 'error' : 'primary'}
          >
            Confirm
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
