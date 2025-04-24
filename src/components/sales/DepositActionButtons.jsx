import ReceiptIcon from '@mui/icons-material/Receipt';
import React from 'react';
import { Button } from '../ui/buttons';

/**
 * Renders a button to redeem a deposit receipt.
 * The button is disabled if the cart is empty or if the disabled prop is true.
 *
 * @param {object} props - The component props.
 * @param {Function} props.onRedeemDeposit - Function to call when the button is clicked.
 * @param {boolean} props.cartIsEmpty - Indicates if the shopping cart is empty.
 * @param {boolean} [props.disabled=false] - Optional. If true, the button is disabled regardless of cart status.
 * @returns {React.ReactElement} The rendered button component.
 */
const DepositActionButtons = ({ onRedeemDeposit, cartIsEmpty, disabled = false }) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<ReceiptIcon />}
      onClick={onRedeemDeposit}
      size="small"
      fullWidth
      disabled={cartIsEmpty || disabled}
    >
      Pfandbeleg einlösen
    </Button>
  );
};

export default DepositActionButtons;
