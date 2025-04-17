import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Stack } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';

const CartActionButtons = ({
  receiptReady,
  cartIsEmpty,
  onPayment,
  onPrintReceipt,
  onNewTransaction,
}) => {
  if (receiptReady) {
    return (
      <Stack spacing={2}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          startIcon={<ReceiptIcon />}
          onClick={onPrintReceipt}
          sx={{ py: 1.5 }}
        >
          Rechnung drucken
        </Button>
        <Button
          variant="outlined"
          color="primary"
          fullWidth
          startIcon={<ShoppingCartIcon />}
          onClick={onNewTransaction}
          sx={{ py: 1.2 }}
        >
          Neuer Verkauf
        </Button>
      </Stack>
    );
  }

  return (
    <Button
      variant="contained"
      color="primary"
      fullWidth
      startIcon={<PaymentIcon />}
      onClick={onPayment}
      disabled={cartIsEmpty}
      sx={{ py: 1.5 }}
    >
      Zahlung abschließen
    </Button>
  );
};

CartActionButtons.propTypes = {
  receiptReady: PropTypes.bool.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
  onPayment: PropTypes.func.isRequired,
  onPrintReceipt: PropTypes.func.isRequired,
  onNewTransaction: PropTypes.func.isRequired,
};

export default CartActionButtons;
