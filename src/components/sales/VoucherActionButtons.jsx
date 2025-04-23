import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';

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

VoucherActionButtons.propTypes = {
  onRedeemVoucher: PropTypes.func.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
};

export default VoucherActionButtons;
