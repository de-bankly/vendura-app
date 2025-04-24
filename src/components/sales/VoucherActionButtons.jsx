import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import React from 'react';
import { Button } from '../ui/buttons';

/**
 * Renders a button for redeeming a voucher.
 * The button is disabled if the cart is empty or if the disabled prop is true.
 *
 * @param {object} props - The component props.
 * @param {function} props.onRedeemVoucher - Callback function triggered when the button is clicked. Required.
 * @param {boolean} props.cartIsEmpty - Indicates if the shopping cart is currently empty. Required.
 * @param {boolean} [props.disabled=false] - Optional. If true, the button will be disabled regardless of cart status. Defaults to false.
 * @returns {React.ReactElement} The rendered button component.
 */
const VoucherActionButtons = ({ onRedeemVoucher, cartIsEmpty, disabled = false }) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<CardGiftcardIcon />}
      onClick={onRedeemVoucher}
      size="small"
      fullWidth
      disabled={cartIsEmpty || disabled}
    >
      Gutschein einlösen
    </Button>
  );
};

export default VoucherActionButtons;
