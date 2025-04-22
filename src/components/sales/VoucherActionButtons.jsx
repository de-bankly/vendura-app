import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from '../ui/buttons';

const VoucherActionButtons = ({ onRedeemVoucher, cartIsEmpty }) => {
  return (
    <Button
      variant="outlined"
      color="primary"
      startIcon={<CardGiftcardIcon />}
      onClick={onRedeemVoucher}
      size="small"
      fullWidth
      disabled={cartIsEmpty}
    >
      Gutschein einlösen
    </Button>
  );
};

VoucherActionButtons.propTypes = {
  onRedeemVoucher: PropTypes.func.isRequired,
  cartIsEmpty: PropTypes.bool.isRequired,
};

export default VoucherActionButtons;
